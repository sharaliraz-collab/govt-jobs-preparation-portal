import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: '⚡ Physics MCQs — Solved Practice Questions for MDCAT, FPSC, PPSC & ECAT',
  description:
    'Practice solved Physics MCQs covering Mechanics, Electromagnetism, Thermodynamics, Waves, Optics, and Modern Physics for MDCAT, ECAT, FPSC, PPSC & NTS entry tests.',
  path: '/quizzes/physics',
  image: '/og-quizzes.png',
  keywords: [
    'Physics MCQs',
    'MDCAT Physics MCQs',
    'FPSC Physics MCQs',
    'PPSC Physics Lecturer Test',
    'NTS Physics Practice Questions',
  ],
});

export default function PhysicsQuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
