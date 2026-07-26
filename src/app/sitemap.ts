import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

  const staticPages = [
    '',
    '/jobs',
    '/materials',
    '/quizzes',
    '/news',
    '/forms',
    '/employees-corner',
    '/login',
    '/register',
  ];

  return staticPages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1.0 : path === '/jobs' ? 0.9 : 0.7,
  }));
}
