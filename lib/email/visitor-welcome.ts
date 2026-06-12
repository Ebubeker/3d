import { Resend } from 'resend';
import { SITE_URL } from '../site';

// Sender / reply-to mirror the team-welcome template so domain reputation
// stays consistent and replies land in the same inbox.
const FROM = 'virtuality.fashion <amnon@virtuality.fashion>';
const REPLY_TO = process.env.ADMIN_EMAIL || 'hello@virtuality.fashion';

const TEAM_URL = `${SITE_URL}/team`;

// Internal records inbox — BCC'd so the team has an audit trail of who
// completed the unlock gate. Same envelope used by team-welcome.ts.
const RECORDS_BCC =
  process.env.TEAM_WELCOME_BCC || 'info@virtuality.fashion';

interface SendVisitorWelcomeInput {
  name: string;
  email: string;
  optedIn: boolean;
  // Required when optedIn is true so the email can carry an unsubscribe
  // link. Ignored when optedIn is false (no marketing list, no link).
  unsubscribeToken?: string;
}

interface SendResult {
  ok: boolean;
  error?: string;
}

/**
 * Fired once per email when a visitor completes the /team unlock gate.
 *
 * Confirms access and explains what to do next. Includes an unsubscribe
 * footer only when the visitor opted in to marketing updates — opted-out
 * recipients never join the marketing list so there's nothing to
 * unsubscribe from.
 *
 * Never throws — failures are returned as { ok: false, error }. The
 * /api/subscribe call site should log but not fail the request, so a
 * bounced welcome email never blocks the visitor's access.
 */
export async function sendVisitorWelcomeEmail(
  input: SendVisitorWelcomeInput
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      '[sendVisitorWelcomeEmail] RESEND_API_KEY not set — skipping email send'
    );
    return { ok: false, error: 'RESEND_API_KEY not configured' };
  }

  const resend = new Resend(apiKey);

  const html = renderEmailHtml(input);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: input.email,
      bcc: RECORDS_BCC,
      replyTo: REPLY_TO,
      subject: 'Welcome to virtuality.fashion — your team access is unlocked',
      html,
    });
    if (error) {
      console.error('[sendVisitorWelcomeEmail] resend error', error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error('[sendVisitorWelcomeEmail] unexpected error', err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ---------------------------------------------------------------------------
// HTML template — inline styles only, max 600px, no external assets
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unsubscribeFooter(token: string): string {
  const url = `${SITE_URL}/unsubscribe?token=${encodeURIComponent(token)}`;
  return `
      <tr>
        <td style="padding: 16px 32px 32px 32px; border-top: 1px solid #f3f4f6;">
          <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #9ca3af; text-align: center;">
            You're receiving virtuality.fashion updates because you opted in
            when unlocking team access. Don't want these anymore?
            <a href="${url}" style="color: #6b7280; text-decoration: underline;">Unsubscribe instantly</a>.
          </p>
        </td>
      </tr>
    `;
}

function plainFooter(): string {
  // Used when the visitor opted out of marketing — we still send this
  // one transactional confirmation, so no unsubscribe link is needed
  // (they aren't on any list to leave).
  return `
      <tr>
        <td style="padding: 20px 32px 32px 32px; border-top: 1px solid #f3f4f6;">
          <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #9ca3af;">
            You're getting this email because you unlocked team access on
            virtuality.fashion. If this wasn't you, just reply and we'll
            take a look.
          </p>
        </td>
      </tr>
    `;
}

function renderEmailHtml(input: SendVisitorWelcomeInput): string {
  const firstName = input.name.split(' ')[0] || input.name || 'there';
  const nameSafe = escapeHtml(firstName);

  const footer =
    input.optedIn && input.unsubscribeToken
      ? unsubscribeFooter(input.unsubscribeToken)
      : plainFooter();

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Welcome to virtuality.fashion</title>
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
                <h1 style="margin: 16px 0 8px 0; font-size: 26px; font-weight: 700; color: #111827; line-height: 1.2;">
                  You're in.
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px;">
                <p style="margin: 8px 0 16px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                  Hi ${nameSafe},
                </p>
                <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                  Thanks for unlocking access to the virtuality.fashion team
                  marketplace. You can now browse profiles, portfolios, and
                  past work from our vetted fashion technical designers, 3D
                  specialists, and patternmakers.
                </p>
                <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                  A member of our team will also follow up shortly to learn
                  more about your project and point you to the right
                  specialists.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 32px 28px 32px;">
                <a href="${TEAM_URL}" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px; padding: 14px 28px; border-radius: 8px;">
                  Browse the team
                </a>
                <div style="margin-top: 12px; font-size: 12px; color: #9ca3af;">
                  Or paste this link into your browser:<br />
                  <a href="${TEAM_URL}" style="color: #6b7280; text-decoration: underline;">${TEAM_URL}</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px 8px 32px;">
                <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #111827;">
                  What you can do next
                </h2>
                <ul style="margin: 0 0 16px 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.6;">
                  <li>Browse the team and review individual portfolios.</li>
                  <li>Click <strong>Work with [name]</strong> on any profile to start a direct conversation.</li>
                  <li>For larger projects, request an <strong>Enterprise team</strong> and we'll curate the right specialists for you.</li>
                </ul>
              </td>
            </tr>
            ${footer}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
