import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNewsById } from '@/lib/data/content';
import { buildPageMetadata, truncate, resolveImageUrl } from '@/lib/seo';
import NewsDetailClient from './NewsDetailClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getNewsById(params.id);
  if (!article) {
    return { title: 'News Not Found' };
  }

  const description = truncate(article.bodyEn || article.titleEn);

  return buildPageMetadata({
    title: article.titleEn,
    description,
    path: `/news/${params.id}`,
    image: article.coverImage ? resolveImageUrl(article.coverImage) : undefined,
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
