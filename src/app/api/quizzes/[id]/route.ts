import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quiz from '@/models/Quiz';
import Question from '@/models/Question';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const quiz = await Quiz.findById(params.id).populate('questions');
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found.' }, { status: 404 });
    }

    const quizObject = quiz.toObject();

    quizObject.questions = quizObject.questions.filter(Boolean).map((q: any) => {
      const { correctIndex, explanationEn, explanationUr, ...sanitizedQuestion } = q;
      return sanitizedQuestion;
    });

    return NextResponse.json(quizObject);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const quiz = await Quiz.findById(params.id);
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found.' }, { status: 404 });
    }

    const body = await req.json();
    const fields = ['titleEn', 'titleUr', 'subject', 'questions', 'timeLimitMinutes', 'passPercentage'];

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        quiz[field] = body[field];
      }
    });

    const updatedQuiz = await quiz.save();
    return NextResponse.json(updatedQuiz);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const quiz = await Quiz.findById(params.id);
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found.' }, { status: 404 });
    }

    await quiz.deleteOne();
    return NextResponse.json({ message: 'Quiz deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
