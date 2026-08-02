import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const totalViews = await prisma.pageViewLog.count();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayViews = await prisma.pageViewLog.count({
      where: { createdAt: { gte: startOfToday } },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weekViews = await prisma.pageViewLog.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthViews = await prisma.pageViewLog.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    // Top 10 Most Visited Pages
    const topPagesGroup = await prisma.pageViewLog.groupBy({
      by: ['path'],
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 12,
    });

    const topPages = topPagesGroup.map(item => ({
      path: item.path,
      views: item._count.path,
    }));

    // Recent 15 page visits
    const recentVisits = await prisma.pageViewLog.findMany({
      take: 15,
      orderBy: { createdAt: 'desc' },
      select: { id: true, path: true, title: true, createdAt: true },
    });

    // Sum of viewsCount for News, Jobs, Materials, Forms, EmployeePosts
    const [newsAggregate, jobsAggregate, materialsAggregate, formsAggregate, employeePostsAggregate] = await Promise.all([
      prisma.news.aggregate({ _sum: { viewsCount: true } }),
      prisma.job.aggregate({ _sum: { viewsCount: true } }),
      prisma.material.aggregate({ _sum: { viewsCount: true } }),
      prisma.formDoc.aggregate({ _sum: { viewsCount: true } }),
      prisma.employeePost.aggregate({ _sum: { viewsCount: true } }),
    ]);

    return NextResponse.json({
      traffic: {
        total: totalViews,
        today: todayViews,
        thisWeek: weekViews,
        thisMonth: monthViews,
      },
      itemViewsSum: {
        news: newsAggregate._sum.viewsCount || 0,
        jobs: jobsAggregate._sum.viewsCount || 0,
        materials: materialsAggregate._sum.viewsCount || 0,
        forms: formsAggregate._sum.viewsCount || 0,
        employeePosts: employeePostsAggregate._sum.viewsCount || 0,
      },
      topPages,
      recentVisits,
      googleAnalyticsStreamId: 'G-NM8DWGLJZM',
    });
  } catch (error: any) {
    console.error('Error fetching admin analytics:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
