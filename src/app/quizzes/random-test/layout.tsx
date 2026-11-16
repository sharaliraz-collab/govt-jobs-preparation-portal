import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: '🎲 Daily Random MCQ Test & Interesting Trivia Arena — Pak Govt Jobs & Exam Prep',
  description:
    'Generate fresh random MCQ tests across Islamic Studies, Biology, Chemistry, Physics, Pakistan Studies, World GK & Aptitude — plus daily challenges and 73 surprising Did You Know MCQs!',
  path: '/quizzes/random-test',
  keywords: [
    'Random MCQ Test',
    'Daily GK Challenge Pakistan',
    'Interesting MCQs Quiz',
    'FPSC PPSC Mixed Mock Quiz',
    'Random Science Quiz',
  ],
});

export default function RandomTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
