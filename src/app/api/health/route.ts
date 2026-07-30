import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [jobCount, questionCount, userCount] = await Promise.all([
      prisma.job.count(),
      prisma.question.count(),
      prisma.user.count()
    ]);

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      neonPostgres: true,
      dataCounts: {
        jobs: jobCount,
        questions: questionCount,
        users: userCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: error.message || 'Failed to connect to database',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
