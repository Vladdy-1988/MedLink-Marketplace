import { Router } from "express";
import Stripe from "stripe";
import { isAuthenticated as checkAuth } from "../auth0";
import { storage } from "../storage";
import { getAuthUserId } from "../routeHelpers";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

const router = Router();
const APP_URL = process.env.APP_URL || "https://mymedlink.ca";

router.post("/subscriptions/create-checkout", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const user = await storage.getUser(userId);

    if (!user || user.userType !== "patient") {
      return res.status(403).json({ error: "Subscriptions are for patients only" });
    }

    if (!process.env.STRIPE_PATIENT_PRICE_ID) {
      return res.status(500).json({ error: "Subscription price is not configured" });
    }

    let stripeCustomerId = user.stripeCustomerId ?? undefined;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || undefined,
        metadata: { userId: user.id },
      });

      stripeCustomerId = customer.id;
      await storage.updateUserSubscription(user.id, {
        stripeCustomerId,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PATIENT_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/subscribe`,
      metadata: { userId: user.id },
    });

    if (!session.url) {
      return res.status(500).json({ error: "Failed to create checkout session" });
    }

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating subscription checkout:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

router.get("/subscriptions/status", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const user = await storage.getUser(userId);

    res.json({
      status: user?.subscriptionStatus ?? "inactive",
      currentPeriodEnd: user?.subscriptionCurrentPeriodEnd ?? null,
      isActive: user?.subscriptionStatus === "active",
    });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    res.status(500).json({ error: "Failed to fetch subscription status" });
  }
});

router.post("/subscriptions/create-portal", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const user = await storage.getUser(userId);

    if (!user || user.userType !== "patient") {
      return res.status(403).json({ error: "Subscriptions are for patients only" });
    }

    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: "No Stripe customer found for this user" });
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${APP_URL}/dashboard/patient`,
    });

    res.json({ url: portal.url });
  } catch (error) {
    console.error("Error creating billing portal session:", error);
    res.status(500).json({ error: "Failed to create billing portal session" });
  }
});

export default router;
