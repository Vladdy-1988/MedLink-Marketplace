/**
 * Integration tests for rate-limiting middleware.
 * Verifies that:
 *  1. The general API rate limiter attaches RateLimit headers to every response.
 *  2. The auth rate limiter is applied to /api/login and /api/callback.
 */
import express from "express";
import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  generalApiRateLimit,
  authRateLimit,
} from "../server/middleware/rateLimit";

// ---------------------------------------------------------------------------
// We test the middleware directly on a lightweight Express app, not through
// registerRoutes, so we don't need the full server stack.
// ---------------------------------------------------------------------------

describe("generalApiRateLimit", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(generalApiRateLimit);
    app.get("/api/test", (_req, res) => res.json({ ok: true }));
  });

  it("returns 200 for a normal request", async () => {
    const res = await request(app).get("/api/test");
    expect(res.status).toBe(200);
  });

  it("includes RateLimit headers on responses (draft-7 format)", async () => {
    const res = await request(app).get("/api/test");
    // draft-7 combined header or individual headers
    const hasRateLimit =
      "ratelimit" in res.headers ||
      "ratelimit-limit" in res.headers ||
      "x-ratelimit-limit" in res.headers;
    expect(hasRateLimit).toBe(true);
  });

  it("includes RateLimit-Policy header", async () => {
    const res = await request(app).get("/api/test");
    expect(res.headers).toHaveProperty("ratelimit-policy");
  });
});

describe("authRateLimit", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use("/api/login", authRateLimit);
    app.use("/api/callback", authRateLimit);
    // Simple stub — real passport strategy not needed here.
    app.get("/api/login", (_req, res) => res.status(302).set("Location", "/").end());
    app.get("/api/callback", (_req, res) => res.json({ ok: true }));
  });

  it("applies rate limit headers on /api/login", async () => {
    const res = await request(app).get("/api/login");
    const hasRateLimit =
      "ratelimit" in res.headers ||
      "ratelimit-limit" in res.headers ||
      "x-ratelimit-limit" in res.headers;
    expect(hasRateLimit).toBe(true);
  });

  it("applies rate limit headers on /api/callback", async () => {
    const res = await request(app).get("/api/callback");
    const hasRateLimit =
      "ratelimit" in res.headers ||
      "ratelimit-limit" in res.headers ||
      "x-ratelimit-limit" in res.headers;
    expect(hasRateLimit).toBe(true);
  });

  it("blocks requests after 10 attempts (auth limiter threshold)", async () => {
    // Fresh isolated app so we start from zero hits.
    const isolatedApp = express();
    isolatedApp.use("/api/login", authRateLimit);
    isolatedApp.get("/api/login", (_req, res) => res.json({ ok: true }));

    for (let i = 0; i < 10; i++) {
      await request(isolatedApp).get("/api/login");
    }
    const res = await request(isolatedApp).get("/api/login");
    expect(res.status).toBe(429);
  });
});
