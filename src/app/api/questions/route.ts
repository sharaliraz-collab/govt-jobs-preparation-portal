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

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    const where: any = {};
    if (subject) where.subject = { contains: subject, mode: 'insensitive' };
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { textEn: { contains: search, mode: 'insensitive' } },
        { textUr: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } }
      ];
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const questionsWithId = questions.map(q => ({ ...q, _id: q.id }));
    return NextResponse.json(questionsWithId);
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

    const question = await prisma.question.create({
      data: {
        textEn,
        textUr,
        optionsEn,
        optionsUr,
        correctIndex: parseInt(correctIndex, 10),
        subject,
        difficulty: difficulty || 'medium',
        explanationEn,
        explanationUr
      }
    });

    const questionWithId = { ...question, _id: question.id };
    return NextResponse.json(questionWithId, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
