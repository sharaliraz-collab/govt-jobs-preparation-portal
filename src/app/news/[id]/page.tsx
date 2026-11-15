import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNewsById } from '@/lib/data/content';
import { buildPageMetadata, truncate, absoluteUrl, resolveImageUrl } from '@/lib/seo';
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

  const jsonLdNews = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.titleEn,
    description: truncate(article.bodyEn || article.titleEn, 160),
    image: [resolveImageUrl(article.coverImage || undefined)],
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/news/${article.id}`),
    },
    author: {
      '@type': 'Organization',
      name: 'GovtJobs.pk Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GovtJobs.pk',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/og-image.png'),
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdNews) }}
      />
      <NewsDetailClient id={params.id} initialNews={article} />
    </>
  );
}
