import type { Metadata } from 'next';

const BASE = 'https://govt-jobs-preparation-portal.vercel.app';
const OG = `${BASE}/og-image.png`;

export const metadata: Metadata = {
  title: 'Government Pension Papers — Online Fill, Auto-Calculate & Print A4 (Form 3 Pen. & LPC) | GovtJobs.pk',
  description:
    'Fill once and print all 16 official pixel-perfect A4 Government Pension Papers (Form 3 Pen. Part I & II, Qualifying Service, Commutation Calculator 28–60, 8 DDO/HOD Certificates, Sindh Consolidated Certificate, Descriptive Roll & A.T.C.5 Last-Pay Certificate). Zero calculation mistakes, 100% private in browser.',
  keywords: [
    'Pakistan pension papers online fill and print',
    'Sindh government pension papers form 3 pen',
    'pension commutation calculator Pakistan 2026',
    'Last Pay Certificate ATC 5 format',
    'DDO no enquiry no dues certificate pension',
    'West Pakistan Civil Services Pension Rules 1963',
    'AG Sindh DAO pension case preparation',
  ],
  openGraph: {
    type: 'website',
    url: `${BASE}/forms/pension-papers`,
    siteName: 'GovtJobs.pk',
    title: 'Government Pension Papers — Fill Once & Print All 16 Official A4 Pages',
    description:
      'Free, private, error-checked pension papers generator for Pakistan & Sindh government employees and DDO offices. Auto-calculates qualifying service, gross/net pension, commutation lump sum in figures & words, and prints exact double-bordered A4 sheets.',
    images: [{ url: OG, width: 1200, height: 630, alt: 'Government Pension Papers Fill & Print Studio' }],
    locale: 'en_PK',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/forms/pension-papers` },
};

export default function PensionPapersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
