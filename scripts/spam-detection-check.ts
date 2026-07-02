// Regression check for the spam scorer: run with `npx tsx scripts/spam-detection-check.ts`.
// Feeds realistic submissions through the production
// spam scorer exactly the way /api/send-email composes them.
import { checkSpam, extractContentForSpamCheck } from '../lib/spam-detection';

const cases: { label: string; body: Record<string, unknown> }[] = [
  {
    label: 'LEGIT contact — English brand lead',
    body: {
      formType: 'contact', name: 'Sarah Mitchell', email: 'sarah@brandstudio.com',
      company: 'Brand Studio London',
      message: 'Hello, we are interested in virtual sampling for our upcoming collection. Could you send pricing for around 15 styles?',
    },
  },
  {
    label: 'LEGIT contact — Turkish brand lead',
    body: {
      formType: 'contact', name: 'Ayşe Yılmaz', email: 'ayse.yilmaz@trendyol.com',
      company: 'Trendyol',
      message: 'Merhaba, CLO3D ile sanal numune hizmeti istiyoruz. Fiyat alabilir miyiz?',
    },
  },
  {
    label: 'LEGIT join-team — designer, 3 portfolio links',
    body: {
      formType: 'join-team', name: 'Nguyễn Thanh Hà', email: 'thanhha.design@gmail.com',
      company: '', role: '3D Designer',
      notes: 'https://www.behance.net/thanhha\nhttps://www.instagram.com/thanhha.3d\nhttps://www.linkedin.com/in/thanhha',
      message: '8 years CLO3D and Browzwear experience, worked with Uniqlo suppliers.',
    },
  },
  {
    label: 'LEGIT join-team — minimal, links only (was BLOCKED)',
    body: {
      formType: 'join-team', name: 'Krzysztof Szczepański', email: 'krzysztof.szczepanski@gmail.com',
      company: '', role: 'Technical Designer',
      notes: 'https://www.behance.net/krzysztofsz\nhttps://instagram.com/krzysztof.design',
      message: 'Portfolio attached.',
    },
  },
  {
    label: 'LEGIT inquiry — proper-noun-heavy fields',
    body: {
      email: 'l.mueller@muellermode.de', firstName: 'Lukas', lastName: 'Müller',
      company: 'Müller Mode GmbH', productName: 'SS27 Denim Capsule',
      targetMarket: 'DACH + EU', additionalNotes: '',
    },
  },
  {
    label: 'LEGIT contact — Hebrew message',
    body: {
      formType: 'general', name: 'Avi Cohen', email: 'avi@fashion-il.co.il',
      company: 'TLV Apparel',
      message: 'שלום, אנחנו מותג אופנה מתל אביב ומחפשים שירותי דגימה וירטואלית לקולקציה הקרובה',
    },
  },
  {
    label: 'LEGIT contact — mentions working from home',
    body: {
      formType: 'join-team', name: 'Maria Santos', email: 'maria.santos1990@gmail.com',
      company: '', role: 'Patternmaker',
      notes: 'https://www.behance.net/mariasantos',
      message: 'I am a freelance patternmaker, I work from home and have my own CLO3D license.',
    },
  },
  {
    label: 'LEGIT contact - enthusiastic caps + !!!! + 3 brand links',
    body: {
      formType: 'contact', name: 'Jordan Reyes', email: 'jordan@kayaswimwear.com',
      company: 'Kaya Swimwear',
      // Stacks three soft signals (3+ URLs, caps, repetition) to 50; must
      // fall through to the combined score, not the content-only flag
      message: 'WE LOVE YOUR 3D RENDERS AND WANT TO START RIGHT AWAY FOR OUR RESORT DROP!!!! Links: www.kayaswimwear.com www.instagram.com/kayaswim www.behance.net/kayaswim',
    },
  },
  {
    label: 'LEGIT contact - pasted with extra whitespace runs',
    body: {
      formType: 'contact', name: 'Emma Larsen', email: 'emma@nordicknit.dk',
      company: 'Nordic Knitwear',
      // Runs of 4+ spaces and blank lines must not count as repetition
      message: 'Hi,     we are a knitwear label from Copenhagen.\n\n\n\nWe need 3D samples for 8 styles.    Can you share your process and pricing?',
    },
  },
  {
    label: 'LEGIT contact - Hebrew message, script guard (no no-vowel penalty)',
    body: {
      formType: 'general', name: 'Noa Barak', email: 'noa@studio-noa.co.il',
      company: 'Studio Noa',
      message: 'היי, ראינו את העבודות שלכם ואנחנו מעוניינים בהדמיות תלת ממד לקולקציית הקיץ שלנו. אשמח לקבל הצעת מחיר ולוחות זמנים',
    },
  },
  {
    label: 'LEGIT contact - Russian message, script guard',
    body: {
      formType: 'contact', name: 'Olga Petrova', email: 'olga.petrova@lamoda-brands.ru',
      company: 'Lamoda Brands',
      message: 'Здравствуйте! Мы бренд женской одежды из Москвы. Ищем студию для 3D визуализации новой коллекции, около 20 моделей. Пришлите, пожалуйста, цены и сроки.',
    },
  },
  {
    label: 'SPAM control — classic pitch (was PASSING)',
    body: {
      formType: 'contact', name: 'John Winner', email: 'xkjq83hd2k9s@offers.xyz',
      company: 'SEO Services Pro',
      message: 'Congratulations you have been selected! Buy now cheap pills online pharmacy casino crypto bitcoin click here act now',
    },
  },
  {
    label: 'SPAM control — gibberish',
    body: {
      formType: 'contact', name: 'asdkjfh', email: 'qwlkrjzxv@gmail.com',
      company: 'zxcvmnb qwerlkj',
      message: 'asdkjfh qwelkrj zxcvmnb pqowieur mznxbcv alskdjfh',
    },
  },
  {
    label: 'SPAM control — gibberish padded with URLs',
    body: {
      formType: 'contact', name: 'qwjzkx', email: 'zzkqjw9183@mailinator.com',
      company: '',
      message: 'jqkwzx vbnqpl https://spam-site.xyz zxqjwk mnbvqp wkjqzx',
    },
  },
  {
    label: 'SPAM control - Cyrillic casino pitch, EN keyword stuffing',
    body: {
      formType: 'contact', name: 'Dmitry', email: 'promo9182736450@bk.ru',
      company: 'Mega Bonus',
      // Non-Latin content skips the English heuristics, but the keyword
      // rule (5+ hits) must still block regardless of script
      message: 'Лучшие бонусы для вас! casino viagra crypto bitcoin lottery - огромный prize ждет! click here: http://mega-bonus-kazino.icu',
    },
  },
];

// Expected verdict is encoded in the label prefix: LEGIT must pass,
// SPAM must be blocked. Any mismatch fails the run.
let failures = 0;
for (const c of cases) {
  const content = extractContentForSpamCheck(c.body);
  const name =
    [c.body.firstName, c.body.lastName].filter(Boolean).join(' ') ||
    (c.body.name as string) || undefined;
  const r = checkSpam({ email: c.body.email as string, content, name });
  const expectSpam = c.label.startsWith('SPAM');
  const wrong = r.isSpam !== expectSpam;
  if (wrong) failures++;
  const verdict = r.isSpam ? 'BLOCKED ❌' : 'passes  ✓';
  console.log(`${wrong ? 'WRONG VERDICT → ' : ''}${verdict}  [e:${r.emailScore} c:${r.contentScore} → ${r.combinedScore}] ${c.label}`);
  if (r.isSpam) console.log(`           reason: ${r.reason}`);
}

if (failures > 0) {
  console.log(`\n${failures} case(s) produced the wrong verdict`);
  process.exit(1);
}
console.log(`\nAll ${cases.length} cases produced the expected verdict`);
