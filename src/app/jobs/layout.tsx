import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

export const metadata: Metadata = {
  title: 'Government Jobs in Pakistan 2026 — FPSC, PPSC, SPSC, NTS Jobs',
  description: 'Search latest federal and provincial government job advertisements in Pakistan. Apply online for FPSC, PPSC, SPSC, KPPSC, NTS, and ETEA jobs.',
  openGraph: {
    title: 'Government Jobs in Pakistan 2026 — FPSC, PPSC, SPSC, NTS Jobs',
    description: 'Find active recruitment notices for federal & provincial departments across Pakistan. Daily updated job ads with official PDF downloads.',
    url: `${siteUrl}/jobs`,
    siteName: 'GovtJobs.pk',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Government Jobs Pakistan' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Government Jobs in Pakistan 2026 — FPSC, PPSC, NTS Alerts',
    description: 'Find active recruitment notices for federal & provincial departments across Pakistan.',
    images: ['/og-image.png'],
  },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
