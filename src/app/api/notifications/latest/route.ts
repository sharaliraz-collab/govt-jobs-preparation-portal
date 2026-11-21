import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getTodayStrPKT } from '@/lib/practiceStats';

export const dynamic = 'force-dynamic';

export interface PortalNotificationItem {
  id: string;
  type: 'job' | 'news' | 'daily' | 'tool';
  badge: string;
  title: string;
  body: string;
  url: string;
  createdAt: string;
}

export async function GET() {
  const todayPkt = getTodayStrPKT();
  const items: PortalNotificationItem[] = [];

  // Always include Today's Daily Challenge (rotates automatically every PKT day)
  items.push({
    id: `daily-challenge-${todayPkt}`,
    type: 'daily',
    badge: 'Daily Quiz',
    title: `Today's MCQ Challenge Ready (${todayPkt})`,
    body: 'Keep your daily preparation streak alive with 10 fresh cross-subject screening MCQs.',
    url: '/quizzes/random-test?mode=daily',
    createdAt: new Date().toISOString(),
  });

  // Featured Official Tool Alert
  items.push({
    id: 'tool-pension-papers-16a4-v1',
    type: 'tool',
    badge: 'New Tool',
    title: 'Pension Papers — Fill Once & Print All 16 Official A4 Sheets',
    body: 'Auto-calculate qualifying service, commutation in figures & words, 8 D.D.O certificates & A.T.C.5 LPC.',
    url: '/forms/pension-papers',
    createdAt: '2026-11-21T04:00:00.000Z',
  });

  try {
    const [latestJobs, latestNews] = await Promise.all([
      prisma.job.findMany({
        orderBy: { createdAt: 'desc' },
        take: 4,
        select: {
          id: true,
          titleEn: true,
          department: true,
          location: true,
          deadline: true,
          createdAt: true,
        },
      }),
      prisma.news.findMany({
        orderBy: { createdAt: 'desc' },
        take: 4,
        select: {
          id: true,
          titleEn: true,
          category: true,
          createdAt: true,
        },
      }),
    ]);

    for (const job of latestJobs) {
      const deadlineStr = job.deadline
        ? new Date(job.deadline).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : '';
      items.push({
        id: `job-${job.id}`,
        type: 'job',
        badge: 'Govt Job',
        title: job.titleEn,
        body: `${job.department}${job.location ? ` · ${job.location}` : ''}${
          deadlineStr ? ` · Last date: ${deadlineStr}` : ''
        }`,
        url: `/jobs/${job.id}`,
        createdAt: job.createdAt.toISOString(),
      });
    }

    for (const news of latestNews) {
      items.push({
        id: `news-${news.id}`,
        type: 'news',
        badge: news.category || 'Update',
        title: news.titleEn,
        body: 'Official government exam & recruitment notification on GovtJobs.pk.',
        url: `/news/${news.id}`,
        createdAt: news.createdAt.toISOString(),
      });
    }
  } catch {
    /* Return built-in daily & tool items gracefully if DB is busy */
  }

  return NextResponse.json(
    {
      today: todayPkt,
      notifications: items.slice(0, 10),
    },
    { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' } }
  );
}
