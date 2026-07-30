import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: authUser.id },
      include: {
        quiz: {
          select: {
            id: true,
            titleEn: true,
            titleUr: true,
            subject: true,
            passPercentage: true,
          }
        }
      },
      orderBy: { attemptedAt: 'desc' }
    });

    const attemptsWithIds = attempts.map(attempt => ({
      ...attempt,
      _id: attempt.id,
      userId: attempt.userId,
      quizId: attempt.quizId,
      user: attempt.userId,
      quiz: attempt.quiz ? {
        ...attempt.quiz,
        _id: attempt.quiz.id
      } : null
    }));

    return NextResponse.json(attemptsWithIds);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
