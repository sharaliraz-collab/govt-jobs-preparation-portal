import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

export const metadata: Metadata = {
  title: 'FPSC & PPSC Past Papers PDF Download — Test Preparation Materials',
  description: 'Download past papers, syllabus PDFs, CSS/PMS exam study notes, general knowledge MCQs, and subject preparation guides for Pakistan competitive exams.',
  openGraph: {
    title: 'FPSC & PPSC Past Papers PDF — Test Prep Study Materials',
    description: 'Download solved past papers, syllabus PDFs, and study notes.',
    url: `${siteUrl}/materials`,
  },
  alternates: {
    canonical: `${siteUrl}/materials`,
  },
};

export default function MaterialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
