// Spam detection utility for form submissions
// Uses a scoring system combining email address and content signals.
// Gibberish content (detected via Markov chain analysis) is flagged as spam
// even with a clean email. For other signals, both email and content
// must be suspicious.

// eslint-disable-next-line @typescript-eslint/no-require-imports
const gibberishDetective = require('gibberish-detective');
const gibberish = gibberishDetective();

export interface SpamCheckInput {
  email: string;
  content: string;
  name?: string;
}

export interface SpamCheckResult {
  isSpam: boolean;
  emailScore: number;
  contentScore: number;
  combinedScore: number;
  reason?: string;
}

// ~80 known disposable/temporary email providers
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'dispostable.com', 'trashmail.com', 'mailnesia.com', 'maildrop.cc',
  'temp-mail.org', 'fakeinbox.com', 'getnada.com', 'tempail.com',
  'mohmal.com', 'emailondeck.com', 'tempr.email', 'discard.email',
  'tmpmail.net', 'tmpmail.org', 'binkmail.com', 'safetymail.info',
  'filzmail.com', 'mailcatch.com', 'tempomail.fr', 'harakirimail.com',
  'spamgourmet.com', 'mytemp.email', 'burnermail.io', 'inboxbear.com',
  'mailsac.com', 'mailslurp.com', 'receiveee.com', 'tempinbox.com',
  'mintemail.com', 'jetable.org', 'trashmail.net', 'trashmail.me',
  'mailexpire.com', 'mailforspam.com', 'tempmailaddress.com',
  'emailfake.com', 'crazymailing.com', 'armyspy.com', 'dayrep.com',
  'einrot.com', 'fleckens.hu', 'jourrapide.com', 'rhyta.com',
  'superrito.com', 'teleworm.us', 'gustr.com', 'owlpic.com',
  'mailnator.com', 'fakemailgenerator.com', '10minutemail.com',
  'guerrillamail.info', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.de', 'spam4.me', 'trash-mail.com', 'byom.de',
  'tmail.ws', 'dropmail.me', 'nada.email', 'anonbox.net',
  'spambox.us', 'mytrashmail.com', 'mailzilla.com', 'mailhub.pw',
  'tempmailer.com', 'tempmailbox.net', 'mailimate.com',
  'notsharingmy.info', 'guerrillamail.biz',
]);

const SUSPICIOUS_TLDS = new Set([
  '.xyz', '.top', '.click', '.loan', '.win', '.gq', '.cf',
  '.tk', '.ml', '.ga', '.buzz', '.rest', '.icu', '.cam',
  '.monster', '.quest', '.sbs', '.hair', '.cfd',
]);

const SPAM_KEYWORDS = [
  'viagra', 'casino', 'crypto', 'bitcoin', 'lottery', 'prize',
  'winner', 'free money', 'click here', 'act now', 'limited time',
  'buy now', 'make money', 'work from home', 'earn extra',
  'nigerian', 'prince', 'inheritance', 'million dollars',
  'wire transfer', 'western union', 'enlargement', 'weight loss',
  'miracle cure', 'congratulations you', 'you have been selected',
  'dear friend', 'seo services', 'backlink', 'cheap pills',
  'online pharmacy', 'hot singles', 'dating site',
];

