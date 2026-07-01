-- Migration: Submissions ledger + team_members write lockdown
-- Run this in the Supabase SQL Editor.
--
-- 1) submissions: durable record of EVERY form submission that reaches
--    /api/send-email, written BEFORE the notification email is attempted.
--    Until now a successful lead existed only as a Resend email: if that
--    single send failed (outage, key rotation, account issue) the lead
--    was lost with no trace. status: received -> sent | send_failed |
--    flagged ("detail" carries the Resend message id or the error text).
--
-- 2) team_members: the public anon key could UPDATE rows (verified with a
--    live probe on 2026-07-01), letting anyone rewrite designer profiles
--    or hijack the quote-notification BCC address. No browser code writes
--    to team_members (admin routes use the service role), so client roles
--    lose all write access.

CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  -- The formType from /api/send-email: contact / general / enterprise /
  -- join-team / inquiry.
  form_type VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  -- Full submitted body, so a lead survives even if every email fails.
  payload JSONB NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'received',
  -- Resend message id on success, error text on failure.
  detail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_created_at
  ON submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_email
  ON submissions (LOWER(email));

CREATE INDEX IF NOT EXISTS idx_submissions_status
  ON submissions (status);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
-- No policies: service role bypasses RLS, anon/authenticated have zero
-- access. All operations go through server routes.

REVOKE INSERT, UPDATE, DELETE ON team_members FROM anon, authenticated;
