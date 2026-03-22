import { Router, type Request } from "express";
import Stripe from "stripe";
import { isAuthenticated } from "../auth0";
import { storage } from "../storage";
import { getAuthUserId, isAdmin } from "../routeHelpers";
import { paymentRateLimit } from "../middleware/rateLimit";
import { dispatchClaimsHubEvent } from "../claimsHubClient";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

const router = Router();
const checkAuth = isAuthenticated;

/**
 * POST /api/create-payment-intent
 *
 * HARDENED: amount is never trusted from the client.
 * The server looks up the service price from the database.
 * An idempotency key (bookingId + userId) prevents duplicate charges.
 */
router.post(
  "/create-payment-intent",
  checkAuth,
  paymentRateLimit,
  async (req: any, res) => {
    try {
      const { bookingId } = req.body;
      const requestUserId = getAuthUserId(req);

      if (!bookingId) {
        return res.status(400).json({ message: "bookingId is required" });
      }

      const booking = await storage.getBooking(Number(bookingId));
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const canPay =
        booking.patientId === requestUserId || (await isAdmin(requestUserId));
      if (!canPay) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Server-calculated amount — never use the client-supplied figure.
      const service = await storage.getService(booking.serviceId);
      if (!service?.price) {
        return res
          .status(422)
          .json({ message: "Service price is not available" });
      }
      const amountCents = Math.round(Number(service.price) * 100);

      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount: amountCents,
          currency: "cad",
          metadata: {
            bookingId: String(bookingId),
            userId: requestUserId,
          },
        },
        {
          // Idempotency key — safe to retry without double-charging.
          idempotencyKey: `pi-${bookingId}-${requestUserId}`,
        },
      );

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  },
);

/**
 * POST /api/payment/confirm
 * Records that a payment was completed on the client side.
 */
router.post(
  "/payment/confirm",
  checkAuth,
  paymentRateLimit,
  async (req: any, res) => {
    try {
      const { paymentIntentId, bookingId } = req.body;
      const requestUserId = getAuthUserId(req);

      const booking = await storage.getBooking(Number(bookingId));
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const canConfirmPayment =
        booking.patientId === requestUserId || (await isAdmin(requestUserId));
      if (!canConfirmPayment) {
        return res.status(403).json({ message: "Access denied" });
      }

      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (
        pi.status !== "succeeded" ||
        pi.metadata?.bookingId !== String(bookingId)
      ) {
        return res.status(422).json({ message: "Payment has not been verified" });
      }

      await storage.updateBookingPayment(
        Number(bookingId),
        paymentIntentId,
        "paid",
      );
      res.json({ success: true });
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Failed to confirm payment" });
    }
  },
);

/**
 * POST /api/webhooks/stripe
 *
 * Stripe webhook endpoint with signature verification.
 * Requires the raw request body — make sure this route is registered
 * BEFORE express.json() is applied globally, or use express.raw() here.
 * The index.ts registers this path with express.raw() ahead of the
 * json body-parser.
 */
router.post(
  "/webhooks/stripe",
  paymentRateLimit,
  async (req: Request, res) => {
    const sig = req.headers["stripe-signature"] as string | undefined;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not set");
      return res.status(500).json({ message: "Webhook secret not configured" });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body as Buffer,
        sig ?? "",
        webhookSecret,
      );
    } catch (err: any) {
      console.error("Stripe webhook signature verification failed:", err.message);
      return res.status(400).json({ message: `Webhook error: ${err.message}` });
    }

    // Handle relevant event types
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const bookingId = pi.metadata?.bookingId
          ? Number(pi.metadata.bookingId)
          : null;
        if (bookingId) {
          await storage.updateBookingPayment(bookingId, pi.id, "paid");

          // Notify ClaimsHub (fire-and-forget)
          const booking = await storage.getBooking(bookingId);
          if (booking) {
            void dispatchClaimsHubEvent("invoice_ready", {
              bookingId: booking.id,
              patientId: booking.patientId,
              providerId: booking.providerId,
              serviceId: booking.serviceId,
              amount: booking.totalAmount,
            });
          }

          // Analytics (fire-and-forget)
          void storage.recordAnalytics({
            date: new Date(),
            metric: "daily_payments",
            value: String(pi.amount / 100),
            category: "financial",
            metadata: null,
          }).catch((err) => console.error("Analytics error:", err));
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const bookingId = pi.metadata?.bookingId
          ? Number(pi.metadata.bookingId)
          : null;
        if (bookingId) {
          await storage.updateBookingPayment(bookingId, pi.id, "failed");
        }
        break;
      }
      default:
        // Acknowledge receipt without acting on unhandled event types
        break;
    }

    res.json({ received: true });
  },
);

export default router;
