BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS subscription_current_period_end timestamp;

COMMIT;
