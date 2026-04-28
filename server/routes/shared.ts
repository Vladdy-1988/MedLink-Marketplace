/**
 * Utilities shared across route sub-modules.
 */
import { storage } from "../storage";
import { getAuthUserId } from "../routeHelpers";
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

function getValidationIssues(error: unknown): unknown[] | null {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const maybeError = error as { issues?: unknown; errors?: unknown };
  if (Array.isArray(maybeError.issues)) {
    return maybeError.issues;
  }
  if (Array.isArray(maybeError.errors)) {
    return maybeError.errors;
  }

  return null;
}

export function handleValidationError(
  error: unknown,
  res: Response,
  message = "Invalid request payload",
): boolean {
  const details = getValidationIssues(error);
  if (details) {
    res.status(400).json({ error: message, details });
    return true;
  }
  return false;
}
