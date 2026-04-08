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
import path from "path";
import fs from "fs";
import type { Express } from "express";
import authRouter from "./auth";
import providersRouter, { providerObjectsRouter } from "./providers";
import bookingsRouter from "./bookings";
import paymentsRouter from "./payments";
import usersRouter from "./users";
import messagesRouter from "./messages";
import adminRouter from "./admin";
import waitlistRouter from "./waitlist";
import assistantRouter from "./assistant";
import subscriptionsRouter from "./subscriptions";
import connectRouter from "./connect";

export function registerApiRouters(app: Express): void {
  app.use("/api", authRouter);
  app.use("/api", usersRouter);
  app.use("/api", bookingsRouter);
  app.use("/api", paymentsRouter);
  app.use("/api", messagesRouter);
  app.use("/api", assistantRouter);
  app.use("/api", subscriptionsRouter);
  app.use("/api", connectRouter);
  app.use("/api", adminRouter);
  app.use("/api", waitlistRouter);
  // Provider marketplace/profile APIs live behind /api.
  app.use("/api", providersRouter);
  // Provider document downloads keep their existing /objects/* URLs.
  app.use(providerObjectsRouter);

  // SPA catch-all: serves index.html for direct navigation to client-side routes.
  // Skips /api paths and paths with file extensions so static assets still resolve.
  // Falls through gracefully in dev (no build dir yet — Vite handles it after this).
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    if (/\.\w{2,5}$/.test(req.path)) return next();
    const indexPath = path.resolve(import.meta.dirname, "../public/index.html");
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    next();
  });
}
