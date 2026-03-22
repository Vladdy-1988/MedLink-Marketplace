import { Router } from "express";
import { z } from "zod";
import { isAuthenticated } from "../auth0";
import { storage } from "../storage";
import {
  getAuthUserId,
  isAdmin,
  canAccessBooking,
} from "../routeHelpers";
import { bookingRateLimit } from "../middleware/rateLimit";
import { insertBookingSchema } from "@shared/schema";
import { emailService } from "../emailService";
import { handleValidationError } from "./shared";
import { dispatchClaimsHubEvent } from "../claimsHubClient";

const patchStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});

const cancelSchema = z.object({
  reason: z.string().max(1000).optional(),
});

const rescheduleSchema = z.object({
  newDate: z.coerce.date(),
  reason: z.string().max(1000).optional(),
});

const router = Router();
const checkAuth = isAuthenticated;

// Create booking
router.post("/bookings", checkAuth, bookingRateLimit, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const bookingData = insertBookingSchema.parse({
      ...req.body,
      patientId: userId,
      scheduledDate: req.body.scheduledDate
        ? new Date(req.body.scheduledDate)
        : req.body.scheduledDate,
    });
    const scheduledDate = new Date(bookingData.scheduledDate);

    if (scheduledDate.getTime() <= Date.now()) {
      return res
        .status(422)
        .json({ message: "Scheduled date must be in the future" });
    }

    const conflictingBookings = await storage.getBookingsByProviderAndDate(
      bookingData.providerId,
      scheduledDate,
    );
    if (conflictingBookings.length > 0) {
      return res.status(409).json({ message: "This slot is already taken" });
    }

    const service = await storage.getService(bookingData.serviceId);
    if (!service || service.price == null) {
      return res
        .status(422)
        .json({ message: "Service not found or price unavailable" });
    }

    const totalAmount = Number(service.price);
    if (!Number.isFinite(totalAmount)) {
      return res
        .status(422)
        .json({ message: "Service not found or price unavailable" });
    }

    const booking = await storage.createBooking({
      ...bookingData,
      scheduledDate,
      status: "pending",
      paymentStatus: "unpaid",
      totalAmount: totalAmount.toFixed(2),
    });

    // Send email notifications
    const patient = await storage.getUser(userId);
    const provider = await storage.getProvider(booking.providerId);
    const providerUser = provider ? await storage.getUser(provider.userId) : null;

    if (patient && providerUser && service) {
      await emailService.sendBookingConfirmation(
        patient.email!,
        `${patient.firstName} ${patient.lastName}`,
        `${providerUser.firstName} ${providerUser.lastName}`,
        service.name,
        new Date(booking.scheduledDate),
        booking.id,
      );
      await emailService.sendProviderNotification(
        providerUser.email!,
        `${providerUser.firstName} ${providerUser.lastName}`,
        `${patient.firstName} ${patient.lastName}`,
        service.name,
        new Date(booking.scheduledDate),
        booking.id,
      );
    }

    // Notify ClaimsHub (fire-and-forget)
    void dispatchClaimsHubEvent("booking_created", {
      bookingId: booking.id,
      patientId: booking.patientId,
      providerId: booking.providerId,
      serviceId: booking.serviceId,
      amount: booking.totalAmount,
    });

    // Analytics (fire-and-forget)
    void storage.recordAnalytics({
      date: new Date(),
      metric: "daily_bookings",
      value: "1",
      category: "bookings",
      metadata: null,
    }).catch((err) => console.error("Analytics error:", err));

    res.json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(400).json({ message: "Failed to create booking" });
  }
});

