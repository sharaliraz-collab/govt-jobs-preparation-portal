import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, title } = body || {};

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ message: 'Path is required' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent') || undefined;

    // Log the page view in PageViewLog table
    await prisma.pageViewLog.create({
      data: {
        path,
        title: title || path,
        userAgent: userAgent ? userAgent.substring(0, 255) : undefined,
      },
    });

    // Extract entity ID and update item view count if matching specific routes
    // e.g. /news/[id], /jobs/[id], /materials/[id], /forms/[id]
    const newsMatch = path.match(/^\/news\/([a-zA-Z0-9-]+)$/);
    if (newsMatch && newsMatch[1]) {
      await prisma.news.updateMany({
        where: { id: newsMatch[1] },
        data: { viewsCount: { increment: 1 } },
      });
    }

    const jobMatch = path.match(/^\/jobs\/([a-zA-Z0-9-]+)$/);
    if (jobMatch && jobMatch[1]) {
      await prisma.job.updateMany({
        where: { id: jobMatch[1] },
        data: { viewsCount: { increment: 1 } },
      });
    }

    const materialMatch = path.match(/^\/materials\/([a-zA-Z0-9-]+)$/);
    if (materialMatch && materialMatch[1]) {
      await prisma.material.updateMany({
        where: { id: materialMatch[1] },
        data: { viewsCount: { increment: 1 } },
      });
    }

    const formMatch = path.match(/^\/forms\/([a-zA-Z0-9-]+)$/);
    if (formMatch && formMatch[1]) {
      await prisma.formDoc.updateMany({
        where: { id: formMatch[1] },
        data: { viewsCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Fail gracefully so client tracking never errors out
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
