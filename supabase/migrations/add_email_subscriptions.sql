-- Migration: Email Subscriptions
-- Run this in the Supabase SQL Editor.
--
-- Captures every visitor who passes the spam check on a gated form (e.g.
-- the team-page unlock form) along with whether they consented to receive
-- marketing/update emails. The unsubscribe_token powers a public
-- /unsubscribe?token=... page so users can opt out in one click without
-- needing an account.
--
-- Access model: service-role only (no anon/authenticated policies). All
-- reads/writes go through server routes that use createAdminClient().

CREATE TABLE IF NOT EXISTS email_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  company VARCHAR(255),
  -- Which form or event captured the email. Lets the admin filter the
  -- list by acquisition source as more entry points are added later.
  source VARCHAR(50) NOT NULL DEFAULT 'team-unlock',
  -- True when the user opted in to receive marketing updates. False
  -- means we still have their email on file (they passed the gate and
  -- accepted T&C) but explicitly declined updates.
  opted_in BOOLEAN NOT NULL DEFAULT FALSE,
  -- Random per-row token. Embedded in unsubscribe links so the recipient
  -- can flip opted_in -> false without authenticating, while preventing
  -- enumeration of other subscribers.
  unsubscribe_token VARCHAR(64) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Case-insensitive uniqueness on email so re-submissions update the
-- existing row (latest opt-in state wins) instead of duplicating.
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_subscriptions_email_lower
  ON email_subscriptions (LOWER(email));

CREATE INDEX IF NOT EXISTS idx_email_subscriptions_created_at
  ON email_subscriptions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_subscriptions_opted_in
  ON email_subscriptions (opted_in);

DROP TRIGGER IF EXISTS update_email_subscriptions_updated_at ON email_subscriptions;
CREATE TRIGGER update_email_subscriptions_updated_at
  BEFORE UPDATE ON email_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;
-- No policies: service role bypasses RLS, anon/authenticated have zero
-- access. All operations go through server routes.
