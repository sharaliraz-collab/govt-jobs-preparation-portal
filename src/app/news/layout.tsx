import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

export const metadata: Metadata = {
  title: 'Official News & Exam Notifications — FPSC, PPSC, NTS Gazette',
  description: 'Latest official government news, test schedules, answer keys, merit lists, and recruitment policy updates in Pakistan.',
  openGraph: {
    title: 'Official News & Exam Notifications — FPSC, PPSC, NTS Gazette',
    description: 'Stay updated with official exam timetables, test results, and recruitment notifications in Pakistan.',
    url: `${siteUrl}/news`,
    siteName: 'GovtJobs.pk',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Government News & Notifications' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Official News & Exam Notifications — GovtJobs.pk',
    description: 'Latest official government news, test schedules, answer keys, merit lists, and recruitment policy updates.',
    images: ['/og-image.png'],
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
