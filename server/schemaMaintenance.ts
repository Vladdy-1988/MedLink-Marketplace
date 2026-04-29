export async function ensureAuthUserColumns(): Promise<void> {
  if (
    process.env.VITEST === "true" ||
    process.env.NODE_ENV === "test" ||
    process.env.DATABASE_URL === "fake" ||
    !process.env.DATABASE_URL
  ) {
    return;
  }

  const { pool } = await import("./db");

  await pool.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS stripe_customer_id varchar,
      ADD COLUMN IF NOT EXISTS stripe_subscription_id varchar,
      ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive',
      ADD COLUMN IF NOT EXISTS subscription_current_period_end timestamp,
      ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"email":true,"sms":false,"push":true,"booking_reminders":true,"marketing":false}'::jsonb,
      ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false NOT NULL;
  `);
}
