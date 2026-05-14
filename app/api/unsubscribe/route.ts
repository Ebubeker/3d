import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// POST — unsubscribe by token
// ---------------------------------------------------------------------------
//
// Body: { token: string }
//
// Looks up the row by unsubscribe_token, flips opted_in to false, and
// stamps unsubscribed_at. Idempotent — repeat calls on an already-
// unsubscribed token return ok without changing the timestamp again.
//
// Token-based so the recipient can opt out from an emailed link without
// authenticating. The token is per-row random hex, so it can't be guessed
// or used to enumerate subscribers.

interface UnsubscribeBody {
  token?: string;
}

export async function POST(request: NextRequest) {
  let body: UnsubscribeBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const token = (body.token || '').trim();
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: existing, error: lookupErr } = await admin
    .from('email_subscriptions')
    .select('id, email, opted_in')
    .eq('unsubscribe_token', token)
    .maybeSingle();

  if (lookupErr) {
    console.error('[unsubscribe] lookup error', lookupErr);
    return NextResponse.json({ error: lookupErr.message }, { status: 500 });
  }

  if (!existing) {
    return NextResponse.json(
      { error: 'Unsubscribe link is invalid or has expired' },
      { status: 404 }
    );
  }

  // Already unsubscribed — return success without re-stamping the
  // timestamp so the original opt-out date is preserved.
  if (!existing.opted_in) {
    return NextResponse.json({ ok: true, email: existing.email });
  }

  const now = new Date().toISOString();
  const { error: updErr } = await admin
    .from('email_subscriptions')
    .update({
      opted_in: false,
      unsubscribed_at: now,
      updated_at: now,
    })
    .eq('id', existing.id);

  if (updErr) {
    console.error('[unsubscribe] update error', updErr);
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, email: existing.email });
}
