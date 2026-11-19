import { prisma } from '@/lib/prisma';
import {
  StreakStats,
  applySessionToStats,
  computeEarnedXP,
  getTodayStrPKT,
  mergeLocalIntoServer,
  statsFromServerRow,
} from '@/lib/practiceStats';
import type { PracticeMode as PrismaPracticeMode } from '@prisma/client';

export async function ensurePracticeStats(userId: string) {
  return prisma.userPracticeStats.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

export async function getOrCreateStreakStats(userId: string): Promise<StreakStats> {
  const row = await ensurePracticeStats(userId);
  return statsFromServerRow(row);
}

export async function persistStreakStats(userId: string, stats: StreakStats, previousBestDaily = 0) {
  const bestDailyStreak = Math.max(previousBestDaily, stats.bestStreak, stats.dailyStreak);
  return prisma.userPracticeStats.upsert({
    where: { userId },
    create: {
      userId,
      dailyStreak: stats.dailyStreak,
      bestDailyStreak,
      lastPracticeDate: stats.lastVisitDate,
      bestAccuracy: stats.bestAccuracy,
      totalXP: stats.totalXP,
      testsCompleted: stats.testsCompleted,
    },
    update: {
      dailyStreak: stats.dailyStreak,
      bestDailyStreak,
      lastPracticeDate: stats.lastVisitDate,
      bestAccuracy: stats.bestAccuracy,
      totalXP: stats.totalXP,
      testsCompleted: stats.testsCompleted,
    },
  });
}

export interface SubjectBreakdownItem {
  subject: string;
  score: number;
  totalQuestions: number;
  percentage?: number;
}

export async function completePracticeSession(
  userId: string,
  body: {
    mode: PrismaPracticeMode;
    subject?: string;
    topicSlug?: string | null;
    score: number;
    totalQuestions: number;
    percentage: number;
    bestRunStreak?: number;
    subjectBreakdown?: SubjectBreakdownItem[];
  }
) {
  const today = getTodayStrPKT();
  const mode = body.mode;
  const score = Math.max(0, Math.floor(body.score));
  const totalQuestions = Math.max(1, Math.floor(body.totalQuestions));
  const percentage =
    typeof body.percentage === 'number' && Number.isFinite(body.percentage)
      ? Math.round(body.percentage)
      : Math.round((score / totalQuestions) * 100);
  const bestRunStreak = Math.max(0, Math.floor(body.bestRunStreak || 0));
  const subject = (body.subject || 'all').slice(0, 120);
  const topicSlug = body.topicSlug || null;
  const validBreakdown = Array.isArray(body.subjectBreakdown)
    ? body.subjectBreakdown
        .filter(
          (item) =>
            item &&
            typeof item.subject === 'string' &&
            item.subject.trim() &&
            Number(item.totalQuestions) > 0
        )
        .slice(0, 10)
    : [];

  // Daily is idempotent per PKT date: update existing row, do not re-award XP/streak.
  if (mode === 'daily') {
    const existing = await prisma.practiceSession.findFirst({
      where: { userId, mode: 'daily', practiceDate: today },
    });
    if (existing) {
      const row = await ensurePracticeStats(userId);
      return {
        alreadyCompleted: true,
        session: existing,
        stats: statsFromServerRow(row),
        today,
      };
    }
  }

  const existingRow = await ensurePracticeStats(userId);
  const prev = statsFromServerRow(existingRow);
  const earnedXP = computeEarnedXP(score, bestRunStreak, percentage);
  const next = applySessionToStats(prev, { accuracy: percentage, bestRunStreak, earnedXP, today });
  const bestDailyStreak = Math.max(existingRow.bestDailyStreak, next.dailyStreak);

  const txOps: any[] = [
    prisma.practiceSession.create({
      data: {
        userId,
        mode,
        subject,
        topicSlug,
        score,
        totalQuestions,
        percentage,
        bestRunStreak,
        practiceDate: today,
      },
    }),
    prisma.userPracticeStats.upsert({
      where: { userId },
      create: {
        userId,
        dailyStreak: next.dailyStreak,
        bestDailyStreak,
        lastPracticeDate: next.lastVisitDate,
        bestAccuracy: next.bestAccuracy,
        totalXP: next.totalXP,
        testsCompleted: next.testsCompleted,
      },
      update: {
        dailyStreak: next.dailyStreak,
        bestDailyStreak,
        lastPracticeDate: next.lastVisitDate,
        bestAccuracy: next.bestAccuracy,
        totalXP: next.totalXP,
        testsCompleted: next.testsCompleted,
      },
    }),
  ];

  // Store per-subject accuracy rows (marked with topicSlug = 'pattern-breakdown')
  // so the user's dashboard immediately identifies weak subjects without inflating test count or XP.
  for (const item of validBreakdown) {
    const sScore = Math.max(0, Math.floor(Number(item.score) || 0));
    const sTotal = Math.max(1, Math.floor(Number(item.totalQuestions) || 1));
    const sPct =
      typeof item.percentage === 'number' && Number.isFinite(item.percentage)
        ? Math.round(item.percentage)
        : Math.round((sScore / sTotal) * 100);
    txOps.push(
      prisma.practiceSession.create({
        data: {
          userId,
          mode,
          subject: item.subject.trim().slice(0, 120),
          topicSlug: 'pattern-breakdown',
          score: sScore,
          totalQuestions: sTotal,
          percentage: sPct,
          bestRunStreak: 0,
          practiceDate: today,
        },
      })
    );
  }

  const [session, row] = await prisma.$transaction(txOps);

  return {
    alreadyCompleted: false,
    session,
    stats: statsFromServerRow(row),
    today,
  };
}

export async function mergeLocalPracticeStats(
  userId: string,
  local: Partial<StreakStats>
) {
  const existingRow = await ensurePracticeStats(userId);
  const server = statsFromServerRow(existingRow);
  const merged = mergeLocalIntoServer(local, server);
  const row = await persistStreakStats(userId, merged, existingRow.bestDailyStreak);
  return statsFromServerRow(row);
}
