import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { checkSpam, extractContentForSpamCheck } from '@/lib/spam-detection';
import { recordBlockedSubmission } from '@/lib/spam-quarantine';

const resend = new Resend(process.env.RESEND_API_KEY);

// Your email to receive all form submissions and CC
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@virtuality.fashion';

interface EmailRequest {
  // Common fields
  name: string;
  email: string;
  company: string;
  message?: string;
  subject?: string;

  // Contact page specific
  designer?: string;
  designerEmail?: string;
  projectReference?: string;

  // ContactSection specific
  queryType?: string;

  // EnterpriseForm specific
  role?: string;
  projectType?: string;
  category?: string;
  deliverables?: string;
  timeline?: string;
  notes?: string;

  // Form type identifier
  formType: 'contact' | 'general' | 'enterprise' | 'join-team';
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json();

    const {
      name,
      email,
      company,
      message,
      subject,
      designer,
      designerEmail,
      projectReference,
      queryType,
      role,
      projectType,
      category,
      deliverables,
      timeline,
      notes,
      formType,
    } = body;

    // Spam detection: scored up front, applied after the email content is
    // built so flagged submissions can be quarantined instead of dropped.
    const contentForCheck = extractContentForSpamCheck(body as unknown as Record<string, unknown>);
    const spamResult = checkSpam({ email, content: contentForCheck, name });

    // Build email content based on form type
    let emailSubject = subject || 'New Contact Form Submission - virtuality.fashion';
    let htmlContent = '';

    if (formType === 'contact') {
      emailSubject = designer
        ? `Quote Request for ${designer} - virtuality.fashion`
        : 'New Contact Form Submission - virtuality.fashion';

      htmlContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Company:</strong> ${company}</p>
        ${designer ? `<p><strong>Designer:</strong> ${designer}</p>` : ''}
        ${projectReference ? `<p><strong>Project Reference:</strong> ${projectReference}</p>` : ''}
        <h3>Message:</h3>
        <p>${message?.replace(/\n/g, '<br>')}</p>
      `;
    } else if (formType === 'general') {
      emailSubject = `New Contact Query: ${queryType} from ${name}`;

      htmlContent = `
        <h2>New Contact Query</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Query Type:</strong> ${queryType}</p>
        <h3>Message:</h3>
        <p>${message?.replace(/\n/g, '<br>')}</p>
      `;
    } else if (formType === 'join-team') {
      emailSubject = `New Team Application - virtuality.fashion`;

      const portfolioLinks = notes ? notes.split('\n').filter((l: string) => l.trim()) : [];
      const portfolioHtml = portfolioLinks.length > 0
        ? `<p><strong>Portfolio:</strong></p><ul>${portfolioLinks.map((l: string) => `<li><a href="${l}">${l}</a></li>`).join('')}</ul>`
        : '';

      htmlContent = `
        <h2>New Team Application</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        ${role ? `<p><strong>Role/Specialty:</strong> ${role}</p>` : ''}
        ${portfolioHtml}
        ${message ? `<h3>Message:</h3><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
      `;
    } else if (formType === 'enterprise') {
      emailSubject = 'Enterprise Quote Request - virtuality.fashion';

      htmlContent = `
        <h2>Enterprise Quote Request</h2>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Contact:</strong> ${name} (${email})</p>
        ${role ? `<p><strong>Role:</strong> ${role}</p>` : ''}
        ${projectType ? `<p><strong>Project Type:</strong> ${projectType}</p>` : ''}
        ${category ? `<p><strong>Category:</strong> ${category}</p>` : ''}
        ${deliverables ? `<p><strong>Deliverables:</strong> ${deliverables}</p>` : ''}
        ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
        ${notes ? `<h3>Additional Notes:</h3><p>${notes.replace(/\n/g, '<br>')}</p>` : ''}
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
      await recordBlockedSubmission({
        source: 'send-email',
        formType,
        email,
        name,
        payload: body as unknown as Record<string, unknown>,
        result: spamResult,
      });

      try {
        await resend.emails.send({
          from: 'virtuality.fashion <amnon@virtuality.fashion>',
          to: 'info@virtuality.fashion',
          replyTo: email,
          subject: `[Suspected spam] ${emailSubject}`,
          html: `
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px 16px; margin-bottom: 16px; font-size: 13px; color: #92400e;">
              The spam filter flagged this submission (score ${spamResult.combinedScore}/100 — ${spamResult.reason}).
              It was quarantined, not dropped: review it in case it is a real lead.
            </div>
            ${htmlContent}
          `,
        });
      } catch (err) {
        console.error('[SPAM BLOCKED] quarantine email failed', err);
      }

      // Fake success — a real spammer must not learn they were filtered.
      return NextResponse.json({ success: true, data: { id: 'filtered' } });
    }

    // Send to info@ and BCC the freelancer/designer if available
    const bccEmails: string[] = [];
    if (designerEmail && designerEmail !== 'No email on file') {
      bccEmails.push(designerEmail);
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'virtuality.fashion <amnon@virtuality.fashion>',
      to: 'info@virtuality.fashion',
      ...(bccEmails.length > 0 && { bcc: bccEmails }),
      replyTo: email, // Reply goes to the person who submitted the form
      subject: emailSubject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
