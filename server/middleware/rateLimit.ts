import rateLimit, { ipKeyGenerator } from "express-rate-limit";

/**
 * Auth endpoints: 10 requests per 15 minutes per IP.
 * Protects /api/login and /api/callback from brute-force.
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again later." },
});

/**
 * Booking creation: 20 requests per hour per IP.
 * Applied to POST /api/bookings.
 */
export const bookingRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Prefer authenticated user ID so limits follow the user, not just their IP.
    const userId = (req as any).user?.id || (req as any).user?.claims?.sub;
    return userId ?? ipKeyGenerator(req.ip ?? "unknown");
  },
  message: { message: "Too many booking requests. Please try again later." },
});

/**
 * Payment endpoints: 10 requests per hour per user/IP.
 * Applied to /api/create-payment-intent, /api/payment/confirm, /api/webhooks/stripe.
 */
export const paymentRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => {
    const userId = (req as any).user?.id || (req as any).user?.claims?.sub;
    return userId ?? ipKeyGenerator(req.ip ?? "unknown");
  },
  message: { message: "Too many payment requests. Please try again later." },
});

/**
 * General API limiter: 100 requests per 15 minutes per IP.
 * Applied globally to all /api/* routes.
 */
export const generalApiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests. Please slow down." },
});
