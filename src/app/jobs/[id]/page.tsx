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
    return { title: 'Government Job Posting Not Found' };
  }

  const deadlineFormatted = job.deadline
    ? new Date(job.deadline).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Open';

  const title = `📢 ${job.titleEn} — ${job.department} (${job.location})`;

  const description = truncate(
    job.descriptionEn && job.descriptionEn.length > 20
      ? `🏛️ ${job.department} Announcement: ${job.descriptionEn} · Location: ${job.location} · Vacancies: ${job.vacancies} Position(s) · Qualification: ${job.qualification} · Deadline: ${deadlineFormatted}. Apply now online!`
      : `🏛️ ${job.department} has announced new job recruitment for ${job.titleEn} in ${job.location}. Total Seats: ${job.vacancies}. Required Qualification: ${job.qualification}. Last Date to Apply: ${deadlineFormatted}. Check official advertisement details & apply!`
  );

  let image: string | undefined = undefined;
  if (job.adFile) {
    const isPdf = job.adFile.toLowerCase().includes('.pdf');
    if (!isPdf) {
      image = job.adFile.startsWith('/uploads') || job.adFile.startsWith('http')
        ? job.adFile
        : `/uploads/${job.adFile}`;
    }
  }

  return buildPageMetadata({
    title,
    description,
    path: `/jobs/${params.id}`,
    image,
    type: 'article',
    publishedTime: job.createdAt,
    keywords: [
      job.titleEn,
      job.department,
      job.location,
      job.category,
      'government jobs Pakistan',
      'Sindh government jobs 2026',
      `${job.category} jobs`,
    ],
  });
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getJobById(params.id);
  if (!job) notFound();

  return <JobDetailClient id={params.id} initialJob={job} />;
}
