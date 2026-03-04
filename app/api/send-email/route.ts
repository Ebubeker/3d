import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { checkSpam, extractContentForSpamCheck } from '@/lib/spam-detection';

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
  formType: 'contact' | 'general' | 'enterprise';
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

    // Spam detection: check before sending
    const contentForCheck = extractContentForSpamCheck(body as unknown as Record<string, unknown>);
    const spamResult = checkSpam({ email, content: contentForCheck, name });

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
      // Return fake success — spammer sees "success" but no email is sent
      return NextResponse.json({ success: true, data: { id: 'filtered' } });
    }

    // Build email content based on form type
    let emailSubject = subject || 'New Contact Form Submission - Virtuality Fashion';
    let htmlContent = '';

    if (formType === 'contact') {
      emailSubject = designer
        ? `Quote Request for ${designer} - Virtuality Fashion`
        : 'New Contact Form Submission - Virtuality Fashion';

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
    } else if (formType === 'enterprise') {
      emailSubject = 'Enterprise Quote Request - Virtuality Fashion';

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

    // Send to info@ and BCC the freelancer/designer if available
    const bccEmails: string[] = [];
    if (designerEmail && designerEmail !== 'No email on file') {
      bccEmails.push(designerEmail);
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Virtuality Fashion <amnon@virtuality.fashion>',
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
