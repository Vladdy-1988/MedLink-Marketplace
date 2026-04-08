/**
 * Validates all required environment variables at process startup.
 * Call this before creating the Express app so failures are immediate and obvious.
 */

const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "SESSION_SECRET",
  "AUTH0_DOMAIN",
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
  "STRIPE_SECRET_KEY",
] as const;

// In production, these must be explicitly set to avoid Auth0 redirect mismatch.
const PRODUCTION_REQUIRED_ENV_VARS = [
  "AUTH0_CALLBACK_URL",
  "AUTH0_LOGOUT_URL",
] as const;

// Optional env vars — warn but don't throw; features degrade gracefully
const OPTIONAL_ENV_VARS: Record<string, string> = {
  AUTH0_CALLBACK_URL:
    "OAuth callback URL will be auto-derived from the request — set this to your exact registered callback URL (e.g. https://mymedlink.ca/api/callback) to prevent state-mismatch login failures",
  AUTH0_LOGOUT_URL:
    "Post-logout redirect URL will be auto-derived from the request — set this to your registered logout URL (e.g. https://mymedlink.ca)",
  SESSION_COOKIE_DOMAIN:
    "Session cookie domain defaults to .mymedlink.ca in production — set this explicitly if your production domain differs",
  STRIPE_WEBHOOK_SECRET:
    "Stripe webhook signature verification is disabled — set this to validate incoming webhook events and prevent replay attacks",
  CLAIMSHUB_WEBHOOK_URL: "ClaimsHub outbound events will be disabled",
  CLAIMSHUB_WEBHOOK_SECRET: "ClaimsHub outbound events will be disabled",
  SENDGRID_SMS_FROM_NUMBER: "SMS appointment reminders will be disabled",
};

export function validateEnv(): void {
  const isProduction =
    process.env.REPLIT_DEPLOYMENT === "1" ||
    process.env.NODE_ENV === "production";

  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Server cannot start — missing required environment variables:\n  ${missing.join("\n  ")}\n` +
        "Set them in your .env file or deployment environment.",
    );
  }

  if (isProduction) {
    const missingProduction = PRODUCTION_REQUIRED_ENV_VARS.filter(
      (key) => !process.env[key],
    );
    if (missingProduction.length > 0) {
      throw new Error(
        `Server cannot start in production — missing auth redirect environment variables:\n  ${missingProduction.join("\n  ")}\n` +
          "Set these in deployment secrets to prevent /login-failed redirects.",
      );
    }
  }

  for (const [key, note] of Object.entries(OPTIONAL_ENV_VARS)) {
    if (!process.env[key]) {
      console.warn(`[config] Optional env var ${key} not set — ${note}`);
    }
  }
}
