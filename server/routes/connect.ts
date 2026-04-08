import { Router } from "express";
import Stripe from "stripe";
import { isAuthenticated as checkAuth } from "../auth0";
import { storage } from "../storage";
import { getAuthUserId } from "../routeHelpers";

if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-07-30.basil" });

const router = Router();
const APP_URL = process.env.APP_URL || "https://mymedlink.ca";

router.post("/connect/onboard", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const provider = await storage.getProviderByUserId(userId);
    if (!provider) return res.status(403).json({ error: "Provider profile not found" });

    let accountId = provider.stripeAccountId ?? null;
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "CA",
        capabilities: { transfers: { requested: true } },
      });
      accountId = account.id;
      await storage.updateProviderConnect(provider.id, { stripeAccountId: accountId });
    }

    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${APP_URL}/connect/refresh`,
      return_url: `${APP_URL}/connect/success`,
      type: "account_onboarding",
    });

    res.json({ url: link.url });
  } catch (err: any) {
    console.error("Connect onboard error:", err);
    res.status(500).json({ error: "Failed to create Connect link" });
  }
});

router.get("/connect/status", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const provider = await storage.getProviderByUserId(userId);
    if (!provider) return res.status(403).json({ error: "Provider profile not found" });

    if (!provider.stripeAccountId) {
      return res.json({ connected: false, chargesEnabled: false });
    }

    const account = await stripe.accounts.retrieve(provider.stripeAccountId);
    if (account.charges_enabled && !provider.connectOnboardingComplete) {
      await storage.updateProviderConnect(provider.id, { connectOnboardingComplete: true });
    }

    res.json({ connected: true, chargesEnabled: account.charges_enabled });
  } catch (err: any) {
    console.error("Connect status error:", err);
    res.status(500).json({ error: "Failed to check Connect status" });
  }
});

export default router;
