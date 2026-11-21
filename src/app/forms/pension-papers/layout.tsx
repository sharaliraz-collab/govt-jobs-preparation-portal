import type { Metadata } from 'next';
import { buildPageMetadata, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title:
    'Government Pension Papers — Online Fill, Auto-Calculate & Print 16 Official A4 Pages (Form 3 Pen. & LPC)',
  description:
    'Fill employee details once and print all 16 pixel-perfect double-bordered A4 Government Pension Papers (Form 3 Pen. Part I & II, Auto Qualifying Service & Commutation in Figures & Words, 8 D.D.O/H.O.D Certificates, Sindh Consolidated Certificate, Descriptive Roll & A.T.C.5 Last-Pay Certificate). Share pre-filled links on WhatsApp to collect details error-free. 100% free & private.',
  path: '/forms/pension-papers',
  image: '/og-pension-papers.png',
  keywords: [
    'Pakistan pension papers online fill and print',
    'Sindh government pension papers form 3 pen',
    'pension commutation calculator Pakistan 2026',
    'Last Pay Certificate ATC 5 format',
    'DDO no enquiry no dues certificate pension',
    'West Pakistan Civil Services Pension Rules 1963',
    'AG Sindh DAO pension case preparation',
    'share pension form link on WhatsApp',
  ],
});

const jsonLdApp = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'GovtJobs.pk Government Pension Papers — Fill & Print Studio',
  url: `${SITE_URL}/forms/pension-papers`,
  applicationCategory: 'GovernmentService',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'PKR',
  },
  description:
    'Free browser-based tool for Pakistan and Sindh government employees and D.D.O offices to fill, auto-calculate, verify, share via WhatsApp, and print all 16 official A4 Pension Papers (Form 3 Pen. & A.T.C.5 LPC).',
  featureList: [
    '16 Official Double-Bordered A4 Pension Sheets',
    'Automatic Qualifying Service (Years, Months, Days) & 60-Year Superannuation Date',
    '2001 Revised Commutation Table (Ages 28–60) & Automatic Rupees in Words',
    'Pre-Print DAO / AG Sindh Mistake Verification Checklist',
    'Private WhatsApp Prefill Link Sharing to Collect or Return Employee Details',
    'Selective Single-Page and Full-Set A4 Printing',
  ],
};

export default function PensionPapersLayout({ children }: { children: React.ReactNode }) {
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
