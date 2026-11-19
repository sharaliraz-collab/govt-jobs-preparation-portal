import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { completePracticeSession } from '@/lib/practiceServer';
import type { PracticeMode } from '@prisma/client';

export const dynamic = 'force-dynamic';

const VALID_MODES: PracticeMode[] = ['daily', 'random', 'interesting', 'aptitude'];

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();
    const mode = body.mode as PracticeMode;
    if (!VALID_MODES.includes(mode)) {
      return NextResponse.json({ message: 'Invalid mode' }, { status: 400 });
    }

    const score = Number(body.score);
    const totalQuestions = Number(body.totalQuestions);
    if (!Number.isFinite(score) || !Number.isFinite(totalQuestions) || totalQuestions < 1) {
      return NextResponse.json({ message: 'Invalid score or totalQuestions' }, { status: 400 });
    }

    const result = await completePracticeSession(authUser.id, {
      mode,
      subject: typeof body.subject === 'string' ? body.subject : 'all',
      topicSlug: typeof body.topicSlug === 'string' ? body.topicSlug : null,
      score,
      totalQuestions,
      percentage: Number(body.percentage),
      bestRunStreak: Number(body.bestRunStreak) || 0,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
