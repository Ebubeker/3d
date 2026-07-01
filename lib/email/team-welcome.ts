import { Resend } from 'resend';
import { SITE_URL } from '../site';

// Sender / reply-to. Mirror the settings used by /api/send-email so the
// domain reputation stays consistent and replies land in the same inbox
// the rest of the site points at.
const FROM = 'virtuality.fashion <amnon@virtuality.fashion>';
const REPLY_TO =
  process.env.ADMIN_EMAIL || 'info@virtuality.fashion';

const LOGIN_URL = `${SITE_URL}/author`;

// Internal records inbox — BCC'd on every welcome/reset/instructions so
// the team has an audit trail of provisioned logins without surfacing it
// in the recipient's view. Override via TEAM_WELCOME_BCC if it ever
// needs to change without a code edit.
const RECORDS_BCC =
  process.env.TEAM_WELCOME_BCC || 'info@virtuality.fashion';

/**
 * Email variants:
 *   - 'welcome'      Fired automatically when an admin creates a new team
 *                    member with an email. First-time intro copy.
 *   - 'reset'        Fired automatically when an admin clicks "Reset
 *                    Password" on an existing member.
 *   - 'instructions' Fired manually from the credentials panel when the
 *                    admin wants to nudge a team member to start writing.
 *                    Re-sends the EXISTING credentials with a detailed
 *                    step-by-step blog walkthrough.
 */
export type TeamWelcomeMode = 'welcome' | 'reset' | 'instructions';

interface SendTeamWelcomeEmailInput {
  name: string;
  email: string;
  password: string;
  mode: TeamWelcomeMode;
}

interface SendResult {
  ok: boolean;
  error?: string;
}

/**
 * Send the team-member onboarding, reset, or instructions email.
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

  const subject = subjectFor(input.mode);
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
// Copy variants
// ---------------------------------------------------------------------------

function subjectFor(mode: TeamWelcomeMode): string {
  switch (mode) {
    case 'reset':
      return 'Your virtuality.fashion portal password was reset';
    case 'instructions':
      return 'How to publish your first blog post on virtuality.fashion';
    case 'welcome':
    default:
      return 'Welcome to virtuality.fashion — your team portal login';
  }
}

function headlineFor(mode: TeamWelcomeMode): string {
  switch (mode) {
    case 'reset':
      return 'Your password was reset';
    case 'instructions':
      return 'Ready to publish your first post?';
    case 'welcome':
    default:
      return 'Welcome to the team';
  }
}

function introFor(mode: TeamWelcomeMode): string {
  switch (mode) {
    case 'reset':
      return 'An admin has reset your virtuality.fashion portal password. Your new credentials are below — use them to sign in again.';
    case 'instructions':
      return 'Here is everything you need to get your first blog post live on the virtuality.fashion blog. Your sign-in details are below, followed by a short step-by-step guide.';
    case 'welcome':
    default:
      return 'You’ve been added to the virtuality.fashion team portal. From there you can draft blog posts and submit them for admin review. Your sign-in details are below.';
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

function whatYouCanDoBlock(): string {
  return `
      <tr>
        <td style="padding: 0 32px 8px 32px;">
          <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #111827;">
            What you can do in the portal
          </h2>
          <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.6;">
            <li>Draft blog posts with a rich editor, cover images, and tags</li>
            <li>Submit posts for admin review when you’re ready</li>
            <li>See approved posts published live on the blog with your byline</li>
            <li>Revise rejected drafts with the admin’s feedback inline</li>
          </ul>
        </td>
      </tr>
    `;
}

function stepByStepBlock(): string {
  // Numbered list of how to go from logged-in to published.
  return `
      <tr>
        <td style="padding: 0 32px 8px 32px;">
          <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #111827;">
            How to publish your first post
          </h2>
          <ol style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.7;">
            <li>Click <strong>Sign in to the portal</strong> above and enter the email and password from this message.</li>
            <li>On the dashboard, click <strong>New Post</strong> to start a draft.</li>
            <li>Add a <strong>title</strong>, a short <strong>excerpt</strong>, and a <strong>cover image</strong> (anything tall and visual works).</li>
            <li>Write your content in the editor — you can use headings, lists, links, images, and quotes.</li>
            <li>Pick a <strong>category</strong> and a few <strong>tags</strong> so readers can find it.</li>
            <li>Click <strong>Save Draft</strong> anytime to come back later, or <strong>Submit for Review</strong> when it’s ready.</li>
            <li>An admin will review and either publish your post or send it back with feedback you can act on.</li>
            <li>Once published, your post goes live on the blog with your name and photo as the byline.</li>
          </ol>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 32px 8px 32px;">
          <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #6b7280;">
            Tip: aim for 600–1,000 words on a single topic. Real examples and screenshots from your own work always perform best.
          </p>
        </td>
      </tr>
    `;
}

function renderEmailHtml(input: SendTeamWelcomeEmailInput): string {
  const firstName = input.name.split(' ')[0] || input.name;
  const nameSafe = escapeHtml(firstName);
  const emailSafe = escapeHtml(input.email);
  const passwordSafe = escapeHtml(input.password);

  const headline = headlineFor(input.mode);
  const intro = introFor(input.mode);

  // Content block under the CTA varies by mode:
  //   welcome      => bullet list of portal capabilities
  //   reset        => nothing (keep the email short and focused)
  //   instructions => numbered step-by-step guide
  let contentBlock = '';
  if (input.mode === 'welcome') contentBlock = whatYouCanDoBlock();
  else if (input.mode === 'instructions') contentBlock = stepByStepBlock();

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
                  virtuality.fashion
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
                  Keep this email somewhere safe or save the password in your browser. If you lose it, reply and we’ll reset it for you.
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
            ${contentBlock}
            <tr>
              <td style="padding: 20px 32px 32px 32px; border-top: 1px solid #f3f4f6;">
                <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #9ca3af;">
                  You’re getting this email because an admin sent you the virtuality.fashion team portal details. If this wasn’t expected, just reply to this message and we’ll take a look.
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
