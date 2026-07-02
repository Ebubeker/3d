import { createAdminClient } from '@/lib/supabase/admin';
import type { SpamCheckResult } from '@/lib/spam-detection';

export interface QuarantineInput {
  // Which gate blocked it. Always 'send-email' now; 'check-spam' appears
  // only on historical rows from the removed /inquiry pre-check endpoint.
  source: string;
  formType?: string;
  email: string;
  name?: string;
  // Full submitted body so a false positive can be recovered intact.
  payload: Record<string, unknown>;
  result: SpamCheckResult;
}

/**
 * Persist a spam-blocked submission to the blocked_submissions table.
 *
 * Never throws — quarantine is best-effort and must not change the
 * response the (possible) spammer sees. Returns false when the insert
 * fails (e.g. the migration hasn't been run yet); callers should still
 * proceed with their flagged-email fallback so no submission is lost.
 */
export async function recordBlockedSubmission(
  input: QuarantineInput
): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('blocked_submissions').insert({
      source: input.source,
      form_type: input.formType ?? null,
      email: input.email,
      name: input.name ?? null,
      payload: input.payload,
      email_score: input.result.emailScore,
      content_score: input.result.contentScore,
      combined_score: input.result.combinedScore,
      reason: input.result.reason ?? null,
    });
    if (error) {
      console.error('[quarantine] insert failed', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[quarantine] unexpected error', err);
    return false;
  }
}
