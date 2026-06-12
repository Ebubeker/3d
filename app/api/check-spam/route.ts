import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkSpam, extractContentForSpamCheck } from '@/lib/spam-detection';
import { recordBlockedSubmission } from '@/lib/spam-quarantine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const contentForCheck = extractContentForSpamCheck(body as Record<string, unknown>);
    const name = [body.firstName, body.lastName].filter(Boolean).join(' ') || body.name || undefined;

    const spamResult = checkSpam({
      email: body.email,
      content: contentForCheck,
      name,
    });

    if (spamResult.isSpam) {
      console.log('[SPAM DETECTED - INQUIRY]', {
        email: body.email,
        scores: {
          email: spamResult.emailScore,
          content: spamResult.contentScore,
          combined: spamResult.combinedScore,
        },
        reason: spamResult.reason,
      });

      // The inquiry form drops flagged submissions client-side (the visitor
      // sees a fake success and nothing is submitted), so this is the only
      // place the data still exists. Quarantine it: persist the full body
      // and forward it with a warning banner so a false positive is always
      // recoverable.
      await recordBlockedSubmission({
        source: 'check-spam',
        email: body.email,
        name,
        payload: body as Record<string, unknown>,
        result: spamResult,
      });

      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fieldsHtml = Object.entries(body as Record<string, unknown>)
          .filter(([, v]) => typeof v === 'string' && v)
          .map(([k, v]) => `<p><strong>${k}:</strong> ${String(v).replace(/</g, '&lt;')}</p>`)
          .join('');
        await resend.emails.send({
          from: 'virtuality.fashion <amnon@virtuality.fashion>',
          to: 'info@virtuality.fashion',
          replyTo: body.email,
          subject: '[Suspected spam] Project Inquiry - virtuality.fashion',
          html: `
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px 16px; margin-bottom: 16px; font-size: 13px; color: #92400e;">
              The spam filter flagged this inquiry (score ${spamResult.combinedScore}/100 — ${spamResult.reason}).
              It was quarantined, not dropped: review it in case it is a real lead.
            </div>
            <h2>Project Inquiry (flagged)</h2>
            ${fieldsHtml}
          `,
        });
      } catch (err) {
        console.error('[SPAM DETECTED - INQUIRY] quarantine email failed', err);
      }
    }

    // Only return isSpam boolean -- never expose scores to the client
    return NextResponse.json({ isSpam: spamResult.isSpam });
  } catch (error) {
    console.error('Spam check error:', error);
    // On error, default to "not spam" so legitimate users aren't blocked
    return NextResponse.json({ isSpam: false });
  }
}
