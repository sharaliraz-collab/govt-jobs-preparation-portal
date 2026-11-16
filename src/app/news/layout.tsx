import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Pakistan Government Job News, Roll No Slips & Exam Updates 2026',
  description:
    'Stay updated with official recruitment news, FPSC/PPSC/SPSC exam dates, interview schedules, roll number slip releases, and merit list announcements.',
  path: '/news',
  image: '/og-image.png',
  keywords: [
    'Government Job News Pakistan',
    'FPSC Roll Number Slips',
    'PPSC Exam Schedule 2026',
    'SPSC Merit Lists & Results',
    'Official Recruitment Notifications',
  ],
});

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
