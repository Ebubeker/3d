-- Migration: Add display_order and is_active to team_members
-- Run this in your Supabase SQL Editor

-- 1. Add columns
ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS display_order INTEGER,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- 2. Backfill display_order using current created_at DESC ordering
-- so existing public ordering is preserved on first deploy
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) AS rn
  FROM team_members
  WHERE display_order IS NULL
)
UPDATE team_members t
SET display_order = ordered.rn
FROM ordered
WHERE t.id = ordered.id;

-- 3. Enforce NOT NULL after backfill
ALTER TABLE team_members
  ALTER COLUMN display_order SET NOT NULL,
  ALTER COLUMN display_order SET DEFAULT 0;

-- 4. Index for ordering query performance
CREATE INDEX IF NOT EXISTS idx_team_members_display_order
  ON team_members(display_order);

CREATE INDEX IF NOT EXISTS idx_team_members_is_active
  ON team_members(is_active);
