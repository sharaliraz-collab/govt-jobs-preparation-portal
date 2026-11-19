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

  const [session, row] = await prisma.$transaction([
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
  ]);

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
