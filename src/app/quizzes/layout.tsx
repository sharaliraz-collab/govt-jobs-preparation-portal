import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

export const metadata: Metadata = {
  title: 'Online MCQ Quizzes & Entry Test Practice — FPSC, PPSC, NTS',
  description: 'Practice timed online MCQ tests for General Knowledge, Pakistan Studies, Islamic Studies, English, Computer Science, and Mathematics with instant scoring.',
  openGraph: {
    title: 'Online MCQ Quizzes & Entry Test Practice — FPSC, PPSC, NTS',
    description: 'Test your knowledge with authentic timed MCQ quizzes for recruitment and admission tests in Pakistan.',
    url: `${siteUrl}/quizzes`,
    siteName: 'GovtJobs.pk',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Online MCQ Quizzes and Practice Tests' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Timed MCQ Quizzes & Entry Test Practice',
    description: 'Practice timed online MCQ tests with detailed answer keys and performance history.',
    images: ['/og-image.png'],
  },
};

export default function QuizzesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
