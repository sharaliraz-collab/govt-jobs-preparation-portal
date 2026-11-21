import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { APTITUDE_TOPICS } from '@/data/aptitudeTopics';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

  const aptitudePages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/quizzes/aptitude`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...APTITUDE_TOPICS.map((t) => ({
      url: `${siteUrl}/quizzes/aptitude/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/materials`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/quizzes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/quizzes/screening-test`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${siteUrl}/mock-tests`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${siteUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/quizzes/biology`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/quizzes/physics`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/quizzes/islamic-studies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/quizzes/pak-studies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/quizzes/english-grammar`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/quizzes/world-info`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${siteUrl}/mock-papers/mdcat`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/mock-papers/police-constable`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/quizzes/police-constable`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/mock-papers/ministry-of-defence`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/quizzes/ministry-of-defence`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/mock-papers/salu-entry-test`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/forms`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/forms/pension-papers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${siteUrl}/forms/sindh-solar`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/employees-corner`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];

  try {
    const [jobs, news, quizzes] = await Promise.all([
      prisma.job.findMany({ select: { id: true, updatedAt: true } }),
      prisma.news.findMany({ select: { id: true, updatedAt: true } }),
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

    const quizUrls: MetadataRoute.Sitemap = quizzes.map((q) => ({
      url: `${siteUrl}/quizzes/${q.id}`,
      lastModified: q.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticPages, ...aptitudePages, ...jobUrls, ...newsUrls, ...quizUrls];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return [...staticPages, ...aptitudePages];
  }
}
