/**
 * Utilities shared across route sub-modules.
 */
import { storage } from "../storage";
import { getAuthUserId } from "../routeHelpers";
import { z } from "zod";
import type { Response } from "express";

export async function auditPhiEvent(
  req: any,
  action: string,
  targetType: string,
  targetId: string,
  reason?: string,
): Promise<void> {
  try {
    await storage.createAuditLog({
      adminId: getAuthUserId(req),
      action,
      targetType,
      targetId,
      reason,
      ipAddress: req.ip || "",
      userAgent: req.get("User-Agent") || "",
    });
  } catch (error) {
    // Auditing must not break user-facing workflows.
    console.error("Failed to write PHI audit log:", error);
  }
}

export function handleValidationError(error: unknown, res: Response): boolean {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: "Invalid request payload", details: error.issues });
    return true;
  }
  return false;
}
