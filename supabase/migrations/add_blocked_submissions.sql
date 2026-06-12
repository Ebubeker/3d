-- Migration: Blocked Submissions (spam quarantine)
-- Run this in the Supabase SQL Editor.
--
-- Audit trail for every form submission the spam filter blocks. Before
-- this table existed, blocked submissions were silently dropped with a
-- fake success response — the only trace was an ephemeral Vercel log —
-- so a false positive meant a permanently lost lead with no way to even
-- know it happened. Now every block is stored here in full, so any
-- mistakenly filtered lead can be reviewed and recovered.
--
-- Access model: service-role only (no anon/authenticated policies). All
-- writes go through server routes that use createAdminClient().

CREATE TABLE IF NOT EXISTS blocked_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  -- Which gate blocked it: 'send-email' (contact / general / enterprise /
  -- join-team forms) or 'check-spam' (the /inquiry form's pre-check).
  source VARCHAR(50) NOT NULL,
  -- The formType field from /api/send-email bodies, when present.
  form_type VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  -- The full submitted body, so a false positive can be recovered intact.
  payload JSONB NOT NULL,
  email_score INTEGER NOT NULL,
  content_score INTEGER NOT NULL,
  combined_score INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blocked_submissions_created_at
  ON blocked_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blocked_submissions_email
  ON blocked_submissions (LOWER(email));

ALTER TABLE blocked_submissions ENABLE ROW LEVEL SECURITY;
-- No policies: service role bypasses RLS, anon/authenticated have zero
-- access. All operations go through server routes.
