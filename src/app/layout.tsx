import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GovtJobs.pk — Pakistan Government Jobs, FPSC, PPSC & MCQ Prep 2026',
    template: '%s | GovtJobs.pk',
  },
  description:
    'Pakistan\'s #1 official portal for federal & provincial government job alerts, FPSC/PPSC/NTS past papers, online MCQ practice tests, and downloadable application forms. Updated daily.',
  keywords: [
    'government jobs Pakistan',
    'FPSC jobs 2026',
    'PPSC jobs 2026',
    'SPSC jobs',
    'KPPSC jobs',
    'NTS past papers',
    'Pakistan govt jobs',
    'MCQ test online',
    'CSS examination preparation',
    'PMS exam past papers',
    'federal government jobs',
    'provincial government jobs',
    'entry test preparation Pakistan',
  ],
  authors: [{ name: 'GovtJobs.pk Editorial Team', url: siteUrl }],
  creator: 'GovtJobs.pk',
  publisher: 'GovtJobs.pk',
  category: 'Employment & Education',
  applicationName: 'GovtJobs.pk',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: siteUrl,
    siteName: 'GovtJobs.pk',
    title: 'GovtJobs.pk — Official Government Recruitment & Test Prep Portal',
    description:
      'Explore 1,000+ active federal & provincial government jobs, download FPSC/PPSC syllabus PDFs, and practice timed entry-test MCQs.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GovtJobs.pk — Pakistan Government Jobs & Preparation Portal',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@GovtJobsPK',
    creator: '@GovtJobsPK',
    title: 'GovtJobs.pk — Pakistan Government Jobs & Test Prep 2026',
    description:
      'Latest federal & provincial government job alerts, FPSC/PPSC/NTS past papers, and online MCQ practice quizzes.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-PK': `${siteUrl}/en`,
      'ur-PK': `${siteUrl}/ur`,
    },
  },
  other: {
    'theme-color': '#059669',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'GovtJobs.pk',
  },
};

const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GovtJobs.pk',
  alternateName: 'Pakistan Government Jobs Portal',
  url: siteUrl,
  description: 'Pakistan\'s premier official portal for government recruitment, FPSC/PPSC past papers, and online entry-test MCQs.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/jobs?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'GovtJobs.pk',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/og-image.png`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between bg-govt-bg text-govt-charcoal antialiased font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-govt-emerald focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold"
        >
          Skip to main content
        </a>

        <Providers>
          <Navbar />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
