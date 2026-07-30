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

    const totalJobs = await prisma.job.count();
    const openJobs = await prisma.job.count({ where: { status: 'open' } });
    const closingSoonJobs = await prisma.job.count({ where: { status: 'closing_soon' } });
    const closedJobs = await prisma.job.count({ where: { status: 'closed' } });

    const totalNews = await prisma.news.count();
    const totalMaterials = await prisma.material.count();
    const totalForms = await prisma.formDoc.count();
    const totalQuestions = await prisma.question.count();
    const totalQuizzes = await prisma.quiz.count();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const quizAttemptsThisWeek = await prisma.quizAttempt.count({
      where: {
        attemptedAt: { gte: sevenDaysAgo }
      }
    });

    const totalQuizAttempts = await prisma.quizAttempt.count();

    return NextResponse.json({
      jobs: {
        total: totalJobs,
        open: openJobs,
        closingSoon: closingSoonJobs,
        closed: closedJobs
      },
      news: totalNews,
      materials: totalMaterials,
      forms: totalForms,
      questions: totalQuestions,
      quizzes: totalQuizzes,
      quizAttempts: {
        total: totalQuizAttempts,
        thisWeek: quizAttemptsThisWeek
      }
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
