import crypto from "crypto";

export type ClaimsHubEventType = "booking_created" | "visit_completed" | "invoice_ready";

export interface ClaimsHubEventPayload {
  bookingId: number;
  patientId: string;
  providerId: number;
  serviceId?: number;
  amount?: string; // decimal string, e.g. "150.00"
}

interface OutboundEvent {
  eventId: string;
  eventType: ClaimsHubEventType;
  timestamp: string;
  bookingId: number;
  patientId: string;
  providerId: number;
  serviceId?: number;
  amount?: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Dispatches a signed event to ClaimsHub with automatic retry.
 * Never awaited from route handlers — always called with `void`.
 *
 * Env vars:
 *   CLAIMSHUB_WEBHOOK_URL    — full URL of the ClaimsHub inbound webhook
 *   CLAIMSHUB_WEBHOOK_SECRET — shared secret for HMAC-SHA256 signing
 */
export async function dispatchClaimsHubEvent(
  type: ClaimsHubEventType,
  payload: ClaimsHubEventPayload,
): Promise<void> {
  const url = process.env.CLAIMSHUB_WEBHOOK_URL;
  const secret = process.env.CLAIMSHUB_WEBHOOK_SECRET;

  if (!url || !secret) {
    // Not configured — skip silently (feature is optional until ClaimsHub is wired)
    return;
  }

  const event: OutboundEvent = {
    eventId: `${payload.bookingId}-${type}-${Date.now()}`,
    eventType: type,
    timestamp: new Date().toISOString(),
    bookingId: payload.bookingId,
    patientId: payload.patientId,
    providerId: payload.providerId,
    serviceId: payload.serviceId,
    amount: payload.amount,
  };

  const body = JSON.stringify(event);
  const signature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Signature-256": `sha256=${signature}`,
    "X-Event-Id": `${payload.bookingId}-${type}`,
  };

  const MAX_ATTEMPTS = 3;
  const BACKOFF_MS = [1000, 2000, 4000];

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, { method: "POST", headers, body });
      if (response.ok) return;
      console.error(
        `ClaimsHub webhook attempt ${attempt + 1} failed: HTTP ${response.status}`,
      );
    } catch (err) {
      console.error(`ClaimsHub webhook attempt ${attempt + 1} error:`, err);
    }

    if (attempt < MAX_ATTEMPTS - 1) {
      await sleep(BACKOFF_MS[attempt]);
    }
  }

  console.error(
    `ClaimsHub webhook permanently failed for event ${event.eventId} after ${MAX_ATTEMPTS} attempts`,
  );
}
