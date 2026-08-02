import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNewsById } from '@/lib/data/content';
import { buildPageMetadata, truncate } from '@/lib/seo';
import NewsDetailClient from './NewsDetailClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getNewsById(params.id);
  if (!article) {
    return { title: 'News Announcement Not Found' };
  }

  const title = `📰 ${article.titleEn}`;
  const description = truncate(
    article.bodyEn && article.bodyEn.length > 20
      ? `📢 ${article.category}: ${article.bodyEn}`
      : `Official announcement: ${article.titleEn}. Read full details and official gazette notification on GovtJobs portal.`
  );

  return buildPageMetadata({
    title,
    description,
    path: `/news/${params.id}`,
    image: article.coverImage || undefined,
    type: 'article',
    publishedTime: article.publishedAt || article.createdAt,
    keywords: [article.titleEn, article.category, 'government news Pakistan', 'FPSC notifications'],
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const article = await getNewsById(params.id);
  if (!article) notFound();

  return <NewsDetailClient id={params.id} initialNews={article} />;
}
