import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

export const metadata: Metadata = {
  title: 'Test Prep Study Materials & Past Papers PDF — FPSC, PPSC, NTS',
  description: 'Free download authentic past papers, syllabus guides, preparation notes for General Knowledge, Pakistan Studies, Islamic Studies, English, and CS.',
  openGraph: {
    title: 'Test Prep Study Materials & Past Papers PDF — FPSC, PPSC, NTS',
    description: 'Download solved past papers and preparation materials for Pakistan competitive exams.',
    url: `${siteUrl}/materials`,
    siteName: 'GovtJobs.pk',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Study Materials and Past Papers' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Test Prep Materials & Solved Past Papers PDF',
    description: 'Authentic syllabus guides, solved past papers, and preparation notes for competitive exams.',
    images: ['/og-image.png'],
  },
};

export default function MaterialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
