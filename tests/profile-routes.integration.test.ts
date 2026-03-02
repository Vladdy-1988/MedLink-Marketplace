import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_fake_key";

const { mockStorage } = vi.hoisted(() => ({
  mockStorage: {
    createEmergencyContact: vi.fn(),
    createFamilyMember: vi.fn(),
    createPaymentMethod: vi.fn(),
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

describe("Profile route contracts", () => {
  let app: express.Express;

  beforeEach(async () => {
    vi.resetModules();
    mockStorage.createEmergencyContact.mockReset();
    mockStorage.createFamilyMember.mockReset();
    mockStorage.createPaymentMethod.mockReset();

    mockStorage.createEmergencyContact.mockResolvedValue({
      id: 1,
      userId: "user-1",
      name: "Jane Doe",
      relationship: "sister",
      phoneNumber: "+14035550111",
      email: "jane@example.com",
      isPrimary: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    mockStorage.createFamilyMember.mockResolvedValue({
      id: 1,
      userId: "user-1",
      firstName: "Amy",
      lastName: "Doe",
      dateOfBirth: new Date("2018-01-01"),
      relationship: "child",
      gender: "female",
      healthProfileId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    mockStorage.createPaymentMethod.mockResolvedValue({
      id: 1,
      userId: "user-1",
      stripePaymentMethodId: "manual_test_1",
      type: "card",
      last4: "1234",
      brand: "visa",
      expiryMonth: 12,
      expiryYear: 2030,
      isDefault: false,
      billingAddressId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const { registerRoutes } = await import("../server/routes");
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    await registerRoutes(app);
  });

  it("accepts a valid emergency contact payload and injects authenticated userId", async () => {
    const response = await request(app).post("/api/user/emergency-contacts").send({
      name: "Jane Doe",
      relationship: "sister",
      phoneNumber: "+14035550111",
      email: "jane@example.com",
      isPrimary: true,
    });

    expect(response.status).toBe(201);
    expect(mockStorage.createEmergencyContact).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        name: "Jane Doe",
        phoneNumber: "+14035550111",
      }),
    );
  });

  it("rejects invalid emergency contact payloads with 400", async () => {
    const response = await request(app).post("/api/user/emergency-contacts").send({
      name: "Jane Doe",
      relationship: "sister",
      email: "jane@example.com",
    });

    expect(response.status).toBe(400);
    expect(mockStorage.createEmergencyContact).not.toHaveBeenCalled();
  });

  it("coerces family member dateOfBirth into Date for storage", async () => {
    const response = await request(app).post("/api/user/family-members").send({
      firstName: "Amy",
      lastName: "Doe",
      dateOfBirth: "2018-01-01",
      relationship: "child",
      gender: "female",
      healthProfileId: null,
    });

    expect(response.status).toBe(201);
    expect(mockStorage.createFamilyMember).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        dateOfBirth: expect.any(Date),
      }),
    );
  });

  it("coerces payment expiry fields to numbers", async () => {
    const response = await request(app).post("/api/user/payment-methods").send({
      stripePaymentMethodId: "manual_test_1",
      type: "card",
      last4: "1234",
      brand: "visa",
      expiryMonth: "12",
      expiryYear: "2030",
      isDefault: false,
      billingAddressId: null,
    });

    expect(response.status).toBe(201);
    expect(mockStorage.createPaymentMethod).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        expiryMonth: 12,
        expiryYear: 2030,
      }),
    );
  });
});
