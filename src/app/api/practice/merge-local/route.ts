import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { mergeLocalPracticeStats } from '@/lib/practiceServer';
import { StreakStats } from '@/lib/practiceStats';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const local = (body.stats || body || {}) as Partial<StreakStats>;

    const stats = await mergeLocalPracticeStats(authUser.id, {
      dailyStreak: Number(local.dailyStreak) || 0,
      lastVisitDate: typeof local.lastVisitDate === 'string' ? local.lastVisitDate : '',
      bestAccuracy: Number(local.bestAccuracy) || 0,
      bestStreak: Number(local.bestStreak) || 0,
      totalXP: Number(local.totalXP) || 0,
      testsCompleted: Number(local.testsCompleted) || 0,
    });

    return NextResponse.json({ stats });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
