import type { Metadata } from 'next';

const BASE = 'https://govt-jobs-preparation-portal.vercel.app';
const OG   = `${BASE}/og-quizzes.png`;

export const metadata: Metadata = {
  title: '📚 English Grammar & Composition MCQs — FPSC / PPSC / SPSC Prep | GovtJobs.pk',
  description:
    '✅ Practice 100 English Grammar & Composition MCQs for FPSC, PPSC, SPSC, NTS & CSS exams. Topics: Parts of Speech, Synonyms, Antonyms, Error Detection, Reading Comprehension. 20 questions per page — Free!',
  keywords: [
    'English Grammar MCQs Pakistan',
    'FPSC English MCQs',
    'PPSC English Grammar',
    'NTS English Test',
    'CSS English MCQs',
    'Parts of Speech MCQs',
    'Synonyms Antonyms MCQs',
    'English Composition MCQs',
    'Pakistan government job exam English',
    'SPSC English Grammar Practice',
  ],
  openGraph: {
    type: 'website',
    url: `${BASE}/quizzes/english-grammar`,
    siteName: 'GovtJobs.pk — Govt Exam Preparation Portal',
    title: '📚 English Grammar MCQs — 100 Questions for FPSC / PPSC / NTS / CSS',
    description:
      '🎯 100 English Grammar & Composition MCQs — Free Online Practice!\n\n✅ Parts of Speech (Q1–20)\n✅ Synonyms (Q21–40)\n✅ Antonyms & Error Detection (Q41–80)\n✅ Reading Comprehension (Q81–100)\n\n20 Questions per page · Submit & see your score instantly · Locked answers once selected!',
    images: [{ url: OG, width: 1200, height: 630, alt: 'English Grammar MCQs Practice — FPSC PPSC NTS CSS' }],
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary_large_image',
    title: '📚 100 English Grammar MCQs — FPSC / PPSC / NTS Prep (Free)',
    description:
      '✅ Parts of Speech, Synonyms, Antonyms, Reading Comprehension. 20 per page. Submit & grade instantly!',
    images: [OG],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/quizzes/english-grammar` },
};

export default function EnglishGrammarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
