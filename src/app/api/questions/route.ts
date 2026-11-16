import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const EXACT_SUBJECT_MAP: Record<string, string> = {
  'biology': 'Biology',
  'chemistry': 'Chemistry',
  'physics': 'Physics',
  'islamic studies': 'Islamic Studies',
  'pakistan studies': 'Pakistan Studies',
  'english grammar & composition': 'English Grammar & Composition',
  'english grammar section 1': 'English Grammar Section 1',
  'english grammar section 2': 'English Grammar Section 2',
  'english grammar section 3': 'English Grammar Section 3',
  'world leaders': 'World Leaders',
  'computer science': 'Computer Science',
  'general knowledge': 'General Knowledge',
  'general science': 'General Science',
  'mathematics': 'Mathematics',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    const where: any = {};
    if (subject) {
      const exactMatch = EXACT_SUBJECT_MAP[subject.trim().toLowerCase()];
      where.subject = exactMatch
        ? { equals: exactMatch }
        : { contains: subject, mode: 'insensitive' };
    }
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { textEn: { contains: search, mode: 'insensitive' } },
        { textUr: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } }
      ];
    }

    const isPublicSubjectFeed = Boolean(subject && !search);
    const questions = await prisma.question.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(isPublicSubjectFeed
        ? {
            select: {
              id: true,
              subject: true,
              textEn: true,
              textUr: true,
              optionsEn: true,
              optionsUr: true,
              correctIndex: true,
              explanationEn: true,
              difficulty: true,
              createdAt: true,
            },
          }
        : {}),
    });

    const questionsWithId = questions.map((q) => {
      if (!isPublicSubjectFeed) return { ...q, _id: q.id };
      const hasDistinctUr = Boolean(q.textUr && q.textUr.trim() !== q.textEn.trim());
      return {
        id: q.id,
        _id: q.id,
        subject: q.subject,
        textEn: q.textEn,
        ...(hasDistinctUr ? { textUr: q.textUr, optionsUr: q.optionsUr } : {}),
        optionsEn: q.optionsEn,
        correctIndex: q.correctIndex,
        explanationEn: q.explanationEn,
        difficulty: q.difficulty,
        createdAt: q.createdAt,
      };
    });

    const headers: HeadersInit = isPublicSubjectFeed
      ? { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
      : { 'Cache-Control': 'no-store' };

    return NextResponse.json(questionsWithId, { headers });
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