// Get bookings for a patient
router.get("/bookings/patient/:patientId", checkAuth, async (req, res) => {
  try {
    const requestUserId = getAuthUserId(req);
    const { canAccessUserScope } = await import("../routeHelpers");
    if (!(await canAccessUserScope(requestUserId, req.params.patientId))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const bookings = await storage.getBookingsByPatient(req.params.patientId);
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching patient bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// Get bookings for a provider
router.get("/bookings/provider/:providerId", checkAuth, async (req, res) => {
  try {
    const requestUserId = getAuthUserId(req);
    const providerId = Number(req.params.providerId);
    const provider = await storage.getProvider(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    if (
      provider.userId !== requestUserId &&
      !(await isAdmin(requestUserId))
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    const bookings = await storage.getBookingsByProvider(providerId);
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching provider bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// Update booking status
router.patch("/bookings/:id/status", checkAuth, async (req, res) => {
  try {
    const parsed = patchStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid request payload", details: parsed.error.issues });
    }
    const { status } = parsed.data;
    const requestUserId = getAuthUserId(req);
    const bookingId = Number(req.params.id);
    const booking = await storage.getBooking(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const provider = await storage.getProvider(booking.providerId);
    const canUpdateStatus =
      provider?.userId === requestUserId || (await isAdmin(requestUserId));
    if (!canUpdateStatus) {
      return res.status(403).json({ message: "Access denied" });
    }
    await storage.updateBookingStatus(bookingId, status);

    // Status update email
    const patient = await storage.getUser(booking.patientId);
    const providerUser = provider ? await storage.getUser(provider.userId) : null;
    const service = await storage.getService(booking.serviceId);
    if (patient && providerUser && service) {
      await emailService.sendBookingStatusUpdate(
        patient.email!,
        `${patient.firstName} ${patient.lastName}`,
        `${providerUser.firstName} ${providerUser.lastName}`,
        service.name,
        status,
        booking.id,
      );
    }

    // Notify ClaimsHub when visit is completed (fire-and-forget)
    if (status === "completed") {
      void dispatchClaimsHubEvent("visit_completed", {
        bookingId: booking.id,
        patientId: booking.patientId,
        providerId: booking.providerId,
        serviceId: booking.serviceId,
        amount: booking.totalAmount,
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Failed to update booking" });
  }
});

// Get single booking
router.get("/bookings/:id", checkAuth, async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const requestUserId = getAuthUserId(req);
    if (!(await canAccessBooking(requestUserId, bookingId))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const booking = await storage.getBooking(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
});

// Booking details (with joins)
router.get("/bookings/:id/details", checkAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const requestUserId = getAuthUserId(req);
    if (!(await canAccessBooking(requestUserId, id))) {
      return res.status(403).json({ error: "Access denied" });
    }
    const booking = await storage.getBookingWithDetails(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Cancel booking
router.post("/bookings/:id/cancel", checkAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = cancelSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid request payload", details: parsed.error.issues });
    }
    const userId = getAuthUserId(req);
    if (!(await canAccessBooking(userId, id))) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Fetch booking before cancelling so we have providerId + scheduledDate for waitlist
    const booking = await storage.getBooking(id);
    await storage.cancelBooking(id, userId, parsed.data.reason);

    // Notify waitlisted patients (fire-and-forget)
    if (booking) {
      void (async () => {
        try {
          const toNotify = await storage.notifyWaitlistEntries(
            booking.providerId,
            new Date(booking.scheduledDate),
          );
          if (toNotify.length > 0) {
            const provider = await storage.getProvider(booking.providerId);
            const providerUser = provider ? await storage.getUser(provider.userId) : null;
            const providerName = providerUser
              ? `${providerUser.firstName ?? ""} ${providerUser.lastName ?? ""}`.trim()
              : "your provider";
            for (const entry of toNotify) {
              const patient = await storage.getUser(entry.patientId);
              if (patient?.email) {
                await emailService.sendWaitlistNotification(
                  patient.email,
                  providerName,
                  new Date(booking.scheduledDate),
                );
              }
            }
          }
        } catch (err) {
          console.error("Waitlist notification error:", err);
        }
      })();
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Reschedule booking
router.post("/bookings/:id/reschedule", checkAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = rescheduleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid request payload", details: parsed.error.issues });
    }
    const userId = getAuthUserId(req);
    if (!(await canAccessBooking(userId, id))) {
      return res.status(403).json({ error: "Access denied" });
    }
    await storage.rescheduleBooking(id, parsed.data.newDate, userId, parsed.data.reason);
    res.status(204).send();
  } catch (error) {
    console.error("Error rescheduling booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Booking documents
router.get("/bookings/:id/documents", checkAuth, async (req: any, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const requestUserId = getAuthUserId(req);
    if (!(await canAccessBooking(requestUserId, bookingId))) {
      return res.status(403).json({ error: "Access denied" });
    }
    const documents = await storage.getBookingDocuments(bookingId);
    res.json(documents);
  } catch (error) {
    console.error("Error fetching booking documents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Booking status history
router.get(
  "/bookings/:id/status-history",
  checkAuth,
  async (req: any, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const requestUserId = getAuthUserId(req);
      if (!(await canAccessBooking(requestUserId, bookingId))) {
        return res.status(403).json({ error: "Access denied" });
      }
      const history = await storage.getBookingStatusHistory(bookingId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching booking status history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
