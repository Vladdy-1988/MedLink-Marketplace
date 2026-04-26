import { Router } from "express";
import { z } from "zod";
import { isAuthenticated } from "../auth0";
import { storage } from "../storage";
import { getAuthUserId } from "../routeHelpers";
import { insertConsentRecordSchema } from "@shared/schema";
import { auditPhiEvent, handleValidationError } from "./shared";

const patchProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phoneNumber: z.string().max(30).optional().nullable(),
  dateOfBirth: z.string().max(50).optional().nullable(),
  gender: z.string().max(50).optional().nullable(),
});

const router = Router();
const checkAuth = isAuthenticated;

router.get("/config/public", (_req, res) => {
  const stripePublicKey =
    process.env.STRIPE_PUBLIC_KEY || process.env.VITE_STRIPE_PUBLIC_KEY || "";

  res.json({
    stripePublicKey: stripePublicKey.startsWith("pk_") ? stripePublicKey : null,
  });
});

// Current authenticated user
router.get("/auth/user", checkAuth, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = getAuthUserId(req);
    const freshUser = await storage.getUser(userId);
    res.json(freshUser || req.user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Consent routes (HIPAA / HIA compliance)
router.post("/user/consent", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const parsed = insertConsentRecordSchema.safeParse({
      ...req.body,
      userId,
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.headers["user-agent"] || "",
    });
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid consent data", errors: parsed.error.errors });
    }
    const record = await storage.createConsentRecord(parsed.data);
    await auditPhiEvent(
      req,
      "grant_consent",
      "consent",
      String(record.id),
      `Consent type: ${record.consentType}`,
    );
    res.status(201).json(record);
  } catch (error) {
    console.error("Error creating consent record:", error);
    res.status(500).json({ message: "Failed to record consent" });
  }
});

router.get("/user/consent", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const records = await storage.getConsentRecords(userId);
    res.json(records);
  } catch (error) {
    console.error("Error fetching consent records:", error);
    res.status(500).json({ message: "Failed to fetch consent records" });
  }
});

router.post("/user/onboarding/complete", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    await storage.markOnboardingComplete(userId);
    await auditPhiEvent(req, "complete_onboarding", "user", userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    res.status(500).json({ message: "Failed to complete onboarding" });
  }
});

router.patch("/user/profile", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const parsed = patchProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid request payload", details: parsed.error.issues });
    }
    const { firstName, lastName, phoneNumber, dateOfBirth, gender } = parsed.data;
    const updates: Record<string, any> = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    if (dateOfBirth !== undefined)
      updates.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (gender !== undefined) updates.gender = gender;
    const updated = await storage.updateUser(userId, updates);
    res.json(updated);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;
