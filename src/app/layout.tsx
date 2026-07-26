import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GovtJobs.pk — Pakistan Government Jobs, Past Papers & MCQ Tests 2026',
    template: '%s | GovtJobs.pk',
  },
  description:
    'Pakistan\'s #1 portal for federal & provincial government job notifications, FPSC/PPSC/NTS past papers, online MCQ practice tests, and downloadable application forms. Updated daily.',
  keywords: [
    'government jobs Pakistan',
    'FPSC jobs 2026',
    'PPSC jobs',
    'NTS past papers',
    'Pakistan govt jobs',
    'MCQ test online',
    'CSS preparation',
    'PMS test',
    'federal jobs',
    'provincial jobs',
    'entry test preparation',
  ],
  authors: [{ name: 'GovtJobs.pk Editorial Team' }],
  creator: 'GovtJobs.pk',
  publisher: 'GovtJobs.pk',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
    title: 'GovtJobs.pk — Pakistan Government Jobs & Test Prep Portal',
    description:
      'Find latest federal & provincial government jobs, download FPSC/PPSC past papers, take timed MCQ quizzes, and access official application forms.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GovtJobs.pk — Pakistan Government Jobs Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GovtJobs.pk — Pakistan Government Jobs & Test Prep',
    description:
      'Latest govt jobs, past papers, MCQ tests & application forms for FPSC, PPSC, NTS, ETEA exams.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: siteUrl,
  },
  other: {
    'theme-color': '#0B5F3C',
    'msapplication-TileColor': '#0B5F3C',
  },
};

/* JSON-LD structured data */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GovtJobs.pk',
  url: siteUrl,
  description:
    'Pakistan\'s premier government jobs and test preparation portal.',
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
      url: `${siteUrl}/logo.png`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${jakarta.className} min-h-screen flex flex-col justify-between bg-govt-bg text-govt-charcoal antialiased`}
      >
        {/* Skip to content — accessibility */}
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
