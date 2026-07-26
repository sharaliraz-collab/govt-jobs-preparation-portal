import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

export const metadata: Metadata = {
  title: 'Download Official Government Application Forms PDF — GovtJobs.pk',
  description: 'Download verified PDF application forms, verification forms, scholarship forms, and admission forms for federal and provincial departments in Pakistan.',
  openGraph: {
    title: 'Download Official Government Application Forms PDF — GovtJobs.pk',
    description: 'Access downloadable PDF application forms for government vacancies, scholarships, and official services.',
    url: `${siteUrl}/forms`,
    siteName: 'GovtJobs.pk',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Download Official Application Forms PDF' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Download Official Government Application Forms PDF',
    description: 'Verified PDF application forms for government jobs, scholarships, and official verifications.',
    images: ['/og-image.png'],
  },
};

export default function FormsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
