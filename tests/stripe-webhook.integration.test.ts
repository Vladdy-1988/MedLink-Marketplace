/**
 * Integration tests for the Stripe webhook endpoint.
 * Verifies signature verification rejects tampered / unsigned payloads.
 */
import express from "express";
import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";

process.env.STRIPE_SECRET_KEY = "sk_test_fake_key";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgres://fake";
process.env.SESSION_SECRET = process.env.SESSION_SECRET || "test-secret";
process.env.AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || "fake.auth0.com";
process.env.AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || "fake-client-id";
process.env.AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET || "fake-client-secret";

// Mock the Stripe constructor so `constructEvent` is controllable per test.
const mockConstructEvent = vi.fn();
vi.mock("stripe", () => {
  return {
    default: class {
      webhooks = { constructEvent: mockConstructEvent };
      paymentIntents = { create: vi.fn() };
    },
  };
});

vi.mock("../server/storage", () => ({
  storage: {
    getUser: vi.fn(),
    getBooking: vi.fn(),
    updateBookingPayment: vi.fn(),
    createAuditLog: vi.fn(),
    recordAnalytics: vi.fn().mockResolvedValue(undefined),
  },
}));
vi.mock("../server/auth0", () => ({
  setupAuth: vi.fn(async () => undefined),
  isAuthenticated: (_req: any, _res: any, next: any) => next(),
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

describe("POST /api/webhooks/stripe", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = express();
    // The webhook endpoint must receive the raw body — mirror index.ts setup.
    app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    const { registerRoutes } = await import("../server/routes");
    await registerRoutes(app);
  });

  it("returns 400 when stripe-signature header is missing", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("No signatures found matching the expected signature");
    });

    const res = await request(app)
      .post("/api/webhooks/stripe")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ type: "payment_intent.succeeded" }));

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Webhook error/i);
  });

  it("returns 400 when the stripe-signature header is invalid", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("No signatures found matching the expected signature");
    });

    const res = await request(app)
      .post("/api/webhooks/stripe")
      .set("stripe-signature", "t=123,v1=badsig")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ type: "payment_intent.succeeded" }));

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Webhook error/i);
  });

  it("returns 200 and { received: true } for a valid event", async () => {
    const fakeEvent = {
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_fake", metadata: { bookingId: "42" } } },
    };
    mockConstructEvent.mockReturnValue(fakeEvent);

    const { storage } = await import("../server/storage");
    (storage.updateBookingPayment as any).mockResolvedValue(undefined);

    const res = await request(app)
      .post("/api/webhooks/stripe")
      .set("stripe-signature", "t=123,v1=validsig")
      .set("Content-Type", "application/json")
      .send(JSON.stringify(fakeEvent));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ received: true });
  });

  it("returns 500 when STRIPE_WEBHOOK_SECRET is not configured", async () => {
    const saved = process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const res = await request(app)
      .post("/api/webhooks/stripe")
      .set("stripe-signature", "t=123,v1=validsig")
      .set("Content-Type", "application/json")
      .send("{}");

    expect(res.status).toBe(500);
    process.env.STRIPE_WEBHOOK_SECRET = saved;
  });
});
