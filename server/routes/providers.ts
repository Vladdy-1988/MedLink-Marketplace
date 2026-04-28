import { Router } from "express";
import { z } from "zod";
import { isAuthenticated } from "../auth0";
import { storage } from "../storage";
import { getAuthUserId, canAccessUserScope, isAdmin } from "../routeHelpers";
import { requireProvider } from "../middleware/guards";
import {
  insertProviderSchema,
  insertServiceSchema,
  insertProviderCredentialSchema,
  insertProviderAvailabilitySchema,
  insertProviderBlackoutSchema,
  insertProviderPatientNotesSchema,
} from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "../objectStorage";
import { handleValidationError } from "./shared";

const reportSchema = z.object({
  reason: z.enum(["no_show", "unprofessional", "fraud", "other"]),
  details: z.string().min(1).max(2000),
  bookingId: z.number().int().optional(),
});

const providerApplicationSchema = z.object({
  specialization: z.string().trim().min(1).max(120),
  licenseNumber: z.string().trim().min(1).max(120),
  yearsExperience: z.coerce.number().int().min(0).max(50),
  bio: z.string().trim().min(50).max(5000).nullable().optional(),
  serviceAreas: z.array(z.string().trim().min(1)).min(1),
  insuranceAccepted: z.array(z.string().trim()).optional().default([]),
  availability: z
    .union([z.string().trim().min(1), z.record(z.any()), z.array(z.any())])
    .nullable()
    .optional(),
  basePricing: z
    .union([z.string().trim().min(1), z.number().nonnegative()])
    .nullable()
    .optional(),
});

const SLOT_DURATION_MS = 60 * 60 * 1000;

function parseLocalDate(dateString: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function parseTimeToMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function buildSlotDate(date: Date, minutes: number): Date {
  const slot = new Date(date);
  slot.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return slot;
}

function formatSlotTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

const router = Router();
const providerObjectsRouter = Router();
const checkAuth = isAuthenticated;

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

// --- Provider CRUD ---

router.post("/providers", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const existing = await storage.getProviderByUserId(userId);
    if (existing) {
      return res
        .status(409)
        .json({ message: "You already have a provider profile" });
    }
    const validatedData = providerApplicationSchema.parse(req.body);
    const providerData = insertProviderSchema.parse({
      ...validatedData,
      insuranceAccepted: validatedData.insuranceAccepted ?? [],
      userId,
    });
    const provider = await storage.createProvider(providerData);
    res.status(201).json(provider);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return res
        .status(409)
        .json({ message: "You already have a provider profile" });
    }
    if (handleValidationError(error, res, "Invalid provider data")) return;
    console.error("Error creating provider:", error);
    res.status(500).json({ message: "Failed to create provider" });
  }
});

router.get("/providers/me", checkAuth, async (req: any, res) => {
  try {
    const provider = await storage.getProviderByUserId(getAuthUserId(req));
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json(provider);
  } catch (error) {
    console.error("Error fetching current provider:", error);
    res.status(500).json({ message: "Failed to fetch provider" });
  }
});

router.get("/providers", async (_req, res) => {
  try {
    const providers = await storage.getMarketplaceProviders();
    res.json(providers);
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ message: "Failed to fetch providers" });
  }
});

router.get("/providers/search", async (req, res) => {
  try {
    const filters = {
      q: req.query.q as string | undefined,
      serviceType: req.query.serviceType as string | undefined,
      location: req.query.location as string | undefined,
      priceRange:
        req.query.priceMin && req.query.priceMax
          ? ([Number(req.query.priceMin), Number(req.query.priceMax)] as [number, number])
          : undefined,
      rating: req.query.rating ? Number(req.query.rating) : undefined,
      sortBy: req.query.sortBy as string | undefined,
    };
    const results = await storage.searchProviders(filters);
    res.json(results);
  } catch (error) {
    console.error("Error searching providers:", error);
    res.status(500).json({ message: "Failed to search providers" });
  }
});

// NOTE: specific paths must be declared before the /:id catch-all
router.get("/providers/credentials/:userId", checkAuth, async (req, res) => {
  try {
    const requestUserId = getAuthUserId(req);
    if (!(await canAccessUserScope(requestUserId, req.params.userId))) {
      return res.status(403).json({ message: "Access denied" });
    }

    const credentials = await storage.getCredentialsByProvider(req.params.userId);
    res.json(credentials);
  } catch (error) {
    console.error("Error fetching credentials:", error);
    res.status(500).json({ message: "Failed to fetch credentials" });
  }
});

