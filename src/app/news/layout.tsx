import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

export const metadata: Metadata = {
  title: 'Pakistan Government Job News, Roll No Slips & Exam Updates 2026',
  description: 'Stay updated with official recruitment news, FPSC/PPSC exam dates, interview schedules, roll number slip releases, and merit list announcements.',
  openGraph: {
    title: 'Pakistan Govt Recruitment News & Roll No Slip Alerts 2026',
    description: 'Official test dates, interview schedules, and merit list news.',
    url: `${siteUrl}/news`,
  },
  alternates: {
    canonical: `${siteUrl}/news`,
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
