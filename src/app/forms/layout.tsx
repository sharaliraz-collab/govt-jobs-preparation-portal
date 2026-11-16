import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Download Government Job Application & Challan Forms PDF — FPSC, PPSC, NTS',
  description:
    'Download official government job application forms, bank fee challan slips, medical certificates, verification documents, and bio-data forms.',
  path: '/forms',
  image: '/og-image.png',
  keywords: [
    'Government Job Application Forms PDF',
    'FPSC Challan Form Download',
    'PPSC Challan Form',
    'SPSC Application Form',
    'Sindh Free Solar Panel Form',
  ],
});

export default function FormsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
