import type { Metadata } from 'next';

const BASE = 'https://govt-jobs-preparation-portal.vercel.app';
const OG   = `${BASE}/og-quizzes.png`;

export const metadata: Metadata = {
  title: '🌍 World Info MCQs — Capitals, Currencies & Leaders | GovtJobs.pk',
  description:
    'Practice 420 World General Knowledge MCQs: 195 World Capitals, 195 World Currencies, and 30 Current World Leaders. Organized by continent (Asia, Africa, Europe, Americas, Oceania). Free practice for FPSC, PPSC, NTS & CSS!',
  keywords: [
    'World Capitals MCQs Pakistan',
    'World Currencies MCQs',
    'World Leaders 2025',
    'General Knowledge MCQs FPSC',
    'PPSC GK MCQs',
    'NTS General Knowledge',
    'CSS World Affairs MCQs',
    'Country Capital Quiz Pakistan',
    'Asia Capitals MCQs',
    'Africa Capitals MCQs',
  ],
  openGraph: {
    type: 'website',
    url: `${BASE}/quizzes/world-info`,
    siteName: 'GovtJobs.pk — Govt Exam Preparation Portal',
    title: '🌍 World Info MCQs — 420 Questions on Capitals, Currencies & Leaders',
    description:
      '🎯 420 World General Knowledge MCQs — Free Practice!\n\n🏛️ World Capitals (195 Qs) — Asia, Africa, Europe, Americas, Oceania\n💰 World Currencies (195 Qs) — All Continents\n👑 World Leaders (30 Qs) — Current Heads of State\n\n✅ 20 per page · Submit & see score · Locked answers!',
    images: [{ url: OG, width: 1200, height: 630, alt: 'World Info MCQs — Capitals, Currencies & Leaders Practice' }],
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🌍 World Capitals, Currencies & Leaders — 420 MCQs Free Practice',
    description: '✅ 195 World Capitals + 195 World Currencies + 30 Current Leaders. Organized by continent. Submit & grade instantly!',
    images: [OG],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/quizzes/world-info` },
};

export default function WorldInfoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
