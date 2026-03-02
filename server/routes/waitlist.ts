import { Router } from "express";
import { z } from "zod";
import { isAuthenticated } from "../auth0";
import { storage } from "../storage";
import { getAuthUserId } from "../routeHelpers";
import { handleValidationError } from "./shared";

const createWaitlistSchema = z.object({
  providerId: z.number().int().positive(),
  serviceId: z.number().int().positive().optional(),
  preferredDateRange: z
    .object({ start: z.string(), end: z.string() })
    .optional(),
  notes: z.string().max(1000).optional(),
});

const router = Router();
const checkAuth = isAuthenticated;

// POST /api/waitlist — join a provider's waitlist
router.post("/waitlist", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const parsed = createWaitlistSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request payload", details: parsed.error.issues });
    }

    const provider = await storage.getProvider(parsed.data.providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const entry = await storage.createWaitlistEntry({
      patientId: userId,
      providerId: parsed.data.providerId,
      serviceId: parsed.data.serviceId ?? null,
      preferredDateRange: parsed.data.preferredDateRange ?? null,
      notes: parsed.data.notes ?? null,
      status: "waiting",
    });

    res.status(201).json(entry);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error creating waitlist entry:", error);
    res.status(500).json({ message: "Failed to join waitlist" });
  }
});

// GET /api/waitlist — patient's own waitlist entries
router.get("/waitlist", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const entries = await storage.getWaitlistByPatient(userId);
    res.json(entries);
  } catch (error) {
    console.error("Error fetching waitlist:", error);
    res.status(500).json({ message: "Failed to fetch waitlist" });
  }
});

// DELETE /api/waitlist/:id — cancel a waitlist spot
router.delete("/waitlist/:id", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const id = Number(req.params.id);
    const deleted = await storage.deleteWaitlistEntry(id, userId);
    if (!deleted) {
      return res.status(404).json({ message: "Waitlist entry not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting waitlist entry:", error);
    res.status(500).json({ message: "Failed to remove waitlist entry" });
  }
});

export default router;
