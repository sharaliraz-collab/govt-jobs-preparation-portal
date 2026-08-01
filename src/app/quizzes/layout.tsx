import type { Metadata } from 'next';

const BASE = 'https://govt-jobs-preparation-portal.vercel.app';
const OG   = `${BASE}/og-quizzes.png`;

export const metadata: Metadata = {
  title: '📚 Free MCQ Practice Tests — FPSC, PPSC, NTS, CSS, SPSC Prep | GovtJobs.pk',
  description:
    'Practice free MCQ tests for Pakistan government job exams. Subjects: English Grammar, Pakistan Studies, Islamic Studies, General Science, Physics, Chemistry, Biology, Computer Science & Mathematics. Instant score & answer key!',
  keywords: [
    'MCQ Practice Tests Pakistan',
    'FPSC MCQs Online',
    'PPSC Practice Tests',
    'NTS MCQ Test',
    'CSS MCQs',
    'Pakistan Government Job Exam',
    'SPSC MCQs',
    'English Grammar MCQs',
    'Pakistan Studies MCQs',
    'Free Online Quiz Pakistan',
  ],
  openGraph: {
    type: 'website',
    url: `${BASE}/quizzes`,
    siteName: 'GovtJobs.pk — Government Jobs & Exam Prep Portal',
    title: '📚 Free MCQ Practice — FPSC · PPSC · NTS · CSS · SPSC',
    description:
      '🎯 Practice free MCQ tests for Pakistan government job exams!\n\n✅ English Grammar (100 MCQs)\n✅ Pakistan Studies\n✅ Islamic Studies\n✅ General Science & Ability\n✅ Physics · Chemistry · Biology\n✅ Computer Science · Mathematics\n\n20 per page · Instant score · Locked answers!',
    images: [{ url: OG, width: 1200, height: 630, alt: 'Free MCQ Practice Tests for Pakistan Govt Exams' }],
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary_large_image',
    title: '📚 Free MCQ Practice — FPSC / PPSC / NTS / CSS (9 Subjects)',
    description:
      '✅ 9 subjects · 20 MCQs per page · Instant grading & answer key. Prepare for Pakistan govt job exams for free!',
    images: [OG],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/quizzes` },
};

export default function QuizzesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
