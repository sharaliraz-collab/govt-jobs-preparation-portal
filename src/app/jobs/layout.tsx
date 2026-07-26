import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

export const metadata: Metadata = {
  title: 'Government Jobs in Pakistan 2026 — FPSC, PPSC, SPSC, NTS Alerts',
  description: 'Search and apply for active federal & provincial government job vacancies in Pakistan. Updated daily for FPSC, PPSC, SPSC, KPPSC, BPSC, NTS, and Military jobs.',
  openGraph: {
    title: 'Pakistan Government Jobs 2026 — FPSC, PPSC & NTS Alerts',
    description: 'Find active federal & provincial government job vacancies in Pakistan.',
    url: `${siteUrl}/jobs`,
  },
  alternates: {
    canonical: `${siteUrl}/jobs`,
  },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