router.post(
  "/providers/documents/upload",
  checkAuth,
  requireProvider,
  async (req: any, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getProviderDocumentUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ message: "Failed to generate upload URL" });
    }
  },
);

router.post("/providers/credentials", checkAuth, async (req: any, res) => {
  try {
    const provider = await storage.getProviderByUserId(getAuthUserId(req));
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    const objectStorageService = new ObjectStorageService();
    const documentPath = objectStorageService.normalizeProviderDocumentPath(
      req.body.documentUrl,
    );
    const credentialData = insertProviderCredentialSchema.parse({
      providerId: provider.id,
      credentialType: req.body.credentialType,
      documentUrl: documentPath,
      documentName: req.body.documentName,
      expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null,
    });
    const credential = await storage.createProviderCredential(credentialData);
    res.json(credential);
  } catch (error) {
    console.error("Error creating credential:", error);
    res.status(500).json({ message: "Failed to create credential" });
  }
});

router.get("/providers/user/:userId", checkAuth, async (req, res) => {
  try {
    const requestUserId = getAuthUserId(req);
    if (!(await canAccessUserScope(requestUserId, req.params.userId))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const provider = await storage.getProviderByUserId(req.params.userId);
    res.json(provider);
  } catch (error) {
    console.error("Error fetching provider by user:", error);
    res.status(500).json({ message: "Failed to fetch provider" });
  }
});

router.get("/providers/earnings", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const provider = await storage.getProviderByUserId(userId);
    if (!provider) return res.status(403).json({ error: "Provider not found" });
    const earnings = await storage.getProviderEarnings(provider.id);
    res.json(earnings);
  } catch (err) {
    console.error("Earnings error:", err);
    res.status(500).json({ error: "Failed to fetch earnings" });
  }
});

router.get("/providers/:id", async (req, res) => {
  try {
    const provider = await storage.getMarketplaceProviderById(
      Number(req.params.id),
    );
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.json(provider);
  } catch (error) {
    console.error("Error fetching provider:", error);
    res.status(500).json({ message: "Failed to fetch provider" });
  }
});

router.patch("/providers/:id", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const provider = await storage.getProviderByUserId(userId);
    if (!provider || provider.id !== parseInt(req.params.id)) {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    const allowedFields = [
      "specialization",
      "bio",
      "basePricing",
      "serviceAreas",
      "insuranceAccepted",
      "yearsExperience",
    ];
    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const updated = await storage.updateProvider(provider.id, updates);
    res.json(updated);
  } catch (error) {
    console.error("Error updating provider:", error);
    res.status(500).json({ message: "Failed to update provider profile" });
  }
});

// --- Services ---

router.get("/services/:id", async (req, res) => {
  try {
    const serviceId = Number(req.params.id);
    if (!Number.isFinite(serviceId)) {
      return res.status(400).json({ message: "Invalid service id" });
    }

    const service = await storage.getService(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ message: "Failed to fetch service" });
  }
});

router.post("/services", checkAuth, async (req, res) => {
  try {
    const requestUserId = getAuthUserId(req);
    const provider = await storage.getProvider(Number(req.body.providerId));
    const canManageServices =
      provider?.userId === requestUserId || (await isAdmin(requestUserId));

    if (!canManageServices) {
      return res.status(403).json({ message: "Access denied" });
    }

    const serviceData = insertServiceSchema.parse(req.body);
    const service = await storage.createService(serviceData);
    res.json(service);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(400).json({ message: "Failed to create service" });
  }
});