function scoreEmail(email: string): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  const atIndex = email.indexOf('@');
  if (atIndex === -1) return { score: 100, reasons: ['Invalid email format'] };

  const localPart = email.substring(0, atIndex);
  const domain = email.substring(atIndex + 1);

  // Check disposable domain
  if (DISPOSABLE_DOMAINS.has(domain)) {
    score += 40;
    reasons.push('Disposable email domain');
  }

  // Check suspicious TLD
  const tldMatch = domain.match(/\.[^.]+$/);
  if (tldMatch && SUSPICIOUS_TLDS.has(tldMatch[0])) {
    score += 15;
    reasons.push('Suspicious TLD');
  }

  // Gibberish local part: 5+ consecutive consonants
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(localPart)) {
    score += 25;
    reasons.push('Consonant cluster in email username');
  }

  // Random alphanumeric string 15+ chars with very low vowel ratio
  if (/^[a-z0-9]{15,}$/i.test(localPart)) {
    const vowels = (localPart.match(/[aeiou]/gi) || []).length;
    const vowelRatio = vowels / localPart.length;
    if (vowelRatio < 0.2) {
      score += 25;
      reasons.push('Random-looking email username');
    }
  }

  // Numeric-heavy local part (>60% digits)
  const digitCount = (localPart.match(/\d/g) || []).length;
  if (localPart.length > 0 && digitCount / localPart.length > 0.6) {
    score += 15;
    reasons.push('Mostly numeric email username');
  }

  // Excessive digits in a row
  if (/\d{6,}/.test(localPart)) {
    score += 10;
    reasons.push('Long digit sequence in email');
  }

  // No separators in long local part
  if (localPart.length > 12 && !/[.\-_]/.test(localPart)) {
    score += 10;
    reasons.push('No separators in long email username');
  }

  return { score: Math.min(100, score), reasons };
}

