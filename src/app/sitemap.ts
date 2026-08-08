import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/materials`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/quizzes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/mock-papers/police-constable`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/quizzes/police-constable`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/mock-papers/ministry-of-defence`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/quizzes/ministry-of-defence`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/forms`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/employees-corner`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  try {
    const [jobs, news, materials, quizzes] = await Promise.all([
      prisma.job.findMany({ select: { id: true, updatedAt: true } }),
      prisma.news.findMany({ select: { id: true, updatedAt: true } }),
      prisma.material.findMany({ select: { id: true, updatedAt: true } }),
      prisma.quiz.findMany({ select: { id: true, updatedAt: true } }),
    ]);

    const jobUrls: MetadataRoute.Sitemap = jobs.map((j) => ({
      url: `${siteUrl}/jobs/${j.id}`,
      lastModified: j.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const newsUrls: MetadataRoute.Sitemap = news.map((n) => ({
      url: `${siteUrl}/news/${n.id}`,
      lastModified: n.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const materialUrls: MetadataRoute.Sitemap = materials.map((m) => ({
      url: `${siteUrl}/materials/${m.id}`,
      lastModified: m.updatedAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    const quizUrls: MetadataRoute.Sitemap = quizzes.map((q) => ({
      url: `${siteUrl}/quizzes/${q.id}`,
      lastModified: q.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticPages, ...jobUrls, ...newsUrls, ...materialUrls, ...quizUrls];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return staticPages;
  }
}
