import { NextRequest, NextResponse } from 'next/server';
import { checkSpam, extractContentForSpamCheck } from '@/lib/spam-detection';

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
    }

    // Only return isSpam boolean -- never expose scores to the client
    return NextResponse.json({ isSpam: spamResult.isSpam });
  } catch (error) {
    console.error('Spam check error:', error);
    // On error, default to "not spam" so legitimate users aren't blocked
    return NextResponse.json({ isSpam: false });
  }
}
