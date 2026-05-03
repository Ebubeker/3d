import { Resend } from 'resend';

// Sender / reply-to. Mirror the settings used by /api/send-email so the
// domain reputation stays consistent and replies land in the same inbox
// the rest of the site points at.
const FROM = 'Virtuality Fashion <amnon@virtuality.fashion>';
const REPLY_TO =
  process.env.ADMIN_EMAIL || 'hello@virtuality.fashion';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://virtuality.fashion';
const LOGIN_URL = `${SITE_URL}/author`;

// Internal records inbox — BCC'd on every welcome/reset so the team has
// an audit trail of provisioned logins without surfacing it in the
// recipient's view. Override via TEAM_WELCOME_BCC if it ever needs to
// change without a code edit.
const RECORDS_BCC =
  process.env.TEAM_WELCOME_BCC || 'info@virtuality.fashion';

interface SendTeamWelcomeEmailInput {
  name: string;
  email: string;
  password: string;
  /** True when the admin is resetting an existing account, false for a
   *  brand-new member. Swaps subject line and headline copy. */
  isReset: boolean;
}

interface SendResult {
  ok: boolean;
  error?: string;
}

/**
 * Send the team-member onboarding or password-reset email.
 *
 * Never throws — failures are returned as { ok: false, error }. Call sites
 * should log but not fail the enclosing request, so a bounced email never
 * blocks credential provisioning.
 */
export async function sendTeamWelcomeEmail(
  input: SendTeamWelcomeEmailInput
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      '[sendTeamWelcomeEmail] RESEND_API_KEY not set — skipping email send'
    );
    return { ok: false, error: 'RESEND_API_KEY not configured' };
  }

  const resend = new Resend(apiKey);

  const subject = input.isReset
    ? 'Your Virtuality Fashion portal password was reset'
    : 'Welcome to Virtuality Fashion — your team portal login';

  const html = renderEmailHtml(input);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: input.email,
      bcc: RECORDS_BCC,
      replyTo: REPLY_TO,
      subject,
      html,
    });
    if (error) {
      console.error('[sendTeamWelcomeEmail] resend error', error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error('[sendTeamWelcomeEmail] unexpected error', err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ---------------------------------------------------------------------------
// HTML template
// ---------------------------------------------------------------------------
//
// Inline styles only — most email clients strip <style> blocks. No external
// images or fonts so the email renders the same on Gmail, Outlook, Apple
// Mail, and mobile clients. Max-width 600px is the cross-client safe zone.

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderEmailHtml(input: SendTeamWelcomeEmailInput): string {
  const firstName = input.name.split(' ')[0] || input.name;
  const nameSafe = escapeHtml(firstName);
  const emailSafe = escapeHtml(input.email);
  const passwordSafe = escapeHtml(input.password);

  const headline = input.isReset
    ? 'Your password was reset'
    : 'Welcome to the team';

  const intro = input.isReset
    ? `An admin has reset your Virtuality Fashion portal password. Your new credentials are below — use them to sign in again.`
    : `You\u2019ve been added to the Virtuality Fashion team portal. From there you can draft blog posts and submit them for admin review. Your sign-in details are below.`;

  const whatYouCanDoBlock = input.isReset
    ? ''
    : `
      <tr>
        <td style="padding: 0 32px 8px 32px;">
          <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #111827;">
            What you can do in the portal
          </h2>
          <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.6;">
            <li>Draft blog posts with a rich editor, cover images, and tags</li>
            <li>Submit posts for admin review when you\u2019re ready</li>
            <li>See approved posts published live on the blog with your byline</li>
            <li>Revise rejected drafts with the admin\u2019s feedback inline</li>
          </ul>
        </td>
      </tr>
    `;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(headline)}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
            <tr>
              <td style="padding: 32px 32px 0 32px;">
                <div style="font-size: 14px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6b7280;">
                  Virtuality Fashion
                </div>
                <h1 style="margin: 16px 0 8px 0; font-size: 26px; font-weight: 700; color: #111827; line-height: 1.2;">
                  ${escapeHtml(headline)}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px;">
                <p style="margin: 8px 0 16px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                  Hi ${nameSafe},
                </p>
                <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                  ${escapeHtml(intro)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;">
                  <tr>
                    <td style="padding: 16px 20px 8px 20px;">
                      <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6b7280;">
                        Email
                      </div>
                      <div style="margin-top: 4px; font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size: 14px; color: #111827; word-break: break-all;">
                        ${emailSafe}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 20px 16px 20px; border-top: 1px solid #e5e7eb;">
                      <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6b7280;">
                        Password
                      </div>
                      <div style="margin-top: 4px; font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size: 14px; color: #111827; word-break: break-all;">
                        ${passwordSafe}
                      </div>
                    </td>
                  </tr>
                </table>
                <p style="margin: 12px 0 24px 0; font-size: 13px; line-height: 1.5; color: #6b7280;">
                  Keep this email somewhere safe or save the password in your browser. If you lose it, reply and we\u2019ll reset it for you.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 32px 28px 32px;">
                <a href="${LOGIN_URL}" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px; padding: 14px 28px; border-radius: 8px;">
                  Sign in to the portal
                </a>
                <div style="margin-top: 12px; font-size: 12px; color: #9ca3af;">
                  Or paste this link into your browser:<br />
                  <a href="${LOGIN_URL}" style="color: #6b7280; text-decoration: underline;">${LOGIN_URL}</a>
                </div>
              </td>
            </tr>
            ${whatYouCanDoBlock}
            <tr>
              <td style="padding: 20px 32px 32px 32px; border-top: 1px solid #f3f4f6;">
                <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #9ca3af;">
                  You\u2019re getting this email because an admin added you to the Virtuality Fashion team portal. If this wasn\u2019t expected, just reply to this message and we\u2019ll take a look.
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
