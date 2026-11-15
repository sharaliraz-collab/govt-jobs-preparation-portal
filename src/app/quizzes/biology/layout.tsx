import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: '🧬 Biology MCQs — 1,000+ Solved Practice Questions for MDCAT, FPSC & PPSC',
  description:
    'Practice 1,000+ Biology MCQs covering Cell Biology, Genetics, Human Physiology, Enzymes, Bioenergetics, and Evolution for MDCAT, SIBA STS, FPSC, PPSC & NTS tests.',
  path: '/quizzes/biology',
  image: '/og-biology.png',
  keywords: [
    'Biology MCQs',
    'MDCAT Biology MCQs',
    'FPSC Biology Lecturer MCQs',
    'PPSC Biology Past Papers',
    'SIBA STS Biology Practice',
    'Cell Biology & Genetics MCQs',
  ],
});

export default function BiologyQuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
