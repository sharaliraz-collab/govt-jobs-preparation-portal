import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: { questions: true }
    });
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found.' }, { status: 404 });
    }

    const sanitizedQuestions = quiz.questions.map((q: any) => {
      const { correctIndex, explanationEn, explanationUr, ...sanitizedQuestion } = q;
      return { ...sanitizedQuestion, _id: sanitizedQuestion.id };
    });

    const quizObject = {
      ...quiz,
      _id: quiz.id,
      questions: sanitizedQuestions
    };

    return NextResponse.json(quizObject);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const quizExists = await prisma.quiz.findUnique({
      where: { id: params.id }
    });
    if (!quizExists) {
      return NextResponse.json({ message: 'Quiz not found.' }, { status: 404 });
    }

    const body = await req.json();
    const fields = ['titleEn', 'titleUr', 'subject', 'timeLimitMinutes', 'passPercentage'];

    const updateData: any = {};
    fields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    if (body.questions !== undefined) {
      updateData.questions = {
        set: body.questions.map((qid: string) => ({ id: qid }))
      };
    }

    const updatedQuiz = await prisma.quiz.update({
      where: { id: params.id },
      data: updateData,
      include: { questions: true }
    });

    const quizWithIds = {
      ...updatedQuiz,
      _id: updatedQuiz.id,
      questions: updatedQuiz.questions.map(q => ({ ...q, _id: q.id }))
    };

    return NextResponse.json(quizWithIds);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const quizExists = await prisma.quiz.findUnique({
      where: { id: params.id }
    });
    if (!quizExists) {
      return NextResponse.json({ message: 'Quiz not found.' }, { status: 404 });
    }

    await prisma.quizAttempt.deleteMany({
      where: { quizId: params.id }
    });

    await prisma.quiz.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: 'Quiz deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
