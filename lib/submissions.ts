import { createAdminClient } from '@/lib/supabase/admin';

export interface SubmissionRecordInput {
  formType: string;
  email: string;
  name?: string;
  // Full submitted body so a lead is recoverable even if every email fails.
  payload: Record<string, unknown>;
}

export type SubmissionStatus = 'sent' | 'send_failed' | 'flagged';

/**
 * Persist an inbound form submission to the submissions ledger BEFORE any
 * email is attempted. Until this table existed, a successful lead lived
 * only inside a Resend email: one failed send meant a permanently lost
 * lead with no trace (Vercel logs expire within a day).
 *
 * Never throws — the ledger is best-effort and must not break the send
 * path. Returns the row id, or null when the insert fails (e.g. the
 * migration has not been run yet); callers proceed normally either way.
 */
export async function recordSubmission(
  input: SubmissionRecordInput
): Promise<string | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        form_type: input.formType,
        email: input.email,
        name: input.name ?? null,
        payload: input.payload,
        status: 'received',
      })
      .select('id')
      .single();
    if (error) {
      console.error('[submissions] insert failed', error);
      return null;
    }
    return data.id;
  } catch (err) {
    console.error('[submissions] unexpected error', err);
    return null;
  }
}

/**
 * Update a ledger row after the send attempt. `detail` carries the Resend
 * message id on success or the error text on failure. Never throws.
 */
export async function markSubmission(
  id: string | null,
  status: SubmissionStatus,
  detail?: string | null
): Promise<void> {
  if (!id) return;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('submissions')
      .update({ status, detail: detail ?? null })
      .eq('id', id);
    if (error) console.error('[submissions] status update failed', error);
  } catch (err) {
    console.error('[submissions] unexpected error', err);
  }
}
