import type { Metadata } from 'next';

const BASE = 'https://govt-jobs-preparation-portal.vercel.app';
const OG   = `${BASE}/og-quizzes.png`;

// Mirror of SUBJECT_META in page.tsx
const SUBJECT_INFO: Record<string, {
  name: string;
  nameUr: string;
  emoji: string;
  description: string;
  keywords: string[];
}> = {
  'general-science': {
    name: 'General Science & Ability',
    nameUr: 'جنرل سائنس اور صلاحیت',
    emoji: '⚗️',
    description:
      'Practice General Science & Ability MCQs for FPSC, PPSC, SPSC, NTS & CSS. Topics: Everyday Science, Analytical Reasoning, Logical Ability, Astronomy & Environmental Science.',
    keywords: ['General Science MCQs', 'FPSC Science MCQs', 'NTS Science', 'Everyday Science Pakistan'],
  },
  'pak-studies': {
    name: 'Pakistan Studies',
    nameUr: 'پاکستان سٹڈیز',
    emoji: '🇵🇰',
    description:
      'Practice Pakistan Studies MCQs for FPSC, PPSC, SPSC & NTS. Topics: Pre-Partition History, 1947 Movement, Constitution, Geography & Pakistan Current Affairs.',
    keywords: ['Pakistan Studies MCQs', 'FPSC Pakistan Studies', 'PPSC Pak Studies', 'Pakistan History MCQs'],
  },
  'islamic-studies': {
    name: 'Islamic Studies',
    nameUr: 'اسلامیات',
    emoji: '☪️',
    description:
      'Practice Islamic Studies MCQs for FPSC, PPSC, SPSC & NTS. Topics: Quranic Verses, Sunnah, Seerah, Islamic Battles (Ghazwaat) & Fundamental Pillars.',
    keywords: ['Islamic Studies MCQs', 'FPSC Islamiyat MCQs', 'Islamiyat Practice Test', 'NTS Islamic Studies'],
  },
  'physics': {
    name: 'Physics',
    nameUr: 'فزکس',
    emoji: '⚡',
    description:
      'Practice Physics MCQs for FPSC, PPSC, NTS & CSS. Topics: Mechanics, Electricity, Magnetism, Optics, Quantum & Applied Physics.',
    keywords: ['Physics MCQs Pakistan', 'FPSC Physics', 'NTS Physics MCQs', 'CSS Physics Practice'],
  },
  'chemistry': {
    name: 'Chemistry',
    nameUr: 'کیمسٹری',
    emoji: '🧪',
    description:
      'Practice Chemistry MCQs for FPSC, PPSC & NTS. Topics: Organic Chemistry, Inorganic Compounds, Periodic Table & Chemical Reactions.',
    keywords: ['Chemistry MCQs Pakistan', 'FPSC Chemistry', 'NTS Chemistry MCQs', 'PPSC Chemistry Practice'],
  },
  'biology': {
    name: 'Biology',
    nameUr: 'حیاتیات',
    emoji: '🧬',
    description:
      'Practice Biology MCQs for FPSC, PPSC, NTS & CSS. Topics: Human Physiology, Cell Biology, Genetics, Zoology, Botany & Microbiology.',
    keywords: ['Biology MCQs Pakistan', 'FPSC Biology', 'NTS Biology MCQs', 'PPSC Biology Practice'],
  },
  'computer-science': {
    name: 'Computer Science',
    nameUr: 'کمپیوٹر سائنس',
    emoji: '💻',
    description:
      'Practice Computer Science MCQs for FPSC, PPSC & NTS. Topics: MS Office, Computer Networks, Cybersecurity, Database Management & Software Fundamentals.',
    keywords: ['Computer Science MCQs Pakistan', 'FPSC IT MCQs', 'NTS Computer MCQs', 'PPSC Computer Science'],
  },
  'mathematics': {
    name: 'Mathematics',
    nameUr: 'ریاضی',
    emoji: '📐',
    description:
      'Practice Mathematics MCQs for FPSC, PPSC, NTS & CSS. Topics: Algebra, Arithmetic, Geometry, Ratios, Percentages & Problem Solving.',
    keywords: ['Mathematics MCQs Pakistan', 'FPSC Maths MCQs', 'NTS Math MCQs', 'PPSC Mathematics Practice'],
  },
};

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const info = SUBJECT_INFO[params.id];

  if (!info) {
    return {
      title: 'MCQ Practice — GovtJobs.pk',
      description: 'Free MCQ practice tests for Pakistan government job exams.',
    };
  }

  const url = `${BASE}/quizzes/subject/${params.id}`;
  const title = `${info.emoji} ${info.name} MCQs — FPSC / PPSC / NTS Practice | GovtJobs.pk`;
  const ogTitle = `${info.emoji} ${info.name} MCQs — Free Pakistan Govt Exam Practice`;
  const ogDesc = `🎯 ${info.description}\n\n✅ 20 Questions per page\n✅ Instant score & answer key\n✅ Locked answers — no cheating!\n\nPractice free at GovtJobs.pk`;

  return {
    title,
    description: info.description,
    keywords: [
      ...info.keywords,
      'Pakistan Government Jobs MCQs',
      'Free Exam Practice',
      'GovtJobs.pk',
      info.nameUr,
    ],
    openGraph: {
      type: 'website',
      url,
      siteName: 'GovtJobs.pk — Govt Exam Preparation Portal',
      title: ogTitle,
      description: ogDesc,
      images: [{ url: OG, width: 1200, height: 630, alt: `${info.name} MCQs Practice — Pakistan Govt Exams` }],
      locale: 'en_PK',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: `✅ ${info.name} MCQs — 20 per page, instant grading. Free practice for FPSC, PPSC, NTS, CSS!`,
      images: [OG],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: url },
  };
}

export default function SubjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
