import type { Metadata } from 'next';
import { buildPageMetadata, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title:
    'FO-2 (FORM: PAY02) Payroll System Amendment Form — Online Fill & Print A4 Landscape | GovtJobs.pk',
  description:
    'Fill and print the official Pakistan & Sindh Government FO-2 (FORM: PAY02) Single Employee Payroll Amendment Form in pixel-perfect A4 Landscape. Exact 6-box DDO Cost Center, 8-box Personnel Number, 4-box PIFRA Wage Types, 6-box right-aligned Rupees, Salary Start/Stop, and WhatsApp prefill sharing. 100% free & private.',
  path: '/forms/fo2',
  image: '/og-fo2.png',
  keywords: [
    'FO2 payroll amendment form online',
    'FORM PAY02 fill and print A4 landscape',
    'PIFRA SAP payroll amendment form Pakistan',
    'AG Sindh DAO FO2 form PDF',
    'single employee entry PAY02 generator',
    'Pakistan government salary increment form FO2',
  ],
});

const jsonLdApp = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'GovtJobs.pk FO-2 (FORM: PAY02) Payroll Amendment Studio',
  url: `${SITE_URL}/forms/fo2`,
  applicationCategory: 'GovernmentService',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'PKR' },
  description:
    'Pixel-perfect A4 Landscape generator for Pakistan / Sindh Government FO-2 (FORM: PAY02) Payroll System Amendment Form — Single Employee Entry.',
};

export default function Fo2Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
      />
      {children}
    </>
  );
}
