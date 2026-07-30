import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const { questions } = await req.json();

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ message: 'Please provide an array of question objects.' }, { status: 400 });
    }

    const processedQuestions = questions.map((q: any) => ({
      textEn: q.textEn,
      textUr: q.textUr,
      optionsEn: q.optionsEn,
      optionsUr: q.optionsUr,
      correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : parseInt(q.correctIndex, 10),
      subject: q.subject,
      difficulty: q.difficulty || 'medium',
      explanationEn: q.explanationEn,
      explanationUr: q.explanationUr,
    }));

    await prisma.question.createMany({
      data: processedQuestions
    });

    const createdQuestions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: questions.length
    });

    const questionsWithId = createdQuestions.map(q => ({ ...q, _id: q.id }));
    return NextResponse.json({
      message: `Successfully created ${createdQuestions.length} questions.`,
      count: createdQuestions.length,
      questions: questionsWithId
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
