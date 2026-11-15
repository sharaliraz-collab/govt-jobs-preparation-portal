import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildPageMetadata, absoluteUrl } from '@/lib/seo';
import { loadAptitudeQuestions } from '@/lib/aptitude';
import { APTITUDE_PER_PAGE, APTITUDE_TOPICS, getAptitudeTopic } from '@/data/aptitudeTopics';
import AptitudePractice from '@/components/AptitudePractice';

interface Props {
  params: { topic: string };
  searchParams?: { page?: string };
}

export function generateStaticParams() {
  return APTITUDE_TOPICS.map((t) => ({ topic: t.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const topic = getAptitudeTopic(params.topic);
  if (!topic) return { title: 'Aptitude Topic Not Found' };

  return buildPageMetadata({
    title: `${topic.title} Aptitude MCQs with Solutions — ${topic.count} Questions`,
    description: `Practice ${topic.count} ${topic.title} aptitude MCQs with step-by-step solutions for FPSC, PPSC, SPSC, NTS, CSS, PMS and other government job tests. ${APTITUDE_PER_PAGE} questions per page, free online.`,
    path: `/quizzes/aptitude/${topic.slug}`,
    image: '/og-quizzes.png',
    keywords: [
      `${topic.title} aptitude questions`,
      `${topic.title} MCQs with answers`,
      `${topic.title} quantitative aptitude`,
      'aptitude test Pakistan',
      'FPSC aptitude MCQs',
      'NTS quantitative aptitude',
    ],
  });
}

export default async function AptitudeTopicPage({ params, searchParams }: Props) {
  const topic = getAptitudeTopic(params.topic);
  if (!topic) notFound();

  const questions = await loadAptitudeQuestions(topic.slug);
  if (questions.length === 0) notFound();

  const index = APTITUDE_TOPICS.findIndex((t) => t.slug === topic.slug);
  const prev = index > 0 ? APTITUDE_TOPICS[index - 1] : null;
  const next = index < APTITUDE_TOPICS.length - 1 ? APTITUDE_TOPICS[index + 1] : null;

  const pageParam = parseInt(searchParams?.page || '1', 10);
  const initialPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'MCQ Practice', item: absoluteUrl('/quizzes') },
          { '@type': 'ListItem', position: 3, name: 'Aptitude', item: absoluteUrl('/quizzes/aptitude') },
          {
            '@type': 'ListItem',
            position: 4,
            name: topic.title,
            item: absoluteUrl(`/quizzes/aptitude/${topic.slug}`),
          },
        ],
      },
      {
        '@type': 'Quiz',
        name: `${topic.title} Aptitude MCQs`,
        about: { '@type': 'Thing', name: `${topic.title} (Quantitative Aptitude)` },
        educationalLevel: 'Competitive Examination (FPSC, PPSC, SPSC, NTS, CSS)',
        numberOfQuestions: topic.count,
        url: absoluteUrl(`/quizzes/aptitude/${topic.slug}`),
        provider: { '@type': 'Organization', name: 'GovtJobs.pk', url: absoluteUrl('/') },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AptitudePractice
        topic={topic}
        questions={questions}
        initialPage={initialPage}
        prevTopic={prev ? { slug: prev.slug, title: prev.title } : null}
        nextTopic={next ? { slug: next.slug, title: next.title } : null}
      />
    </>
  );
}
