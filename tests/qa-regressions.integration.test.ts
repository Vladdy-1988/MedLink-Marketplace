import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_fake_key";

const { mockStorage } = vi.hoisted(() => ({
  mockStorage: {
    getAllReviews: vi.fn(),
    getProviderByUserId: vi.fn(),
    getUser: vi.fn(),
    getProvider: vi.fn(),
    getWaitlistByPatient: vi.fn(),
    createWaitlistEntry: vi.fn(),
    getMarketplaceProviders: vi.fn(),
    getService: vi.fn(),
  },
}));

vi.mock("../server/storage", () => ({
  storage: mockStorage,
}));

vi.mock("../server/auth0", () => ({
  setupAuth: vi.fn(async () => undefined),
  isAuthenticated: (req: any, _res: any, next: any) => {
    req.user = { claims: { sub: "user-1" } };
    next();
  },
  getSession: () => (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../server/auth0Debug", () => ({
  setupAuth0Debug: vi.fn(),
}));

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
    normalizeProviderDocumentPath(rawPath: string) {
      return rawPath;
    }
    downloadObject = vi.fn();
  },
  ObjectNotFoundError: class extends Error {},
}));

describe("QA regression coverage", () => {
  let app: express.Express;

  beforeEach(async () => {
    vi.resetModules();

    mockStorage.getAllReviews.mockReset();
    mockStorage.getProviderByUserId.mockReset();
    mockStorage.getUser.mockReset();
    mockStorage.getProvider.mockReset();
    mockStorage.getWaitlistByPatient.mockReset();
    mockStorage.createWaitlistEntry.mockReset();
    mockStorage.getMarketplaceProviders.mockReset();
    mockStorage.getService.mockReset();

    mockStorage.getAllReviews.mockResolvedValue([]);
    mockStorage.getProviderByUserId.mockResolvedValue(undefined);
    mockStorage.getUser.mockResolvedValue({
      id: "user-1",
      userType: "patient",
    });
    mockStorage.getProvider.mockResolvedValue({
      id: 5,
      userId: "provider-1",
    });
    mockStorage.getService.mockResolvedValue({
      id: 12,
      providerId: 5,
      name: "Home Visit",
      price: "100.00",
      duration: 60,
    });
    mockStorage.getWaitlistByPatient.mockResolvedValue([]);
    mockStorage.createWaitlistEntry.mockResolvedValue({
      id: 9,
      patientId: "user-1",
      providerId: 5,
      serviceId: null,
      preferredDateRange: null,
      notes: null,
      status: "waiting",
      notifiedAt: null,
      expiresAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    const { registerRoutes } = await import("../server/routes");
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    await registerRoutes(app);
  });

  it("does not mount marketplace provider APIs at the app root", async () => {
    const response = await request(app).get("/providers");

    expect(response.status).toBe(404);
    expect(mockStorage.getMarketplaceProviders).not.toHaveBeenCalled();
  });

  it("keeps provider document downloads mounted at /objects", async () => {
    const response = await request(app).get("/objects/provider-documents/sample.pdf");

    expect(response.status).toBe(403);
  });

  it("serves the global reviews feed from GET /api/reviews", async () => {
    mockStorage.getAllReviews.mockResolvedValue([
      { id: 1, rating: 5, comment: "Excellent" },
    ]);

    const response = await request(app).get("/api/reviews");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, rating: 5, comment: "Excellent" }]);
    expect(mockStorage.getAllReviews).toHaveBeenCalledTimes(1);
  });

  it("serves the authenticated provider from GET /api/providers/me", async () => {
    mockStorage.getProviderByUserId.mockResolvedValue({
      id: 7,
      userId: "user-1",
      specialization: "Physiotherapist",
    });

    const response = await request(app).get("/api/providers/me");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 7,
        userId: "user-1",
      }),
    );
    expect(mockStorage.getProviderByUserId).toHaveBeenCalledWith("user-1");
  });

  it("serves service details from GET /api/services/:id", async () => {
    const response = await request(app).get("/api/services/12");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 12,
        name: "Home Visit",
      }),
    );
    expect(mockStorage.getService).toHaveBeenCalledWith(12);
  });

  it("serves non-secret public runtime config", async () => {
    const original = process.env.STRIPE_PUBLIC_KEY;
    process.env.STRIPE_PUBLIC_KEY = "pk_test_public_key";

    const response = await request(app).get("/api/config/public");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ stripePublicKey: "pk_test_public_key" });

    if (original === undefined) {
      delete process.env.STRIPE_PUBLIC_KEY;
    } else {
      process.env.STRIPE_PUBLIC_KEY = original;
    }
  });

  it("rejects waitlist joins for non-patient accounts", async () => {
    mockStorage.getUser.mockResolvedValue({
      id: "user-1",
      userType: "provider",
    });

    const response = await request(app).post("/api/waitlist").send({
      providerId: 5,
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/only patients/i);
    expect(mockStorage.createWaitlistEntry).not.toHaveBeenCalled();
  });

  it("rejects duplicate waitlist joins for the same provider", async () => {
    mockStorage.getWaitlistByPatient.mockResolvedValue([
      {
        id: 1,
        patientId: "user-1",
        providerId: 5,
      },
    ]);

    const response = await request(app).post("/api/waitlist").send({
      providerId: 5,
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/already on this provider's waitlist/i);
    expect(mockStorage.createWaitlistEntry).not.toHaveBeenCalled();
  });
});