function scoreContent(content: string, name?: string): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const trimmed = content.trim();
  const lower = trimmed.toLowerCase();

  // Very short content
  if (trimmed.length > 0 && trimmed.length < 10) {
    score += 10;
    reasons.push('Very short content');
  }

  // Spam keywords. 5+ distinct keywords is never legitimate — escalate to
  // an instant-block score; the old +25 cap let classic keyword-stuffed
  // pitches through.
  let keywordHits = 0;
  for (const keyword of SPAM_KEYWORDS) {
    if (lower.includes(keyword)) {
      keywordHits++;
    }
  }
  if (keywordHits >= 5) {
    score += 50;
    reasons.push(`Spam keywords detected (${keywordHits})`);
  } else if (keywordHits > 0) {
    score += Math.min(25, keywordHits * 5);
    reasons.push(`Spam keywords detected (${keywordHits})`);
  }

  // Excessive URLs
  const urlCount = (trimmed.match(/https?:\/\/|www\./gi) || []).length;
  if (urlCount >= 3) {
    score += 20;
    reasons.push('Excessive URLs in content');
  } else if (urlCount === 2) {
    score += 10;
    reasons.push('Multiple URLs in content');
  }

  // ALL CAPS check (only for content with 20+ alpha chars)
  const alphaChars = trimmed.replace(/[^a-zA-Z]/g, '');
  if (alphaChars.length >= 20) {
    const upperCount = (alphaChars.match(/[A-Z]/g) || []).length;
    if (upperCount / alphaChars.length > 0.4) {
      score += 15;
      reasons.push('Excessive uppercase text');
    }
  }

  // URLs are legitimate in this domain (portfolio links, product
  // references) but look like gibberish to the English Markov model —
  // a links-heavy application with a short message used to score 90+
  // and get silently blocked. Strip URLs from the text before any
  // gibberish/word analysis; their volume is already scored above.
  const textOnly = trimmed
    .replace(/(https?:\/\/|www\.)\S+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Gibberish detection using Markov chain analysis (gibberish-detective)
  const words = textOnly.split(/\s+/).filter(w => w.length > 0);
  if (textOnly.length >= 6) {
    try {
      // Check the full content string
      if (gibberish.detect(textOnly)) {
        score += 50;
        reasons.push('Gibberish content detected (Markov chain)');
      }

      // Check individual words >= 6 chars (the library is unreliable on shorter strings)
      // If majority of testable words are gibberish, flag it. Require at
      // least 4 testable words — a majority over 1-3 words is noise, and
      // short legitimate messages were getting blocked on it.
      const testableWords = words.filter(w => w.length >= 6);
      if (testableWords.length >= 4) {
        const gibberishWords = testableWords.filter(w => gibberish.detect(w));
        const gibberishRatio = gibberishWords.length / testableWords.length;
        if (gibberishRatio > 0.5) {
          score += 50;
          reasons.push(`Gibberish words detected (${gibberishWords.length}/${testableWords.length})`);
        }
      }
    } catch {
      // Fallback: if the library fails, use heuristic checks below
    }
  }

  // Heuristic gibberish fallbacks
  if (words.length > 0) {
    // Check for words with no vowels (length > 3)
    const noVowelWords = words.filter(w => w.length > 3 && !/[aeiou]/i.test(w));
    if (words.length >= 3 && noVowelWords.length / words.length > 0.5) {
      score += 30;
      reasons.push('No-vowel words detected');
    }

    // Average word length > 12 (gibberish strings tend to be long)
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    if (avgWordLength > 12 && words.length >= 2) {
      score += 20;
      reasons.push('Unusually long words');
    }
  }

  // 8+ consecutive consonants in content (URL-stripped — paths and
  // domain names routinely contain long consonant runs)
  if (/[bcdfghjklmnpqrstvwxyz]{8,}/i.test(textOnly)) {
    score += 20;
    reasons.push('Consonant cluster in content');
  }

  // Repetitive characters (4+ same char)
  if (/(.)\1{3,}/.test(trimmed)) {
    score += 15;
    reasons.push('Repetitive characters');
  }

  // HTML/script injection
  if (/<script|<iframe|<img\s+src=|javascript:|onclick=|onerror=/i.test(trimmed)) {
    score += 20;
    reasons.push('HTML/script injection attempt');
  }

  // Emoji spam (more than 5 emoji)
  const emojiCount = (trimmed.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length;
  if (emojiCount > 5) {
    score += 10;
    reasons.push('Excessive emoji usage');
  }

  // Name gibberish check
  if (name) {
    const cleanName = name.trim();
    if (cleanName.length > 3 && !/[aeiou]/i.test(cleanName)) {
      score += 10;
      reasons.push('Gibberish name');
    }
    // All same character
    if (cleanName.length > 2 && /^(.)\1+$/i.test(cleanName)) {
      score += 10;
      reasons.push('Repetitive name');
    }
  }

  return { score: Math.min(100, score), reasons };
}

function calculateCombinedScore(emailScore: number, contentScore: number): number {
  // If content is clearly gibberish (score >= 50), flag as spam regardless of email
  // This catches nonsensical messages even from legitimate-looking email addresses
  if (contentScore >= 50) {
    return contentScore;
  }

  // Email alone should NEVER flag as spam — require both signals for moderate scores
  const e = emailScore / 100;
  const c = contentScore / 100;

  // Geometric mean: gives 0 if either is 0, high only if both are high
  const geometricMean = Math.sqrt(e * c);

  // Weighted average as a secondary signal (content weighted slightly more)
  const weightedAvg = e * 0.4 + c * 0.6;

  // 70% geometric mean + 30% weighted average
  const combined = (geometricMean * 0.7 + weightedAvg * 0.3) * 100;

  return Math.min(100, Math.round(combined));
}

export function checkSpam(input: SpamCheckInput): SpamCheckResult {
  const { email, content, name } = input;

  const emailResult = scoreEmail(email.toLowerCase().trim());
  const contentResult = scoreContent(content, name);

  const emailScore = emailResult.score;
  const contentScore = contentResult.score;
  const combinedScore = calculateCombinedScore(emailScore, contentScore);

  const isSpam = combinedScore >= 50;
  const allReasons = [...emailResult.reasons, ...contentResult.reasons];

  return {
    isSpam,
    emailScore,
    contentScore,
    combinedScore,
    reason: isSpam ? allReasons.join('; ') : undefined,
  };
}

export function extractContentForSpamCheck(body: Record<string, unknown>): string {
  // Name fields are deliberately excluded: non-English names read as
  // gibberish to the English Markov model and were tipping legitimate
  // submissions over the block threshold. Names are checked separately
  // via checkSpam's dedicated `name` parameter.
  const contentFields = [
    'message', 'notes', 'additionalNotes', 'subject',
    'company', 'productName', 'targetMarket',
  ];

  const parts: string[] = [];
  for (const field of contentFields) {
    if (typeof body[field] === 'string' && body[field]) {
      parts.push(body[field] as string);
    }
  }

  return parts.join(' ');
}
