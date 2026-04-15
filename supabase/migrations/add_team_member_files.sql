-- Migration: Team Member Files — admin-only document storage
-- Run this in the Supabase SQL Editor.
--
-- Scope: purely additive. Adds a private per-team-member file vault that is
-- only reachable through admin API routes via the service role key. Nothing
-- in this migration is exposed to anon or authenticated clients.
--
-- Adds:
--   1. team_member_files table (metadata for each uploaded document)
--   2. Private storage bucket 'team-member-files' (no public read)
--
-- Design notes:
--   - password_plaintext in team_credentials shows the pattern we follow:
--     service-role-only tables have RLS enabled but NO policies, so anon and
--     authenticated requests are denied by default. Only routes that use
--     createAdminClient() (service role) can read/write.
--   - The file binary itself lives in Supabase Storage. This table only
--     stores metadata + a storage_path pointer so admins can list, download
--     (via signed URL), and delete.
--   - category is a free-form text column constrained by CHECK so we can
--     add new categories later without a schema migration.

-- ---------------------------------------------------------------------------
-- 1. team_member_files (metadata for admin-uploaded documents)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS team_member_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  file_name VARCHAR(500) NOT NULL,        -- original filename (display)
  storage_path TEXT NOT NULL UNIQUE,      -- path inside the storage bucket
  file_size BIGINT NOT NULL,              -- bytes
  mime_type VARCHAR(255) NOT NULL,
  label VARCHAR(255),                     -- optional short label
  category VARCHAR(50) NOT NULL DEFAULT 'other'
    CHECK (category IN ('contract', 'invoice', 'tax', 'payment', 'other')),
  notes TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_member_files_team_member_id
  ON team_member_files(team_member_id);

CREATE INDEX IF NOT EXISTS idx_team_member_files_created_at
  ON team_member_files(created_at DESC);

-- Reuse the shared updated_at trigger function from the base schema
DROP TRIGGER IF EXISTS update_team_member_files_updated_at ON team_member_files;
CREATE TRIGGER update_team_member_files_updated_at
  BEFORE UPDATE ON team_member_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE team_member_files ENABLE ROW LEVEL SECURITY;
-- Intentionally NO policies: service role key bypasses RLS, so admin server
-- routes can read/write while anon and authenticated requests are denied.

-- ---------------------------------------------------------------------------
-- 2. Private storage bucket for the file binaries
-- ---------------------------------------------------------------------------
--
-- public = false means no public URL works. Admins must generate a signed
-- URL via createSignedUrl() on the server to let the browser download a file.

INSERT INTO storage.buckets (id, name, public)
VALUES ('team-member-files', 'team-member-files', false)
ON CONFLICT (id) DO NOTHING;

-- No storage policies for anon/authenticated — service role key bypasses
-- storage RLS, so only our server routes can upload, list, or download.
