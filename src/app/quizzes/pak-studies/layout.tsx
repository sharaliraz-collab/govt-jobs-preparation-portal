import type { Metadata } from 'next';

const BASE = 'https://govt-jobs-preparation-portal.vercel.app';
const OG   = `${BASE}/og-quizzes.png`;

export const metadata: Metadata = {
  title: '🇵🇰 Pakistan Studies MCQs — 364 Practice Questions | GovtJobs.pk',
  description:
    '✅ Practice 364 Pakistan Studies MCQs for FPSC, PPSC, SPSC, NTS & CSS exams. Covers Indus Valley Civilization, 1973 Constitution, Government Branches, Media, South Asia Geography, Economics & Islamic History. 15 Sections · 20 per page · Free!',
  keywords: [
    'Pakistan Studies MCQs',
    'FPSC Pakistan Studies',
    'PPSC Pak Studies MCQs',
    'NTS Pakistan Studies Test',
    'CSS Pak Affairs MCQs',
    'Indus Valley Civilization MCQs',
    '1973 Constitution Pakistan MCQs',
    'SPSC Pakistan Studies',
    'Pak Studies Online Quiz',
  ],
  openGraph: {
    type: 'website',
    url: `${BASE}/quizzes/pak-studies`,
    siteName: 'GovtJobs.pk — Govt Exam Preparation Portal',
    title: '🇵🇰 Pakistan Studies MCQs — 364 Questions for FPSC / PPSC / NTS / CSS',
    description:
      '🎯 364 Pakistan Studies MCQs — Free Online Practice!\n\n🏛️ Indus Valley Civilization & Pre-Partition\n📜 1973 Constitution & State Organs\n🗳️ Elections, Local Govt & Media\n🏔️ South Asia Geography & Climate\n💰 Economics, Scarcity & Production\n☪️ Islamic History & Empires\n\n15 Sections · 20 Questions per page · Instant score & locked answers!',
    images: [{ url: OG, width: 1200, height: 630, alt: 'Pakistan Studies MCQs Practice — FPSC PPSC NTS CSS' }],
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🇵🇰 364 Pakistan Studies MCQs — FPSC / PPSC / NTS Prep (Free)',
    description:
      '✅ 15 Sections · 20 per page. History, Constitution, Geography, Economics & Governance. Submit & grade instantly!',
    images: [OG],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/quizzes/pak-studies` },
};

export default function PakStudiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
