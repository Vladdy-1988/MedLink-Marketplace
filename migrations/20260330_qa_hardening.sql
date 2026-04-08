BEGIN;

WITH ranked_providers AS (
  SELECT
    id,
    user_id,
    FIRST_VALUE(id) OVER (
      PARTITION BY user_id
      ORDER BY created_at DESC NULLS LAST, id DESC
    ) AS keep_id
  FROM providers
),
duplicate_providers AS (
  SELECT id, keep_id
  FROM ranked_providers
  WHERE id <> keep_id
)
UPDATE services AS target
SET provider_id = duplicate_providers.keep_id
FROM duplicate_providers
WHERE target.provider_id = duplicate_providers.id;

WITH ranked_providers AS (
  SELECT
    id,
    user_id,
    FIRST_VALUE(id) OVER (
      PARTITION BY user_id
      ORDER BY created_at DESC NULLS LAST, id DESC
    ) AS keep_id
  FROM providers
),
duplicate_providers AS (
  SELECT id, keep_id
  FROM ranked_providers
  WHERE id <> keep_id
)
UPDATE bookings AS target
SET provider_id = duplicate_providers.keep_id
FROM duplicate_providers
WHERE target.provider_id = duplicate_providers.id;

WITH ranked_providers AS (
  SELECT
    id,
    user_id,
    FIRST_VALUE(id) OVER (
      PARTITION BY user_id
      ORDER BY created_at DESC NULLS LAST, id DESC
    ) AS keep_id
  FROM providers
),
duplicate_providers AS (
  SELECT id, keep_id
  FROM ranked_providers
  WHERE id <> keep_id
)
UPDATE provider_credentials AS target
SET provider_id = duplicate_providers.keep_id
FROM duplicate_providers
WHERE target.provider_id = duplicate_providers.id;

WITH ranked_providers AS (
  SELECT
    id,
    user_id,
    FIRST_VALUE(id) OVER (
      PARTITION BY user_id
      ORDER BY created_at DESC NULLS LAST, id DESC
    ) AS keep_id
  FROM providers
),
duplicate_providers AS (
  SELECT id, keep_id
  FROM ranked_providers
  WHERE id <> keep_id
)
UPDATE reviews AS target
SET provider_id = duplicate_providers.keep_id
FROM duplicate_providers
WHERE target.provider_id = duplicate_providers.id;

WITH ranked_providers AS (
  SELECT
    id,
    user_id,
    FIRST_VALUE(id) OVER (
      PARTITION BY user_id
      ORDER BY created_at DESC NULLS LAST, id DESC
    ) AS keep_id
  FROM providers
),
duplicate_providers AS (
  SELECT id, keep_id
  FROM ranked_providers
  WHERE id <> keep_id
)
UPDATE transactions AS target
SET provider_id = duplicate_providers.keep_id
FROM duplicate_providers
WHERE target.provider_id = duplicate_providers.id;

WITH ranked_providers AS (
  SELECT
    id,
    user_id,
    FIRST_VALUE(id) OVER (
      PARTITION BY user_id
      ORDER BY created_at DESC NULLS LAST, id DESC
    ) AS keep_id
  FROM providers
),
duplicate_providers AS (
  SELECT id, keep_id
  FROM ranked_providers
  WHERE id <> keep_id
)
UPDATE provider_availability AS target
SET provider_id = duplicate_providers.keep_id
FROM duplicate_providers
WHERE target.provider_id = duplicate_providers.id;

WITH ranked_providers AS (
  SELECT
    id,
    user_id,
    FIRST_VALUE(id) OVER (
      PARTITION BY user_id
      ORDER BY created_at DESC NULLS LAST, id DESC
    ) AS keep_id
  FROM providers
),
duplicate_providers AS (
  SELECT id, keep_id
  FROM ranked_providers
  WHERE id <> keep_id
)
UPDATE provider_blackouts AS target
SET provider_id = duplicate_providers.keep_id
FROM duplicate_providers
WHERE target.provider_id = duplicate_providers.id;

WITH ranked_providers AS (
  SELECT
    id,
    user_id,
    FIRST_VALUE(id) OVER (
      PARTITION BY user_id
      ORDER BY created_at DESC NULLS LAST, id DESC
    ) AS keep_id
  FROM providers
),
duplicate_providers AS (
  SELECT id, keep_id
  FROM ranked_providers
  WHERE id <> keep_id
)
UPDATE provider_patient_notes AS target
SET provider_id = duplicate_providers.keep_id
FROM duplicate_providers
WHERE target.provider_id = duplicate_providers.id;

WITH ranked_providers AS (
  SELECT
    id,
    user_id,
    FIRST_VALUE(id) OVER (
      PARTITION BY user_id
      ORDER BY created_at DESC NULLS LAST, id DESC
    ) AS keep_id
  FROM providers
),
duplicate_providers AS (
  SELECT id, keep_id
  FROM ranked_providers
  WHERE id <> keep_id
)
UPDATE waitlist_entries AS target
SET provider_id = duplicate_providers.keep_id
FROM duplicate_providers
WHERE target.provider_id = duplicate_providers.id;

WITH ranked_providers AS (
  SELECT
    id,
    user_id,
    FIRST_VALUE(id) OVER (
      PARTITION BY user_id
      ORDER BY created_at DESC NULLS LAST, id DESC
    ) AS keep_id
  FROM providers
),
duplicate_providers AS (
  SELECT id, keep_id
  FROM ranked_providers
  WHERE id <> keep_id
)
UPDATE user_reports AS target
SET provider_id = duplicate_providers.keep_id
FROM duplicate_providers
WHERE target.provider_id = duplicate_providers.id;

WITH ranked_providers AS (
  SELECT
    id,
    user_id,
    FIRST_VALUE(id) OVER (
      PARTITION BY user_id
      ORDER BY created_at DESC NULLS LAST, id DESC
    ) AS keep_id
  FROM providers
),
duplicate_providers AS (
  SELECT id
  FROM ranked_providers
  WHERE id <> keep_id
)
DELETE FROM providers AS target
USING duplicate_providers
WHERE target.id = duplicate_providers.id;

WITH ranked_waitlist AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY patient_id, provider_id
      ORDER BY created_at ASC NULLS LAST, id ASC
    ) AS row_number
  FROM waitlist_entries
)
DELETE FROM waitlist_entries AS target
USING ranked_waitlist
WHERE target.id = ranked_waitlist.id
  AND ranked_waitlist.row_number > 1;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'providers_user_id_unique'
  ) THEN
    ALTER TABLE providers
    ADD CONSTRAINT providers_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'waitlist_entries_patient_provider_unique'
  ) THEN
    ALTER TABLE waitlist_entries
    ADD CONSTRAINT waitlist_entries_patient_provider_unique
    UNIQUE (patient_id, provider_id);
  END IF;
END $$;

COMMIT;
