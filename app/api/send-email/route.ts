import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { checkSpam, extractContentForSpamCheck } from '@/lib/spam-detection';
import { recordBlockedSubmission } from '@/lib/spam-quarantine';
import { recordSubmission, markSubmission } from '@/lib/submissions';
import { createAdminClient } from '@/lib/supabase/admin';
import { escapeHtml } from '@/lib/escape-html';

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_TO = 'info@virtuality.fashion';
const NOTIFY_FROM = 'virtuality.fashion <amnon@virtuality.fashion>';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FORM_TYPES = ['contact', 'general', 'enterprise', 'join-team', 'inquiry'] as const;
type FormType = (typeof FORM_TYPES)[number];

// Coerce unknown body fields to trimmed strings so a client regression
// (renamed field, wrong type) degrades to an empty value instead of a
// runtime crash the visitor sees as a generic connection error.
function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

/**
 * Resolve the designer's BCC address server-side from the designer name.
 * The client used to send designerEmail in the body, which made the
 * endpoint an arbitrary-BCC relay and meant one malformed DB value could
 * break every quote request for that designer. A lookup failure or an
 * invalid stored address just skips the BCC — the office copy always sends.
 */
async function resolveDesignerEmail(designerName: string): Promise<string | null> {
  if (!designerName) return null;
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('team_members')
      .select('email')
      .eq('name', designerName)
      .maybeSingle();
    if (error || !data?.email) return null;
    const email = String(data.email).trim();
    return EMAIL_RX.test(email) ? email : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const name = str(body.name);
    const email = str(body.email);
    const company = str(body.company);
    const message = str(body.message);
    const subject = str(body.subject);
    const designer = str(body.designer);
    const projectReference = str(body.projectReference);
    const queryType = str(body.queryType);
    const role = str(body.role);
    const projectType = str(body.projectType);
    const category = str(body.category);
    const deliverables = str(body.deliverables);
    const timeline = str(body.timeline);
    const notes = str(body.notes);
    // Inquiry-specific fields (the /inquiry form posts here now).
    const phone = str(body.phone);
    const productName = str(body.productName);
    const quantity = str(body.quantity);
    const targetMarket = str(body.targetMarket);
    const budgetRange = str(body.budgetRange);
    const additionalNotes = str(body.additionalNotes);
    const formType = str(body.formType) as FormType;

    if (!FORM_TYPES.includes(formType)) {
      return NextResponse.json(
        { success: false, error: 'Unknown form type' },
        { status: 400 }
      );
    }
    if (!EMAIL_RX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'A valid email is required' },
        { status: 400 }
      );
    }

    // Honeypot: a visually hidden "website" field real visitors never see.
    // A bot that fills it gets the same fake success as flagged spam, and
    // the attempt is quarantined for review, never silently lost.
    if (str(body.website)) {
      console.log('[HONEYPOT]', { email, formType });
      await recordBlockedSubmission({
        source: 'honeypot',
        formType,
        email,
        name,
        payload: body,
        result: {
          isSpam: true,
          emailScore: 0,
          contentScore: 0,
          combinedScore: 100,
          reason: 'Honeypot field filled',
        },
      });
      return NextResponse.json({ success: true, data: { id: 'filtered' } });
    }

    // Spam detection runs on the raw values; escaping happens only at
    // HTML interpolation below.
    const contentForCheck = extractContentForSpamCheck(body);
    const spamResult = checkSpam({ email, content: contentForCheck, name });

    // Durable ledger row BEFORE any email is attempted: a lead must never
    // exist only inside an outbound email.
    const ledgerId = await recordSubmission({
      formType,
      email,
      name,
      payload: body,
    });

    // Escaped copies for HTML interpolation.
    const e = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      company: escapeHtml(company),
      designer: escapeHtml(designer),
      projectReference: escapeHtml(projectReference),
      queryType: escapeHtml(queryType),
      role: escapeHtml(role),
      projectType: escapeHtml(projectType),
      category: escapeHtml(category),
      deliverables: escapeHtml(deliverables),
      timeline: escapeHtml(timeline),
      phone: escapeHtml(phone),
      productName: escapeHtml(productName),
      quantity: escapeHtml(quantity),
      targetMarket: escapeHtml(targetMarket),
      budgetRange: escapeHtml(budgetRange),
    };
    const messageHtml = escapeHtml(message).replace(/\n/g, '<br>');
    const notesHtml = escapeHtml(notes).replace(/\n/g, '<br>');
    const additionalNotesHtml = escapeHtml(additionalNotes).replace(/\n/g, '<br>');

    // Build email content based on form type
    let emailSubject = subject || 'New Contact Form Submission - virtuality.fashion';
    let htmlContent = '';

    if (formType === 'contact') {
      emailSubject = designer
        ? `Quote Request for ${designer} - virtuality.fashion`
        : 'New Contact Form Submission - virtuality.fashion';

      htmlContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${e.name} (${e.email})</p>
        <p><strong>Company:</strong> ${e.company}</p>
        ${designer ? `<p><strong>Designer:</strong> ${e.designer}</p>` : ''}
        ${projectReference ? `<p><strong>Project Reference:</strong> ${e.projectReference}</p>` : ''}
        <h3>Message:</h3>
        <p>${messageHtml}</p>
      `;
    } else if (formType === 'general') {
      emailSubject = `New Contact Query: ${queryType} from ${name}`;

      htmlContent = `
        <h2>New Contact Query</h2>
        <p><strong>From:</strong> ${e.name} (${e.email})</p>
        <p><strong>Company:</strong> ${e.company}</p>
        <p><strong>Query Type:</strong> ${e.queryType}</p>
        <h3>Message:</h3>
        <p>${messageHtml}</p>
      `;
    } else if (formType === 'join-team') {
      emailSubject = `New Team Application - virtuality.fashion`;

      // Portfolio links: only well-formed http(s) URLs become anchors;
      // anything else renders as plain text so a crafted "link" can never
      // inject markup into the notification email.
      const portfolioLinks = notes ? notes.split('\n').filter((l) => l.trim()) : [];
      const portfolioHtml = portfolioLinks.length > 0
        ? `<p><strong>Portfolio:</strong></p><ul>${portfolioLinks
            .map((l) => {
              const link = l.trim();
              const safe = escapeHtml(link);
              return /^https?:\/\/[^\s]+$/i.test(link)
                ? `<li><a href="${safe}">${safe}</a></li>`
                : `<li>${safe}</li>`;
            })
            .join('')}</ul>`
        : '';

      htmlContent = `
        <h2>New Team Application</h2>
        <p><strong>From:</strong> ${e.name} (${e.email})</p>
        ${role ? `<p><strong>Role/Specialty:</strong> ${e.role}</p>` : ''}
        ${portfolioHtml}
        ${message ? `<h3>Message:</h3><p>${messageHtml}</p>` : ''}
      `;
    } else if (formType === 'enterprise') {
      emailSubject = 'Enterprise Quote Request - virtuality.fashion';

      htmlContent = `
        <h2>Enterprise Quote Request</h2>
        <p><strong>Company:</strong> ${e.company}</p>
        <p><strong>Contact:</strong> ${e.name} (${e.email})</p>
        ${role ? `<p><strong>Role:</strong> ${e.role}</p>` : ''}
        ${projectType ? `<p><strong>Project Type:</strong> ${e.projectType}</p>` : ''}
        ${category ? `<p><strong>Category:</strong> ${e.category}</p>` : ''}
        ${deliverables ? `<p><strong>Deliverables:</strong> ${e.deliverables}</p>` : ''}
        ${timeline ? `<p><strong>Timeline:</strong> ${e.timeline}</p>` : ''}
        ${notes ? `<h3>Additional Notes:</h3><p>${notesHtml}</p>` : ''}
      `;
    } else if (formType === 'inquiry') {
      emailSubject = productName
        ? `New Project Inquiry: ${productName} from ${company || name}`
        : 'New Project Inquiry - virtuality.fashion';

      htmlContent = `
        <h2>New Project Inquiry</h2>
        <p><strong>From:</strong> ${e.name} (${e.email})</p>
        ${phone ? `<p><strong>Phone:</strong> ${e.phone}</p>` : ''}
        <p><strong>Company:</strong> ${e.company}</p>
        ${productName ? `<p><strong>Product:</strong> ${e.productName}</p>` : ''}
        ${projectType ? `<p><strong>Product Type:</strong> ${e.projectType}</p>` : ''}
        ${quantity ? `<p><strong>Quantity:</strong> ${e.quantity}</p>` : ''}
        ${targetMarket ? `<p><strong>Target Market:</strong> ${e.targetMarket}</p>` : ''}
        ${budgetRange ? `<p><strong>Budget Range:</strong> ${e.budgetRange}</p>` : ''}
        ${timeline ? `<p><strong>Timeline:</strong> ${e.timeline}</p>` : ''}
        ${additionalNotes ? `<h3>Additional Details:</h3><p>${additionalNotesHtml}</p>` : ''}
      `;
    }

    if (spamResult.isSpam) {
      console.log('[SPAM BLOCKED]', {
        email,
        formType,
        scores: {
          email: spamResult.emailScore,
          content: spamResult.contentScore,
          combined: spamResult.combinedScore,
        },
        reason: spamResult.reason,
      });

      // Quarantine instead of silent drop: persist the full submission and
      // forward it with a warning banner so a false positive is always
      // recoverable. No designer BCC on flagged sends.
      const quarantined = await recordBlockedSubmission({
        source: 'send-email',
        formType,
        email,
        name,
        payload: body,
        result: spamResult,
      });

      let flaggedEmailSent = false;
      try {
        const { error } = await resend.emails.send({
          from: NOTIFY_FROM,
          to: NOTIFY_TO,
          replyTo: email,
          subject: `[Review: flagged submission] ${emailSubject}`,
          html: `
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px 16px; margin-bottom: 16px; font-size: 13px; color: #92400e;">
              The spam filter flagged this submission (score ${spamResult.combinedScore}/100, ${escapeHtml(spamResult.reason || 'no reason recorded')}).
              It was quarantined, not dropped: review it in case it is a real lead.
            </div>
            ${htmlContent}
          `,
        });
        flaggedEmailSent = !error;
        if (error) console.error('[SPAM BLOCKED] quarantine email failed', error);
      } catch (err) {
        console.error('[SPAM BLOCKED] quarantine email failed', err);
      }

      // Double-failure safety net: if the submission is neither in the
      // quarantine table nor in the inbox, deliver it through the normal
      // path (without BCC) rather than losing a possible lead to a fake
      // success. This was exactly the pre-June-12 failure mode.
      if (!quarantined && !flaggedEmailSent) {
        try {
          const { data } = await resend.emails.send({
            from: NOTIFY_FROM,
            to: NOTIFY_TO,
            replyTo: email,
            subject: emailSubject,
            html: htmlContent,
          });
          await markSubmission(ledgerId, 'flagged', `quarantine double-failure; fallback send ${data?.id ?? 'failed'}`);
        } catch (err) {
          console.error('[SPAM BLOCKED] fallback send failed', err);
          await markSubmission(ledgerId, 'flagged', 'quarantine double-failure; fallback send failed');
        }
      } else {
        await markSubmission(
          ledgerId,
          'flagged',
          `score ${spamResult.combinedScore}/100; ${spamResult.reason ?? ''}; quarantined=${quarantined}; flaggedEmail=${flaggedEmailSent}`
        );
      }

      // Fake success — a real spammer must not learn they were filtered.
      return NextResponse.json({ success: true, data: { id: 'filtered' } });
    }

    // BCC the designer on quote requests, resolved server-side by name.
    const bccEmail = formType === 'contact' ? await resolveDesignerEmail(designer) : null;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: NOTIFY_FROM,
      to: NOTIFY_TO,
      ...(bccEmail ? { bcc: [bccEmail] } : {}),
      replyTo: email, // Reply goes to the person who submitted the form
      subject: emailSubject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      await markSubmission(ledgerId, 'send_failed', error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    await markSubmission(ledgerId, 'sent', data?.id ?? null);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
