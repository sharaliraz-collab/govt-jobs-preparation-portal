import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';
export const SITE_NAME = 'GovtJobs.pk';
export const DEFAULT_OG_IMAGE = '/og-image.png';

export function truncate(text: string, maxLength = 160): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 3).trim()}...`;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function resolveImageUrl(image?: string): string {
  if (!image) return absoluteUrl(DEFAULT_OG_IMAGE);
  if (image.startsWith('http')) return image;
  return absoluteUrl(image.startsWith('/') ? image : `/uploads/${image}`);
}

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
  keywords = [],
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = resolveImageUrl(image);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
        },
    openGraph: {
      type,
      locale: 'en_PK',
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && type === 'article' ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@GovtJobsPK',
      creator: '@GovtJobsPK',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
