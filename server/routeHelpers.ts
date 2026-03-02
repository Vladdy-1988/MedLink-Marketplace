/**
 * Shared helper utilities used by route handlers and middleware.
 * Extracted here so they can be imported without pulling in the entire routes module.
 */
import { storage } from "./storage";

export function getAuthUserId(req: any): string {
  const userId = req.user?.claims?.sub || req.user?.id;
  if (!userId) {
    throw new Error("Missing authenticated user id");
  }
  return userId;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const user = await storage.getUser(userId);
  return user?.userType === "admin";
}

export async function canAccessUserScope(
  requestUserId: string,
  targetUserId: string,
): Promise<boolean> {
  if (requestUserId === targetUserId) return true;
  return isAdmin(requestUserId);
}

export async function canAccessBooking(
  requestUserId: string,
  bookingId: number,
): Promise<boolean> {
  const booking = await storage.getBooking(bookingId);
  if (!booking) return false;
  if (booking.patientId === requestUserId) return true;

  const provider = await storage.getProvider(booking.providerId);
  if (provider?.userId === requestUserId) return true;

  return isAdmin(requestUserId);
}

export function toDateOrNull(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const parsed = new Date(value as string);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export function toNumberOrNull(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
