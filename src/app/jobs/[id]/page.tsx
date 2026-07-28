import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getJobById } from '@/lib/data/content';
import { buildPageMetadata, truncate } from '@/lib/seo';
import JobDetailClient from './JobDetailClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobById(params.id);
  if (!job) {
    return { title: 'Job Not Found' };
  }

  const description = truncate(
    job.descriptionEn ||
      `${job.titleEn} at ${job.department}, ${job.location}. ${job.vacancies} vacancies. Qualification: ${job.qualification}. Apply before ${new Date(job.deadline).toLocaleDateString('en-PK')}.`
  );

  return buildPageMetadata({
    title: `${job.titleEn} — ${job.department}`,
    description,
    path: `/jobs/${params.id}`,
    type: 'article',
    publishedTime: job.createdAt,
    keywords: [
      job.titleEn,
      job.department,
      job.location,
      job.category,
      'government jobs Pakistan',
      `${job.category} jobs`,
    ],
  });
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getJobById(params.id);
  if (!job) notFound();

  return <JobDetailClient id={params.id} initialJob={job} />;
}
