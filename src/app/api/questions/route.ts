import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Question from '@/models/Question';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    const query: any = {};
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { textEn: { $regex: search, $options: 'i' } },
        { textUr: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const questions = await Question.find(query).sort({ createdAt: -1 });
    return NextResponse.json(questions);
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
    const {
      textEn,
      textUr,
      optionsEn,
      optionsUr,
      correctIndex,
      subject,
      difficulty,
      explanationEn,
      explanationUr
    } = body;

    if (!textEn || !textUr || !subject || correctIndex === undefined) {
      return NextResponse.json(
        { message: 'Please provide question texts, subject, and correct option index.' },
        { status: 400 }
      );
    }

    if (!optionsEn || optionsEn.length !== 4 || !optionsUr || optionsUr.length !== 4) {
      return NextResponse.json(
        { message: 'Each question must have exactly 4 options for both English and Urdu.' },
        { status: 400 }
      );
    }

    const question = await Question.create({
      textEn,
      textUr,
      optionsEn,
      optionsUr,
      correctIndex: parseInt(correctIndex, 10),
      subject,
      difficulty: difficulty || 'medium',
      explanationEn,
      explanationUr
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
