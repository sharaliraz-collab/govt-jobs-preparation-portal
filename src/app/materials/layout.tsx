import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'FPSC & PPSC Past Papers PDF Download — Test Preparation Materials',
  description:
    'Download solved past papers, syllabus PDFs, CSS/PMS exam study notes, general knowledge MCQs, and subject preparation guides for Pakistan competitive exams.',
  path: '/materials',
  image: '/og-quizzes.png',
  keywords: [
    'FPSC Past Papers PDF',
    'PPSC Past Papers Download',
    'SPSC Solved Past Papers',
    'NTS Test Preparation PDFs',
    'CSS PMS Study Notes',
  ],
});

export default function MaterialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
