import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: '☪️ Islamic Studies (Islamiat) MCQs — 1,711 Solved Questions for FPSC, PPSC, SPSC & NTS',
  description:
    'Practice 1,711 solved Islamic Studies (Islamiat) MCQs covering Holy Quran, Hadith & Sunnah, Seerah-un-Nabi, Ghazwaat, Khulafa-e-Rashideen & Islamic History for government job exams.',
  path: '/quizzes/islamic-studies',
  image: '/og-islamic.png',
  keywords: [
    'Islamic Studies MCQs',
    'Islamiat MCQs for FPSC',
    'PPSC Islamiat Past Papers',
    'NTS Islamic Studies Quiz',
    'CSS Islamiat MCQs',
    'SPSC Islamic Studies Questions',
  ],
});

export default function IslamicStudiesQuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
