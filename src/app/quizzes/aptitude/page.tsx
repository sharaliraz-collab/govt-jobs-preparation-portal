import type { Metadata } from 'next';
import { buildPageMetadata, absoluteUrl } from '@/lib/seo';
import { APTITUDE_TOPICS, APTITUDE_TOTAL_QUESTIONS } from '@/data/aptitudeTopics';
import AptitudeHub from '@/components/AptitudeHub';

export const metadata: Metadata = buildPageMetadata({
  title: `Aptitude Test MCQs — ${APTITUDE_TOTAL_QUESTIONS.toLocaleString()} Questions with Solutions`,
  description: `Free online aptitude test practice: ${APTITUDE_TOTAL_QUESTIONS.toLocaleString()} MCQs in ${APTITUDE_TOPICS.length} topics — average, percentage, ratio, profit & loss, time & work, trains, algebra, geometry and more — with step-by-step solutions for FPSC, PPSC, SPSC, NTS & CSS.`,
  path: '/quizzes/aptitude',
  image: '/og-quizzes.png',
  keywords: [
    'aptitude test MCQs',
    'quantitative aptitude Pakistan',
    'FPSC aptitude test',
    'NTS aptitude MCQs',
    'aptitude questions with solutions',
    'maths MCQs for government jobs',
  ],
});

export default function AptitudePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Aptitude Test MCQ Topics',
    numberOfItems: APTITUDE_TOPICS.length,
    itemListElement: APTITUDE_TOPICS.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${t.title} Aptitude MCQs`,
      url: absoluteUrl(`/quizzes/aptitude/${t.slug}`),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AptitudeHub />
    </>
  );
}
