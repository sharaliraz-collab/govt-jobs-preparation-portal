import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getQuizById } from '@/lib/data/content';
import { buildPageMetadata, absoluteUrl } from '@/lib/seo';
import QuizAttemptClient from './QuizAttemptClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const quiz = await getQuizById(params.id);
  if (!quiz) {
    return { title: 'Quiz Not Found' };
  }

  const questionCount = quiz.questions?.length || 0;
  const description = `Practice ${quiz.subject} MCQ quiz: ${quiz.titleEn}. ${questionCount} questions, ${quiz.timeLimitMinutes} minutes, ${quiz.passPercentage}% pass mark. Free online test prep for FPSC, PPSC & NTS.`;

  return buildPageMetadata({
    title: `${quiz.titleEn} — ${quiz.subject} MCQ Quiz`,
    description,
    path: `/quizzes/${params.id}`,
    keywords: [quiz.titleEn, quiz.subject, 'MCQ quiz Pakistan', 'online test preparation', 'FPSC MCQ'],
  });
}

export default async function QuizDetailPage({ params }: Props) {
  const quiz = await getQuizById(params.id);
  if (!quiz) notFound();

  const jsonLdQuiz = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: quiz.titleEn,
    about: {
      '@type': 'Thing',
      name: quiz.subject,
    },
    educationalLevel: 'Competitive Examination (FPSC, PPSC, SPSC, NTS)',
    numberOfQuestions: quiz.questions?.length || 0,
    timeRequired: `PT${quiz.timeLimitMinutes || 15}M`,
    url: absoluteUrl(`/quizzes/${quiz.id}`),
    provider: {
      '@type': 'Organization',
      name: 'GovtJobs.pk',
      url: absoluteUrl('/'),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdQuiz) }}
      />
      <QuizAttemptClient id={params.id} initialQuiz={quiz} />
    </>
  );
}
