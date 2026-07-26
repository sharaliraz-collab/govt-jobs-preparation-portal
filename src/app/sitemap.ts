import { MetadataRoute } from 'next';
import connectDB from '@/lib/db';
import Job from '@/models/Job';
import NewsDoc from '@/models/News';
import MaterialDoc from '@/models/Material';
import QuizDoc from '@/models/Quiz';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs.pk';

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/materials`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/quizzes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/forms`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/employees-corner`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  try {
    await connectDB();

    const [jobs, news, materials, quizzes] = await Promise.all([
      Job.find({}, '_id updatedAt').lean(),
      NewsDoc.find({}, '_id updatedAt').lean(),
      MaterialDoc.find({}, '_id updatedAt').lean(),
      QuizDoc.find({}, '_id updatedAt').lean(),
    ]);

    const jobUrls: MetadataRoute.Sitemap = jobs.map((j: any) => ({
      url: `${siteUrl}/jobs/${j._id}`,
      lastModified: j.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const newsUrls: MetadataRoute.Sitemap = news.map((n: any) => ({
      url: `${siteUrl}/news/${n._id}`,
      lastModified: n.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const materialUrls: MetadataRoute.Sitemap = materials.map((m: any) => ({
      url: `${siteUrl}/materials/${m._id}`,
      lastModified: m.updatedAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    const quizUrls: MetadataRoute.Sitemap = quizzes.map((q: any) => ({
      url: `${siteUrl}/quizzes/${q._id}`,
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
