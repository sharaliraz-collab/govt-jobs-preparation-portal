import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { APTITUDE_TOPICS } from '@/data/aptitudeTopics';
import { getTodayStrPKT, statsFromServerRow } from '@/lib/practiceStats';
import { ensurePracticeStats } from '@/lib/practiceServer';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const today = getTodayStrPKT();
    const row = await ensurePracticeStats(authUser.id);

    const [recentSessions, dailyToday, aptitudeRows, recentForWeak] = await Promise.all([
      prisma.practiceSession.findMany({
        where: {
          userId: authUser.id,
          OR: [{ topicSlug: null }, { topicSlug: { not: 'pattern-breakdown' } }],
        },
        orderBy: { completedAt: 'desc' },
        take: 6,
      }),
      prisma.practiceSession.findFirst({
        where: { userId: authUser.id, mode: 'daily', practiceDate: today },
        select: { id: true, percentage: true, score: true, totalQuestions: true },
      }),
      prisma.aptitudeProgress.findMany({
        where: { userId: authUser.id },
      }),
      prisma.practiceSession.findMany({
        where: { userId: authUser.id },
        orderBy: { completedAt: 'desc' },
        take: 48,
        select: { subject: true, percentage: true },
      }),
    ]);

    const bySubject = new Map<string, { sum: number; n: number }>();
    for (const s of recentForWeak) {
      const subject = (s.subject || 'all').trim() || 'all';
      if (subject === 'all' || subject.startsWith('Screening Test')) continue;
      const cur = bySubject.get(subject) || { sum: 0, n: 0 };
      cur.sum += s.percentage;
      cur.n += 1;
      bySubject.set(subject, cur);
    }
    const weakSubjects = Array.from(bySubject.entries())
      .map(([subject, v]) => ({
        subject,
        avgPercentage: Math.round(v.sum / v.n),
        attempts: v.n,
      }))
      .sort((a, b) => a.avgPercentage - b.avgPercentage)
      .slice(0, 3);

    const topicBySlug = new Map(APTITUDE_TOPICS.map((t) => [t.slug, t]));
    const unfinishedAptitude = aptitudeRows
      .map((prog) => {
        const topic = topicBySlug.get(prog.topicSlug);
        if (!topic) return null;
        const answers =
          prog.answers && typeof prog.answers === 'object' && !Array.isArray(prog.answers)
            ? (prog.answers as Record<string, number>)
            : {};
        const answered = Object.keys(answers).length;
        if (answered <= 0 || answered >= topic.count) return null;
        return {
          slug: topic.slug,
          title: topic.title,
          answered,
          total: topic.count,
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      stats: {
        ...statsFromServerRow(row),
        bestDailyStreak: row.bestDailyStreak,
      },
      dailyCompletedToday: Boolean(dailyToday),
      dailyToday: dailyToday || null,
      recentSessions,
      weakSubjects,
      unfinishedAptitude,
      today,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
