import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Government Jobs in Pakistan 2026 — FPSC, PPSC, SPSC, NTS Alerts',
  description:
    'Search and apply for active federal & provincial government job vacancies in Pakistan. Updated daily for FPSC, PPSC, SPSC, KPPSC, BPSC, NTS, and Defence jobs.',
  path: '/jobs',
  image: '/og-image.png',
  keywords: [
    'Government Jobs in Pakistan 2026',
    'FPSC Jobs',
    'PPSC Jobs',
    'SPSC Jobs',
    'STS SIBA Jobs',
    'Federal Government Vacancies',
  ],
});

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
