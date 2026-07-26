import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quiz from '@/models/Quiz';
import Question from '@/models/Question'; // Ensure Question model registered
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const search = searchParams.get('search');

    const query: any = {};
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (search) {
      query.$or = [
        { titleEn: { $regex: search, $options: 'i' } },
        { titleUr: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const quizzes = await Quiz.find(query)
      .populate('questions', 'subject difficulty')
      .sort({ createdAt: -1 });

    return NextResponse.json(quizzes);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
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

    const quiz = await Quiz.create({
      titleEn,
      titleUr,
      subject,
      questions,
      timeLimitMinutes: timeLimitMinutes ? parseInt(timeLimitMinutes, 10) : 15,
      passPercentage: passPercentage ? parseInt(passPercentage, 10) : 50
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
