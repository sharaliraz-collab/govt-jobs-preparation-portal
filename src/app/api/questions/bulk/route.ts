import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Question from '@/models/Question';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const { questions } = await req.json();

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ message: 'Please provide an array of question objects.' }, { status: 400 });
    }

    const createdQuestions = await Question.insertMany(questions);
    return NextResponse.json({
      message: `Successfully created ${createdQuestions.length} questions.`,
      count: createdQuestions.length,
      questions: createdQuestions
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
