import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: "Employees' Corner — Govt Notifications, Pay Scales & Subsidies 2026",
  description:
    'Dedicated service portal for serving government employees in Pakistan. Access official notifications, FO1/FO2/FO3 service records, departmental forms, and subsidy programs.',
  path: '/employees-corner',
  image: '/og-image.png',
  keywords: [
    'Pakistan Government Employees Portal',
    'Sindh Govt Notifications',
    'FO1 FO2 FO3 Portal',
    'Government Employee Subsidies',
    'Departmental Leave & Pension Forms',
  ],
});

export default function EmployeesCornerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
