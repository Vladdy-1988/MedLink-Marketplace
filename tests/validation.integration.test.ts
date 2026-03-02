/**
 * Integration tests for request body validation (Task 1 hardening).
 * Verifies that newly-added Zod schemas reject invalid payloads with 400.
 */
import express from "express";
import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";

process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_fake";
process.env.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "whsec_fake";
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgres://fake";
process.env.SESSION_SECRET = process.env.SESSION_SECRET || "test-secret";
process.env.AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || "fake.auth0.com";
process.env.AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || "fake-client-id";
process.env.AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET || "fake-client-secret";

const { mockStorage } = vi.hoisted(() => ({
  mockStorage: {
    getUser: vi.fn(),
    getBooking: vi.fn(),
    getProvider: vi.fn(),
    getService: vi.fn(),
    updateBookingStatus: vi.fn(),
    cancelBooking: vi.fn(),
    rescheduleBooking: vi.fn(),
    updateUser: vi.fn(),
    createAuditLog: vi.fn(),
    getConsentRecords: vi.fn(),
    markOnboardingComplete: vi.fn(),
    notifyWaitlistEntries: vi.fn().mockResolvedValue([]),
    recordAnalytics: vi.fn().mockResolvedValue(undefined),
    getReviewByBookingId: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("../server/storage", () => ({ storage: mockStorage }));
vi.mock("../server/auth0", () => ({
  setupAuth: vi.fn(async () => undefined),
  isAuthenticated: (req: any, _res: any, next: any) => {
    req.user = { id: "user-1" };
    next();
  },
  getSession: () => (_req: any, _res: any, next: any) => next(),
}));
vi.mock("../server/auth0Debug", () => ({ setupAuth0Debug: vi.fn() }));
vi.mock("../server/emailService", () => ({
  emailService: {
    sendBookingConfirmation: vi.fn(),
    sendProviderNotification: vi.fn(),
    sendBookingStatusUpdate: vi.fn(),
  },
}));
vi.mock("../server/objectStorage", () => ({
  ObjectStorageService: class {
    getProviderDocumentUploadURL = vi.fn();
    getProviderDocumentFile = vi.fn();
    normalizeProviderDocumentPath = (p: string) => p;
    downloadObject = vi.fn();
  },
  ObjectNotFoundError: class extends Error {},
}));
vi.mock("../server/validateEnv", () => ({ validateEnv: vi.fn() }));

let app: express.Express;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  const { registerRoutes } = await import("../server/routes");
  await registerRoutes(app);

  // Set up common mock returns
  mockStorage.getBooking.mockResolvedValue({
    id: 1,
    patientId: "user-1",
    providerId: 1,
    serviceId: 1,
    scheduledDate: new Date(),
    status: "pending",
  });
  mockStorage.getProvider.mockResolvedValue({ id: 1, userId: "user-1" });
  mockStorage.updateBookingStatus.mockResolvedValue(undefined);
  mockStorage.cancelBooking.mockResolvedValue(undefined);
  mockStorage.rescheduleBooking.mockResolvedValue(undefined);
  mockStorage.updateUser.mockResolvedValue({ id: "user-1" });
  mockStorage.createAuditLog.mockResolvedValue({});
});

// ---- PATCH /api/bookings/:id/status ----

describe("PATCH /api/bookings/:id/status — status validation", () => {
  it("rejects an unrecognised status value with 400", async () => {
    const res = await request(app)
      .patch("/api/bookings/1/status")
      .send({ status: "hacked_status" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid request payload/i);
  });

  it("rejects a missing status field with 400", async () => {
    const res = await request(app).patch("/api/bookings/1/status").send({});
    expect(res.status).toBe(400);
  });

  it("accepts a valid status value", async () => {
    mockStorage.getUser.mockResolvedValue({ id: "user-1", userType: "patient" });
    const res = await request(app)
      .patch("/api/bookings/1/status")
      .send({ status: "confirmed" });
    // 200 = passed validation (provider check may 403 since provider.userId !== user-1 here,
    // but the important thing is it's NOT a 400 validation error)
    expect([200, 403]).toContain(res.status);
  });
});

// ---- POST /api/bookings/:id/reschedule ----

describe("POST /api/bookings/:id/reschedule — newDate validation", () => {
  it("rejects a non-date newDate with 400", async () => {
    const res = await request(app)
      .post("/api/bookings/1/reschedule")
      .send({ newDate: "not-a-date" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid request payload/i);
  });

  it("rejects a missing newDate with 400", async () => {
    const res = await request(app)
      .post("/api/bookings/1/reschedule")
      .send({ reason: "changed my mind" });
    expect(res.status).toBe(400);
  });

  it("accepts a valid ISO date string", async () => {
    const res = await request(app)
      .post("/api/bookings/1/reschedule")
      .send({ newDate: "2026-06-15T10:00:00.000Z", reason: "earlier slot" });
    // passes validation — may 403 on access check, but not 400
    expect(res.status).not.toBe(400);
  });
});

// ---- POST /api/bookings/:id/cancel ----

describe("POST /api/bookings/:id/cancel — reason validation", () => {
  it("rejects an oversized reason (>1000 chars) with 400", async () => {
    const res = await request(app)
      .post("/api/bookings/1/cancel")
      .send({ reason: "x".repeat(1001) });
    expect(res.status).toBe(400);
  });

  it("accepts a cancel request with no reason (optional)", async () => {
    const res = await request(app).post("/api/bookings/1/cancel").send({});
    expect(res.status).not.toBe(400);
  });
});

// ---- PATCH /api/user/profile ----

describe("PATCH /api/user/profile — profile validation", () => {
  it("rejects a firstName that exceeds 100 characters with 400", async () => {
    const res = await request(app)
      .patch("/api/user/profile")
      .send({ firstName: "A".repeat(101) });
    expect(res.status).toBe(400);
  });

  it("accepts a valid partial profile update", async () => {
    mockStorage.getUser.mockResolvedValue({ id: "user-1" });
    const res = await request(app)
      .patch("/api/user/profile")
      .send({ firstName: "Paula", lastName: "Martinez" });
    expect(res.status).toBe(200);
  });
});
