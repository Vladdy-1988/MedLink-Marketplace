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

const router = Router();
const checkAuth = isAuthenticated;

// --- Provider CRUD ---

router.post("/providers", checkAuth, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub || req.user?.id;
    const providerData = insertProviderSchema.parse({ ...req.body, userId });
    const provider = await storage.createProvider(providerData);
    res.json(provider);
  } catch (error) {
    console.error("Error creating provider:", error);
    res.status(400).json({ message: "Failed to create provider" });
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
      serviceType: req.query.serviceType as string,
      location: req.query.location as string,
      priceRange:
        req.query.priceMin && req.query.priceMax
          ? ([Number(req.query.priceMin), Number(req.query.priceMax)] as [
              number,
              number,
            ])
          : undefined,
      rating: req.query.rating ? Number(req.query.rating) : undefined,
    };
    const providers = await storage.searchProviders(filters);
    res.json(providers);
  } catch (error) {
    console.error("Error searching providers:", error);
    res.status(500).json({ message: "Failed to search providers" });
  }
});

// NOTE: specific paths must be declared before the /:id catch-all
router.get("/providers/credentials/:userId", checkAuth, async (_req, res) => {
  try {
    res.json([]);
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

// --- Services ---

router.post("/services", checkAuth, async (req, res) => {
  try {
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

router.get(
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
