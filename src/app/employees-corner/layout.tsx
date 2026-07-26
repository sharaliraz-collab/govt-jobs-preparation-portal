import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

export const metadata: Metadata = {
  title: "Employees' Corner — Govt Notifications, Pay Scales & Subsidies 2026",
  description: 'Dedicated portal for serving government employees in Pakistan. Access official notifications, pay scale revisions, FO forms, and subsidy details.',
  openGraph: {
    title: "Employees' Corner — Pakistan Government Employees Portal",
    description: 'Notifications, pay scales, FO forms, and government subsidies.',
    url: `${siteUrl}/employees-corner`,
  },
  alternates: {
    canonical: `${siteUrl}/employees-corner`,
  },
};

export default function EmployeesCornerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
