import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

export const metadata: Metadata = {
  title: 'Online MCQ Practice Tests & Quizzes — FPSC, PPSC, NTS Prep',
  description: 'Test your knowledge with timed online MCQ practice quizzes for FPSC, PPSC, NTS, SPSC, and CSS/PMS examinations with instant scoring & answer review.',
  openGraph: {
    title: 'Online MCQ Practice Quizzes — Pakistan Govt Recruitment Prep',
    description: 'Timed online MCQ tests for FPSC, PPSC, NTS, and competitive exams.',
    url: `${siteUrl}/quizzes`,
  },
  alternates: {
    canonical: `${siteUrl}/quizzes`,
  },
};

export default function QuizzesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
