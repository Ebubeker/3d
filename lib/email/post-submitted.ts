import { Resend } from 'resend';
import { SITE_URL } from '../site';

// Sender mirrors the rest of the site so domain reputation stays consistent.
const FROM = 'virtuality.fashion <amnon@virtuality.fashion>';

// Where the "new post submitted" notice lands. Defaults to the info@ inbox
// Amnon asked for; override via BLOG_REVIEW_NOTIFY_EMAIL without a code edit.
const NOTIFY_TO =
  process.env.BLOG_REVIEW_NOTIFY_EMAIL || 'info@virtuality.fashion';

const REPLY_TO = process.env.ADMIN_EMAIL || 'hello@virtuality.fashion';

interface SendPostSubmittedEmailInput {
  postId: string;
  title: string;
  authorName: string;
  excerpt?: string | null;
  category?: string | null;
}

interface SendResult {
  ok: boolean;
  error?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Notify the team when an author submits a post for review.
 *
 * Fires when a post transitions into `pending_review` (on create-and-submit
 * or on resubmit of a draft/rejected post). Never throws — failures are
 * returned as { ok: false, error } and logged, so a bounced notification
 * never blocks the author's submission.
 */
export async function sendPostSubmittedEmail(
  input: SendPostSubmittedEmailInput
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      '[sendPostSubmittedEmail] RESEND_API_KEY not set — skipping email send'
    );
    return { ok: false, error: 'RESEND_API_KEY not configured' };
  }

  const resend = new Resend(apiKey);
  const reviewUrl = `${SITE_URL}/admin/dashboard/blog/${input.postId}`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: REPLY_TO,
      subject: `New blog post submitted for review: ${input.title}`,
      html: renderEmailHtml(input, reviewUrl),
    });
    if (error) {
      console.error('[sendPostSubmittedEmail] resend error', error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error('[sendPostSubmittedEmail] unexpected error', err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

function renderEmailHtml(
  input: SendPostSubmittedEmailInput,
  reviewUrl: string
): string {
  const titleSafe = escapeHtml(input.title);
  const authorSafe = escapeHtml(input.authorName);
  const excerptSafe = input.excerpt ? escapeHtml(input.excerpt) : '';
  const categorySafe = input.category ? escapeHtml(input.category) : '';

  const metaRow = (label: string, value: string) => `
    <tr>
      <td style="padding: 6px 0; font-size: 13px; color: #6b7280; width: 90px; vertical-align: top;">${label}</td>
      <td style="padding: 6px 0; font-size: 14px; color: #111827;">${value}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New blog post submitted for review</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
            <tr>
              <td style="padding: 32px 32px 0 32px;">
                <div style="font-size: 14px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6b7280;">
                  virtuality.fashion
                </div>
                <h1 style="margin: 16px 0 8px 0; font-size: 24px; font-weight: 700; color: #111827; line-height: 1.25;">
                  New post submitted for review
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px;">
                <p style="margin: 8px 0 20px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                  <strong>${authorSafe}</strong> just submitted a blog post and it's waiting for your review in the admin dashboard.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb; padding: 8px 20px;">
                  ${metaRow('Title', `<strong>${titleSafe}</strong>`)}
                  ${categorySafe ? metaRow('Category', categorySafe) : ''}
                  ${authorSafe ? metaRow('Author', authorSafe) : ''}
                  ${excerptSafe ? metaRow('Excerpt', excerptSafe) : ''}
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 24px 32px 32px 32px;">
                <a href="${reviewUrl}" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px; padding: 14px 28px; border-radius: 8px;">
                  Review this post
                </a>
                <div style="margin-top: 12px; font-size: 12px; color: #9ca3af;">
                  Or paste this link into your browser:<br />
                  <a href="${reviewUrl}" style="color: #6b7280; text-decoration: underline;">${reviewUrl}</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 32px 32px 32px; border-top: 1px solid #f3f4f6;">
                <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #9ca3af;">
                  You're getting this because a team member submitted a post for review on virtuality.fashion. Approve or send it back with feedback from the admin dashboard.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
