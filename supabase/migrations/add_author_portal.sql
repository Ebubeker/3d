-- Migration: Author Portal — Phase 1 (foundation)
-- Run this in the Supabase SQL Editor.
--
-- Scope: purely additive. No existing blog_posts / team_members policies
-- are dropped or altered. Tightening of blog_posts RLS happens in Phase 3
-- when the author portal ships.
--
-- Adds:
--   1. team_members.user_id (link to auth.users)
--   2. team_credentials (plaintext password mirror — admin-only)
--   3. blog_posts.author_id / review_status / rejection_reason
--   4. user_roles table + is_admin() helper
--
-- After running this file, run scripts/backfill-team-auth.ts to create
-- auth users + credentials for all existing team members.

-- ---------------------------------------------------------------------------
-- 1. team_members: link to auth user
-- ---------------------------------------------------------------------------

ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);

-- ---------------------------------------------------------------------------
-- 2. team_credentials (plaintext mirror — admin-only via service role)
-- ---------------------------------------------------------------------------
--
-- SECURITY NOTE: password_plaintext is stored in clear text intentionally so
-- the admin panel can display and reset team-member credentials. Supabase
-- Auth still stores the real hashed password separately — this mirror is
-- only used by admin-facing UI. Access is denied to anon and authenticated
-- by default (no policies granted), so only the service role key can read
-- or write this table. Never expose it via the public API.

CREATE TABLE IF NOT EXISTS team_credentials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_member_id UUID NOT NULL UNIQUE REFERENCES team_members(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_plaintext TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_credentials_team_member_id
  ON team_credentials(team_member_id);

-- Reuse the shared updated_at trigger if it exists in the project
DROP TRIGGER IF EXISTS update_team_credentials_updated_at ON team_credentials;
CREATE TRIGGER update_team_credentials_updated_at
  BEFORE UPDATE ON team_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE team_credentials ENABLE ROW LEVEL SECURITY;
-- Intentionally no policies: service role key bypasses RLS, so admin
-- server routes can read/write while anon and authenticated cannot.

-- ---------------------------------------------------------------------------
-- 3. blog_posts: author + review workflow columns
-- ---------------------------------------------------------------------------
--
-- review_status values:
--   'draft'           — author or admin is still working on it
--   'pending_review'  — author submitted, awaiting admin decision
--   'published'       — admin approved (or admin-published directly)
--   'rejected'        — admin rejected with a reason; author can revise
--
-- The existing status column ('draft' | 'published') is preserved and
-- still governs public visibility. review_status tracks the workflow.

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS review_status VARCHAR(20) NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Safety: constrain review_status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'blog_posts_review_status_check'
  ) THEN
    ALTER TABLE blog_posts
      ADD CONSTRAINT blog_posts_review_status_check
      CHECK (review_status IN ('draft','pending_review','published','rejected'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_review_status ON blog_posts(review_status);

-- Backfill: any pre-existing published post should have review_status='published'
UPDATE blog_posts
  SET review_status = 'published'
  WHERE status = 'published' AND review_status = 'draft';

-- ---------------------------------------------------------------------------
-- 4. user_roles + is_admin() helper
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin','author')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own role (so the client can branch UI)
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;
CREATE POLICY "Users can read own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- No insert/update/delete policies: service role only.

-- is_admin() returns true when the calling auth user has role='admin'.
-- SECURITY DEFINER so it can read user_roles even under stricter policies
-- that may be added in Phase 3.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Post-migration manual step
-- ---------------------------------------------------------------------------
--
-- The backfill script will attempt to mark the current admin as 'admin' in
-- user_roles. If you prefer to do it by hand after logging in to the admin
-- panel, run this in the SQL editor:
--
--   INSERT INTO user_roles (user_id, role)
--   SELECT id, 'admin' FROM auth.users WHERE email = 'YOUR_ADMIN_EMAIL'
--   ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
--
-- Phase 3 will tighten blog_posts RLS to enforce author-only writes using
-- is_admin(). Until then, existing permissive policies remain in place and
-- the current admin dashboard continues to work unchanged.
