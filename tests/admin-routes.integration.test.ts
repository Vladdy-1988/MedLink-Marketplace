/**
 * Integration tests for admin route guards.
 * Verifies that requireAdmin correctly blocks non-admin users (403)
 * and allows admin users through.
 */
import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Must be set before any server module is imported.
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_fake";
process.env.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "whsec_fake";
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgres://fake";
process.env.SESSION_SECRET = process.env.SESSION_SECRET || "test-secret";
process.env.AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || "fake.auth0.com";
process.env.AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || "fake-client-id";
process.env.AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET || "fake-client-secret";

// ---------------------------------------------------------------------------
// Hoisted mock storage — each test can override getUser to change the actor.
// ---------------------------------------------------------------------------
const { mockStorage } = vi.hoisted(() => ({
  mockStorage: {
    getUser: vi.fn(),
    getPendingProviders: vi.fn(),
    getAllUsers: vi.fn(),
    getPlatformStats: vi.fn(),
    createAuditLog: vi.fn(),
    // Stub every other storage method used during route registration
    getAllProviders: vi.fn(),
    getAllBookings: vi.fn(),
    getAllReviews: vi.fn(),
    getSystemSettings: vi.fn(),
    getAuditLogs: vi.fn(),
    getAllConversations: vi.fn(),
    getAllPendingCredentials: vi.fn(),
    getTransactions: vi.fn(),
  },
}));

vi.mock("../server/storage", () => ({ storage: mockStorage }));
vi.mock("../server/auth0", () => ({
  setupAuth: vi.fn(async () => undefined),
  isAuthenticated: (req: any, _res: any, next: any) => {
    // user is set in beforeEach for each test scenario
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

// Helper: build the test app injecting a specific user onto each request.
async function buildApp(actorUser: Record<string, any>) {
  vi.resetModules();
  const appInstance = express();
  appInstance.use(express.json());
  appInstance.use(express.urlencoded({ extended: false }));

  // Inject the actor onto req.user before any route handler runs.
  appInstance.use((req: any, _res: any, next: any) => {
    req.user = actorUser;
    next();
  });

  const { registerRoutes } = await import("../server/routes");
  await registerRoutes(appInstance);
  return appInstance;
}

// ---------------------------------------------------------------------------

describe("requireAdmin middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.getUser.mockResolvedValue({ id: "admin-1", userType: "admin" });
    mockStorage.getPendingProviders.mockResolvedValue([]);
    mockStorage.getAllUsers.mockResolvedValue([]);
    mockStorage.getPlatformStats.mockResolvedValue({});
    mockStorage.createAuditLog.mockResolvedValue({});
    mockStorage.getAllProviders.mockResolvedValue([]);
    mockStorage.getAllBookings.mockResolvedValue([]);
    mockStorage.getAllReviews.mockResolvedValue([]);
    mockStorage.getSystemSettings.mockResolvedValue([]);
    mockStorage.getAuditLogs.mockResolvedValue([]);
    mockStorage.getAllConversations.mockResolvedValue([]);
    mockStorage.getAllPendingCredentials.mockResolvedValue([]);
    mockStorage.getTransactions.mockResolvedValue([]);
  });

  it("blocks a non-admin (patient) from GET /api/admin/pending-providers with 403", async () => {
    mockStorage.getUser.mockResolvedValue({ id: "patient-1", userType: "patient" });
    const app = await buildApp({ id: "patient-1" });
    const res = await request(app).get("/api/admin/pending-providers");
    expect(res.status).toBe(403);
  });

  it("blocks a non-admin (provider) from GET /api/admin/users with 403", async () => {
    mockStorage.getUser.mockResolvedValue({ id: "provider-1", userType: "provider" });
    const app = await buildApp({ id: "provider-1" });
    const res = await request(app).get("/api/admin/users");
    expect(res.status).toBe(403);
  });

  it("allows an admin through GET /api/admin/pending-providers", async () => {
    mockStorage.getUser.mockResolvedValue({ id: "admin-1", userType: "admin" });
    const app = await buildApp({ id: "admin-1" });
    const res = await request(app).get("/api/admin/pending-providers");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("allows an admin through GET /api/admin/stats", async () => {
    mockStorage.getUser.mockResolvedValue({ id: "admin-1", userType: "admin" });
    const app = await buildApp({ id: "admin-1" });
    const res = await request(app).get("/api/admin/stats");
    expect(res.status).toBe(200);
  });

  it("blocks a patient from GET /api/admin/bookings with 403", async () => {
    mockStorage.getUser.mockResolvedValue({ id: "patient-1", userType: "patient" });
    const app = await buildApp({ id: "patient-1" });
    const res = await request(app).get("/api/admin/bookings");
    expect(res.status).toBe(403);
  });

  it("blocks a patient from PATCH /api/admin/settings/:key with 403", async () => {
    mockStorage.getUser.mockResolvedValue({ id: "patient-1", userType: "patient" });
    const app = await buildApp({ id: "patient-1" });
    const res = await request(app)
      .patch("/api/admin/settings/platform_fee")
      .send({ value: "0.05" });
    expect(res.status).toBe(403);
  });
});
