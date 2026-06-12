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
];

for (const c of cases) {
  const content = extractContentForSpamCheck(c.body);
  const name =
    [c.body.firstName, c.body.lastName].filter(Boolean).join(' ') ||
    (c.body.name as string) || undefined;
  const r = checkSpam({ email: c.body.email as string, content, name });
  const verdict = r.isSpam ? 'BLOCKED ❌' : 'passes  ✓';
  console.log(`${verdict}  [e:${r.emailScore} c:${r.contentScore} → ${r.combinedScore}] ${c.label}`);
  if (r.isSpam) console.log(`           reason: ${r.reason}`);
}
