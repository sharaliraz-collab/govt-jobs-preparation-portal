import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

export const metadata: Metadata = {
  title: 'Download Government Job Application Forms PDF — FPSC, PPSC, NTS',
  description: 'Download official job application forms, challan forms, medical certificates, and bio-data forms for Pakistan federal & provincial recruitment.',
  openGraph: {
    title: 'Download Govt Job Application & Challan Forms PDF',
    description: 'Official application forms, bank challan slips, and medical certificate templates.',
    url: `${siteUrl}/forms`,
  },
  alternates: {
    canonical: `${siteUrl}/forms`,
  },
};

export default function FormsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
