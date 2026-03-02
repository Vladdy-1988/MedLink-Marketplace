import type { Request, Response, NextFunction } from "express";

// Routes that must be exempt from Origin validation:
//   - OAuth redirects don't carry an Origin header (browser navigation)
//   - Stripe webhook is verified by its own signature
const EXEMPT_PATHS = new Set([
  "/api/login",
  "/api/callback",
  "/api/logout",
  "/api/webhooks/stripe",
]);

// Safe HTTP methods — no state change possible, nothing to protect.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Derives the set of allowed origins from the environment.
 * In production the app lives on mymedlink.ca; in development on localhost.
 */
function getAllowedOrigins(): Set<string> {
  const origins = new Set<string>();

  // Pull the base origin from AUTH0_CALLBACK_URL if available
  // e.g. "https://mymedlink.ca/api/callback" → "https://mymedlink.ca"
  const callbackUrl = process.env.AUTH0_CALLBACK_URL;
  if (callbackUrl) {
    try {
      const { origin } = new URL(callbackUrl);
      origins.add(origin);
      // Also accept the bare domain without www / subdomain prefix
      origins.add("https://mymedlink.ca");
      origins.add("https://www.mymedlink.ca");
    } catch {
      // Malformed URL — fall through to defaults
    }
  }

  // Always allow localhost variants for development
  origins.add("http://localhost:5000");
  origins.add("http://localhost:3000");

  // Replit dev environment
  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    origins.add(
      `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`,
    );
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    origins.add(`https://${process.env.REPLIT_DEV_DOMAIN}`);
  }

  return origins;
}

/**
 * CSRF protection via Origin / Referer header validation.
 *
 * For every state-changing request (POST, PUT, PATCH, DELETE) against /api/*
 * that is not on the exempt list, we verify that the Origin (or Referer) header
 * matches the app's known origins. Requests with no header at all are rejected —
 * browsers always send Origin on cross-site POSTs.
 *
 * This is a defence-in-depth layer; the session cookies already use SameSite
 * and httpOnly. Server-to-server callers (e.g. Stripe) are on the exempt list.
 */
export function csrfProtection(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Safe methods cannot mutate state — skip.
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  // Non-API routes (e.g. static assets) are not affected.
  if (!req.path.startsWith("/api/")) {
    return next();
  }

  // Exempt paths have their own verification mechanisms.
  if (EXEMPT_PATHS.has(req.path)) {
    return next();
  }

  const allowedOrigins = getAllowedOrigins();

  // Prefer Origin header; fall back to the origin part of Referer.
  const originHeader = req.headers["origin"] as string | undefined;
  const refererHeader = req.headers["referer"] as string | undefined;

  let requestOrigin: string | null = null;

  if (originHeader) {
    requestOrigin = originHeader;
  } else if (refererHeader) {
    try {
      requestOrigin = new URL(refererHeader).origin;
    } catch {
      requestOrigin = null;
    }
  }

  if (!requestOrigin || !allowedOrigins.has(requestOrigin)) {
    res.status(403).json({ message: "CSRF check failed" });
    return;
  }

  next();
}
