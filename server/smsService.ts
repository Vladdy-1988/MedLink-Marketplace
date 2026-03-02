/**
 * SMS notifications via SendGrid SMS API.
 *
 * Env vars:
 *   SENDGRID_API_KEY        — already required by emailService
 *   SENDGRID_SMS_FROM_NUMBER — E.164 format, e.g. +14035550100
 *
 * If SENDGRID_SMS_FROM_NUMBER is not set the service silently skips.
 */

const SENDGRID_API_URL = "https://api.sendgrid.com/v3/sms/send";

async function sendSms(to: string, body: string): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_SMS_FROM_NUMBER;

  if (!apiKey || !from) {
    // Optional feature — skip if not configured
    return;
  }

  // Normalise to E.164 if the number lacks a leading +
  const toNormalised = to.startsWith("+") ? to : `+1${to.replace(/\D/g, "")}`;

  const payload = {
    to: toNormalised,
    from,
    content: body,
  };

  const response = await fetch(SENDGRID_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "(no body)");
    throw new Error(`SendGrid SMS failed (${response.status}): ${text}`);
  }
}

export async function sendBookingReminder(
  patientPhone: string,
  providerName: string,
  scheduledDate: Date,
  hoursUntil: 24 | 1,
): Promise<void> {
  const dateStr = scheduledDate.toLocaleString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Edmonton", // Calgary
  });

  const body =
    hoursUntil === 24
      ? `MedLink reminder: Your appointment with ${providerName} is tomorrow at ${dateStr}. Reply STOP to opt out.`
      : `MedLink reminder: Your appointment with ${providerName} starts in ~1 hour at ${dateStr}. Reply STOP to opt out.`;

  await sendSms(patientPhone, body);
}