router.get("/providers/:providerId/services", async (req, res) => {
  try {
    const services = await storage.getServicesByProvider(
      Number(req.params.providerId),
    );
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

// --- Reviews ---

router.get("/reviews", async (_req, res) => {
  try {
    const reviews = await storage.getAllReviews();
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

router.post("/reviews", checkAuth, async (req: any, res) => {
  try {
    const { insertReviewSchema } = await import("@shared/schema");
    const userId = getAuthUserId(req);
    const reviewData = insertReviewSchema.parse({ ...req.body, patientId: userId });

    // Verify the booking exists and belongs to this patient
    const booking = await storage.getBooking(reviewData.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.patientId !== userId) {
      return res.status(403).json({ message: "You can only review your own bookings" });
    }
    if (booking.status !== "completed") {
      return res.status(422).json({ message: "You can only review completed bookings" });
    }

    // Prevent duplicate reviews for the same booking
    const existing = await storage.getReviewByBookingId(reviewData.bookingId);
    if (existing) {
      return res.status(409).json({ message: "You have already reviewed this booking" });
    }

    const review = await storage.createReview(reviewData);
    res.json(review);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error creating review:", error);
    res.status(400).json({ message: "Failed to create review" });
  }
});

router.get("/providers/:providerId/reviews", async (req, res) => {
  try {
    const reviews = await storage.getReviewsForProvider(
      Number(req.params.providerId),
    );
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

router.post("/providers/:id/report", checkAuth, async (req: any, res) => {
  try {
    const providerId = Number(req.params.id);
    const userId = getAuthUserId(req);

    const parsed = reportSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request payload", details: parsed.error.issues });
    }

    const provider = await storage.getProvider(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const report = await storage.createUserReport({
      patientId: userId,
      providerId,
      bookingId: parsed.data.bookingId ?? null,
      reason: parsed.data.reason,
      details: parsed.data.details,
      status: "pending",
    });

    await storage.createAuditLog({
      adminId: userId,
      action: "patient_report_provider",
      targetType: "provider",
      targetId: String(providerId),
      reason: parsed.data.reason,
      ipAddress: req.ip || "",
      userAgent: req.get("User-Agent") || "",
    });

    res.status(201).json(report);
  } catch (error) {
    console.error("Error creating provider report:", error);
    res.status(500).json({ message: "Failed to submit report" });
  }
});

// --- Availability & Blackouts ---

router.get("/providers/:id/available-slots", async (req, res) => {
  try {
    const providerId = parseInt(req.params.id, 10);
    if (Number.isNaN(providerId)) {
      return res.status(400).json({ message: "Invalid provider id" });
    }

    const requestedDate = parseLocalDate(String(req.query.date ?? ""));
    if (!requestedDate) {
      return res.status(400).json({ message: "Invalid date query parameter" });
    }

    const provider = await storage.getProvider(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const availability = await storage.getProviderAvailability(providerId);
    const dayAvailability = availability.filter(
      (entry) =>
        entry.dayOfWeek === requestedDate.getDay() && entry.isAvailable !== false,
    );
    if (dayAvailability.length === 0) {
      return res.json([]);
    }

    const dayStart = new Date(requestedDate);
    const dayEnd = new Date(requestedDate);
    dayEnd.setHours(23, 59, 59, 999);

    const blackouts = await storage.getProviderBlackouts(providerId);
    const hasBlackout = blackouts.some((blackout) => {
      const blackoutStart = new Date(blackout.startDate);
      const blackoutEnd = new Date(blackout.endDate);
      return blackoutStart <= dayEnd && blackoutEnd >= dayStart;
    });
    if (hasBlackout) {
      return res.json([]);
    }

    const existingBookings = await storage.getBookingsByProvider(providerId);
    const dayBookings = existingBookings.filter((booking) => {
      if (booking.status === "cancelled") {
        return false;
      }

      const bookingDate = new Date(booking.scheduledDate);
      return bookingDate >= dayStart && bookingDate <= dayEnd;
    });

    const availableSlotTimes = new Set<number>();
    for (const entry of dayAvailability) {
      const startMinutes = parseTimeToMinutes(entry.startTime);
      const endMinutes = parseTimeToMinutes(entry.endTime);

      for (
        let slotMinutes = startMinutes;
        slotMinutes + 60 <= endMinutes;
        slotMinutes += 60
      ) {
        const slotDate = buildSlotDate(requestedDate, slotMinutes);
        if (slotDate.getTime() <= Date.now()) {
          continue;
        }

        const isBooked = dayBookings.some((booking) => {
          const bookingDate = new Date(booking.scheduledDate);
          return (
            Math.abs(bookingDate.getTime() - slotDate.getTime()) < SLOT_DURATION_MS
          );
        });

        if (!isBooked) {
          availableSlotTimes.add(slotDate.getTime());
        }
      }
    }

    const availableSlots = Array.from(availableSlotTimes)
      .sort((a, b) => a - b)
      .map((slotTime) => formatSlotTime(new Date(slotTime)));

    res.json(availableSlots);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ message: "Failed to fetch available slots" });
  }
});

router.post(
  "/providers/:id/availability",
  checkAuth,
  async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const requestUserId = getAuthUserId(req);
      const provider = await storage.getProvider(providerId);
      if (!provider) {
        return res.status(404).json({ error: "Provider not found" });
      }
      if (
        provider.userId !== requestUserId &&
        !(await isAdmin(requestUserId))
      ) {
        return res.status(403).json({ error: "Access denied" });
      }
      const payload = insertProviderAvailabilitySchema.parse({
        ...req.body,
        providerId,
      });
      const availability = await storage.createProviderAvailability(payload);
      res.status(201).json(availability);
    } catch (error) {
      if (handleValidationError(error, res)) return;
      console.error("Error creating provider availability:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.get("/providers/:id/availability", async (req, res) => {
  try {
    const providerId = parseInt(req.params.id);
    const availability = await storage.getProviderAvailability(providerId);
    res.json(availability);
  } catch (error) {
    console.error("Error fetching provider availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/providers/:id/blackouts", checkAuth, async (req: any, res) => {
  try {
    const providerId = parseInt(req.params.id);
    const requestUserId = getAuthUserId(req);
    const provider = await storage.getProvider(providerId);
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }
    if (provider.userId !== requestUserId && !(await isAdmin(requestUserId))) {
      return res.status(403).json({ error: "Access denied" });
    }
    const blackout = await storage.createProviderBlackout(
      insertProviderBlackoutSchema.parse({ ...req.body, providerId }),
    );
    res.status(201).json(blackout);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error creating provider blackout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/providers/:id/blackouts", async (req, res) => {
  try {
    const providerId = parseInt(req.params.id);
    const blackouts = await storage.getProviderBlackouts(providerId);
    res.json(blackouts);
  } catch (error) {
    console.error("Error fetching provider blackouts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/providers/:providerId/blackouts/:id", checkAuth, async (req: any, res) => {
  try {
    const providerId = parseInt(req.params.providerId);
    const blackoutId = parseInt(req.params.id);
    const requestUserId = getAuthUserId(req);
    const provider = await storage.getProvider(providerId);
    if (!provider) return res.status(404).json({ error: "Provider not found" });
    if (provider.userId !== requestUserId && !(await isAdmin(requestUserId))) {
      return res.status(403).json({ error: "Access denied" });
    }
    await storage.deleteProviderBlackout(blackoutId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting blackout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Provider–patient notes ---

router.post(
  "/providers/:providerId/patients/:patientId/notes",
  checkAuth,
  async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const { patientId } = req.params;
      const requestUserId = getAuthUserId(req);
      const provider = await storage.getProvider(providerId);
      if (!provider) {
        return res.status(404).json({ error: "Provider not found" });
      }
      if (
        provider.userId !== requestUserId &&
        !(await isAdmin(requestUserId))
      ) {
        return res.status(403).json({ error: "Access denied" });
      }
      const notes = await storage.createProviderPatientNotes(
        insertProviderPatientNotesSchema.parse({
          ...req.body,
          providerId,
          patientId,
          createdBy: requestUserId,
        }),
      );
      res.status(201).json(notes);
    } catch (error) {
      if (handleValidationError(error, res)) return;
      console.error("Error creating provider patient notes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.get(
  "/providers/:providerId/patients/:patientId/notes",
  checkAuth,
  async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const { patientId } = req.params;
      const requestUserId = getAuthUserId(req);
      const provider = await storage.getProvider(providerId);
      if (!provider) {
        return res.status(404).json({ error: "Provider not found" });
      }
      const canAccess =
        provider.userId === requestUserId ||
        requestUserId === patientId ||
        (await isAdmin(requestUserId));
      if (!canAccess) {
        return res.status(403).json({ error: "Access denied" });
      }
      const notes = await storage.getProviderPatientNotes(
        providerId,
        patientId,
      );
      res.json(notes);
    } catch (error) {
      console.error("Error fetching provider patient notes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// --- Serve provider documents (admin-only) ---

providerObjectsRouter.get(
  "/objects/provider-documents/:documentId(*)",
  checkAuth,
  async (req: any, res) => {
    try {
      const userId = getAuthUserId(req);
      const user = await storage.getUser(userId);
      if (user?.userType !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      const objectStorageService = new ObjectStorageService();
      const documentFile = await objectStorageService.getProviderDocumentFile(
        req.path,
      );
      objectStorageService.downloadObject(documentFile, res);
    } catch (error) {
      console.error("Error accessing document:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ message: "Document not found" });
      }
      return res.status(500).json({ message: "Failed to access document" });
    }
  },
);

export default router;
export { providerObjectsRouter };
