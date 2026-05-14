import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendVisitorWelcomeEmail } from '@/lib/email/visitor-welcome';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// POST — record an email subscription
// ---------------------------------------------------------------------------
//
// Body: { email, name?, company?, source?, optedIn }
//
// Behavior:
//   - Upserts the row keyed on LOWER(email). Re-submissions overwrite the
//     latest opt-in state and refresh `updated_at`.
//   - Generates a fresh unsubscribe_token on first insert. Existing rows
//     keep their original token so old links stay valid.
//   - opted_in=false sets unsubscribed_at; opted_in=true clears it.
//
// Public endpoint — called from the post-T&C opt-in modal on /team. No
// auth required, but the email itself is the only addressable subject.

interface SubscribeBody {
  email?: string;
  name?: string;
  company?: string;
  source?: string;
  optedIn?: boolean;
}

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: SubscribeBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = (body.email || '').trim();
  if (!email || !EMAIL_RX.test(email)) {
    return NextResponse.json(
      { error: 'A valid email is required' },
      { status: 400 }
    );
  }

  const optedIn = body.optedIn === true;
  const name = body.name?.trim() || null;
  const company = body.company?.trim() || null;
  const source = body.source?.trim() || 'team-unlock';

  const admin = createAdminClient();

  // Look up by case-insensitive email so we can decide insert vs update
  // and avoid clobbering the original unsubscribe_token on re-submission.
  const { data: existing, error: lookupErr } = await admin
    .from('email_subscriptions')
    .select('id, unsubscribe_token')
    .ilike('email', email)
    .maybeSingle();

  if (lookupErr) {
    console.error('[subscribe] lookup error', lookupErr);
    return NextResponse.json({ error: lookupErr.message }, { status: 500 });
  }

  const now = new Date().toISOString();

  if (existing) {
    const { error: updErr } = await admin
      .from('email_subscriptions')
      .update({
        name,
        company,
        source,
        opted_in: optedIn,
        unsubscribed_at: optedIn ? null : now,
        updated_at: now,
      })
      .eq('id', existing.id);

    if (updErr) {
      console.error('[subscribe] update error', updErr);
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  const token = crypto.randomBytes(24).toString('hex');

  const { error: insErr } = await admin.from('email_subscriptions').insert({
    email,
    name,
    company,
    source,
    opted_in: optedIn,
    unsubscribe_token: token,
    unsubscribed_at: optedIn ? null : now,
  });

  if (insErr) {
    console.error('[subscribe] insert error', insErr);
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  // Fire the visitor welcome email only on first signup. Re-submissions
  // hit the update path above and never reach this point, so people who
  // re-fill the form don't get the welcome email twice.
  //
  // We await rather than fire-and-forget because Next.js disposes the
  // route handler's execution context once the response returns, which
  // aborts any in-flight fetch — Resend then surfaces it as
  // "Unable to fetch data. The request could not be resolved." Send
  // failures (network, Resend rejection) are logged but never fail the
  // response: the user already passed the gate, and a bounced welcome
  // shouldn't reopen the modal.
  await sendVisitorWelcomeEmail({
    name: name || '',
    email,
    optedIn,
    unsubscribeToken: token,
  });

  return NextResponse.json({ ok: true });
}
