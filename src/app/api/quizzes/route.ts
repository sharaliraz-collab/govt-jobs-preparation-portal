import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const search = searchParams.get('search');

    const where: any = {};
    if (subject) where.subject = { contains: subject, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { titleEn: { contains: search, mode: 'insensitive' } },
        { titleUr: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } }
      ];
    }

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        questions: {
          select: {
            id: true,
            subject: true,
            difficulty: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const quizzesWithIds = quizzes.map(quiz => ({
      ...quiz,
      _id: quiz.id,
      questions: quiz.questions.map(q => ({ ...q, _id: q.id }))
    }));

    return NextResponse.json(quizzesWithIds);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const body = await req.json();
    const { titleEn, titleUr, subject, questions, timeLimitMinutes, passPercentage } = body;

    if (!titleEn || !titleUr || !subject || !questions || questions.length === 0) {
      return NextResponse.json(
        { message: 'Please provide title (EN/UR), subject, and at least 1 question ID.' },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.create({
      data: {
        titleEn,
        titleUr,
        subject,
        questions: {
          connect: questions.map((qid: string) => ({ id: qid }))
        },
        timeLimitMinutes: timeLimitMinutes ? parseInt(timeLimitMinutes, 10) : 15,
        passPercentage: passPercentage ? parseInt(passPercentage, 10) : 50
      },
      include: {
        questions: true
      }
    });

    const quizWithIds = {
      ...quiz,
      _id: quiz.id,
      questions: quiz.questions.map(q => ({ ...q, _id: q.id }))
    };

    return NextResponse.json(quizWithIds, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
