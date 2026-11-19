import type { Metadata } from 'next';

const BASE = 'https://govt-jobs-preparation-portal.vercel.app';
const OG = `${BASE}/og-quizzes.png`;

export const metadata: Metadata = {
  title: 'Pakistan Studies MCQs — 3,305 Verified Practice Questions | GovtJobs.pk',
  description:
    'Practice 3,305 verified Pakistan Studies MCQs for FPSC, PPSC, SPSC, KPPSC, NTS, and CSS exams. Covers Pakistan Movement, 1973 Constitution, Geography & Rivers, Provinces & Heritage, Defense, Economy, Foreign Relations, and Sindhi Bilingual sections.',
  keywords: [
    'Pakistan Studies MCQs',
    'FPSC Pakistan Studies',
    'PPSC Pak Studies MCQs',
    'NTS Pakistan Studies Test',
    'CSS Pak Affairs MCQs',
    'Pakistan Movement MCQs',
    '1973 Constitution Pakistan MCQs',
    'SPSC Pakistan Studies',
    'Pak Studies Online Quiz',
  ],
  openGraph: {
    type: 'website',
    url: `${BASE}/quizzes/pak-studies`,
    siteName: 'GovtJobs.pk — Govt Exam Preparation Portal',
    title: 'Pakistan Studies MCQs — 3,305 Verified Questions for FPSC, PPSC, NTS & CSS',
    description:
      'Practice 3,305 solved Pakistan Studies MCQs organized by topic — Pakistan Movement, Constitution & Government, Geography & Natural Resources, Defense, Economy, Foreign Relations, and Sindhi Bilingual sections.',
    images: [{ url: OG, width: 1200, height: 630, alt: 'Pakistan Studies MCQs Practice — FPSC PPSC NTS CSS' }],
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary_large_image',
    title: '3,305 Pakistan Studies MCQs — FPSC, PPSC, SPSC & NTS Prep',
    description:
      'Topic-filtered Pakistan Studies MCQ bank covering History, Constitution, Geography, Economy, Defense & Sindhi Bilingual questions.',
    images: [OG],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/quizzes/pak-studies` },
};

export default function PakStudiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
