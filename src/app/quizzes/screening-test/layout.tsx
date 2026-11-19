import type { Metadata } from 'next';

const BASE = 'https://govt-jobs-preparation-portal.vercel.app';
const OG = `${BASE}/og-quizzes.png`;

export const metadata: Metadata = {
  title: 'Random 100-MCQ Screening Test Pattern (20 Free Starter MCQs) | GovtJobs.pk',
  description:
    'Take a freshly randomized 20-of-100 screening test built on the official FPSC, PPSC, SPSC, KPPSC & NTS one-paper blueprint: English (20%), Pakistan Studies (20%), General Science (20%), Islamic Studies (15%), Aptitude (15%), and World GK (10%). Create a free account to unlock Q21–100 and track your subject-wise progress.',
  keywords: [
    'FPSC 100 MCQs screening test',
    'PPSC one paper mock test',
    'SPSC random MCQ test',
    'NTS screening test pattern',
    '20 MCQs diagnostic test Pakistan',
    'Pakistan govt job exam readiness test',
  ],
  openGraph: {
    type: 'website',
    url: `${BASE}/quizzes/screening-test`,
    siteName: 'GovtJobs.pk',
    title: 'Random 100-MCQ Screening Test Pattern — Start 20 Free Questions',
    description:
      'Authentic 6-subject FPSC/PPSC/SPSC/NTS exam pattern randomized from 15,600+ verified MCQs. Start 20 free questions, see your weak subjects, and save progress in your free account.',
    images: [{ url: OG, width: 1200, height: 630, alt: '100-MCQ Screening Test Pattern' }],
    locale: 'en_PK',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/quizzes/screening-test` },
};

export default function ScreeningTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
