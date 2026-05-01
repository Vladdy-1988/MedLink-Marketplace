import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_fake_key";
process.env.DATABASE_URL = process.env.DATABASE_URL || "fake";

const { mockStorage } = vi.hoisted(() => ({
  mockStorage: {
    getUser: vi.fn(),
    createMessage: vi.fn(),
    getMessagesBetweenUsers: vi.fn(),
    getConversationsForUser: vi.fn(),
    markConversationAsRead: vi.fn(),
    searchProviders: vi.fn(),
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
    searchPublicObject = vi.fn();
    downloadObject = vi.fn();
    getProviderDocumentUploadURL = vi.fn();
    getProviderDocumentFile = vi.fn();
    normalizeProviderDocumentPath(rawPath: string) {
      return rawPath;
    }
  },
  ObjectNotFoundError: class extends Error {},
}));

describe("messages and assistant contracts", () => {
  let app: express.Express;

  beforeEach(async () => {
    vi.resetModules();
    delete process.env.ANTHROPIC_API_KEY;

    Object.values(mockStorage).forEach((mock) => (mock as any).mockReset());
    mockStorage.getUser.mockResolvedValue({
      id: "user-1",
      userType: "patient",
      firstName: "Paula",
      lastName: "Patient",
    });
    mockStorage.createMessage.mockResolvedValue({
      id: 10,
      senderId: "user-1",
      receiverId: "provider-user-1",
      content: "Hi, I need nursing care.",
      isRead: false,
      createdAt: new Date("2026-05-01T15:00:00Z"),
    });
    mockStorage.getMessagesBetweenUsers.mockResolvedValue([
      {
        id: 10,
        senderId: "user-1",
        receiverId: "provider-user-1",
        content: "Hi, I need nursing care.",
        isRead: false,
        createdAt: new Date("2026-05-01T15:00:00Z"),
      },
    ]);
    mockStorage.getConversationsForUser.mockResolvedValue([
      {
        partnerId: "provider-user-1",
        partnerName: "Nora Nurse",
        partnerRole: "Healthcare Provider",
        lastMessage: "Hi, I need nursing care.",
        lastMessageTime: new Date("2026-05-01T15:00:00Z"),
        unreadCount: 0,
      },
    ]);
    mockStorage.markConversationAsRead.mockResolvedValue(undefined);
    mockStorage.searchProviders.mockResolvedValue([
      {
        id: 7,
        firstName: "Nora",
        lastName: "Nurse",
        specialization: "Nursing Services",
        rating: "4.8",
        reviewCount: 12,
        basePricing: "95.00",
        serviceAreas: ["NW Calgary"],
        services: [{ name: "Wound care", category: "Nursing Services" }],
      },
    ]);

    const { registerRoutes } = await import("../server/routes");
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    await registerRoutes(app);
  });

  it("creates provider messages with the authenticated sender", async () => {
    const response = await request(app).post("/api/messages").send({
      receiverId: "provider-user-1",
      content: "Hi, I need nursing care.",
    });

    expect(response.status).toBe(201);
    expect(mockStorage.createMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        senderId: "user-1",
        receiverId: "provider-user-1",
        content: "Hi, I need nursing care.",
      }),
    );
  });

  it("returns conversations in the partner-based dashboard shape", async () => {
    const response = await request(app).get("/api/conversations/user-1");

    expect(response.status).toBe(200);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        partnerId: "provider-user-1",
        partnerName: "Nora Nurse",
        partnerRole: "Healthcare Provider",
      }),
    );
  });

  it("fetches messages between the authenticated user and a partner", async () => {
    const response = await request(app).get("/api/messages/user-1/provider-user-1");

    expect(response.status).toBe(200);
    expect(mockStorage.getMessagesBetweenUsers).toHaveBeenCalledWith(
      "user-1",
      "provider-user-1",
    );
  });

  it("marks a partner conversation read for the authenticated user", async () => {
    const response = await request(app).put("/api/conversations/provider-user-1/read");

    expect(response.status).toBe(204);
    expect(mockStorage.markConversationAsRead).toHaveBeenCalledWith(
      "user-1",
      "provider-user-1",
    );
  });

  it("returns deterministic assistant suggestions when Anthropic is not configured", async () => {
    const response = await request(app).post("/api/assistant/message").send({
      message: "I need nursing wound care at home",
      history: [],
      patientContext: { location: "Calgary" },
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/verified in-home providers/i);
    expect(response.body.suggestedProviders).toEqual([
      expect.objectContaining({
        id: 7,
        name: "Nora Nurse",
        specialization: "Nursing Services",
      }),
    ]);
  });
});
