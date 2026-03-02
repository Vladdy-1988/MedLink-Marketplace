/**
 * Registers all API sub-routers onto the Express app.
 *
 * Sub-router files each own a domain:
 *   auth      → /api/auth/*, /api/user/consent, /api/user/profile, /api/user/onboarding
 *   providers → /api/providers/*, /api/services, /api/reviews, /objects/*
 *   bookings  → /api/bookings/*
 *   payments  → /api/create-payment-intent, /api/payment/confirm, /api/webhooks/stripe
 *   users     → /api/user/addresses, emergency-contacts, health-profile, family, insurance, payment-methods
 *   messages  → /api/messages/*, /api/conversations/*
 *   admin     → /api/admin/*
 */
import type { Express } from "express";
import authRouter from "./auth";
import providersRouter from "./providers";
import bookingsRouter from "./bookings";
import paymentsRouter from "./payments";
import usersRouter from "./users";
import messagesRouter from "./messages";
import adminRouter from "./admin";
import waitlistRouter from "./waitlist";

export function registerApiRouters(app: Express): void {
  app.use("/api", authRouter);
  app.use("/api", usersRouter);
  app.use("/api", bookingsRouter);
  app.use("/api", paymentsRouter);
  app.use("/api", messagesRouter);
  app.use("/api", adminRouter);
  app.use("/api", waitlistRouter);
  // providers router also handles /objects/* (document downloads)
  app.use("/api", providersRouter);
  app.use(providersRouter);
}
