import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { getAuthUserId } from "../routeHelpers";

/**
 * Middleware: rejects the request with 403 unless the authenticated user
 * has userType === 'admin' in the database.
 *
 * Must be placed AFTER checkAuth (isAuthenticated) in the middleware chain.
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthUserId(req as any);
    const user = await storage.getUser(userId);
    if (user?.userType !== "admin") {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    next();
  } catch {
    res.status(403).json({ message: "Access denied" });
  }
}

/**
 * Middleware: rejects the request with 403 unless the authenticated user
 * has userType === 'provider' or 'admin'.
 *
 * Must be placed AFTER checkAuth (isAuthenticated) in the middleware chain.
 */
export async function requireProvider(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthUserId(req as any);
    const user = await storage.getUser(userId);
    if (user?.userType !== "provider" && user?.userType !== "admin") {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    next();
  } catch {
    res.status(403).json({ message: "Access denied" });
  }
}
