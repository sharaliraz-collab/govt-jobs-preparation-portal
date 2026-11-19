/** Shared practice streak helpers (Asia/Karachi calendar days). */

export const PRACTICE_STATS_STORAGE_KEY = 'pak_prep_random_stats_v1';
export const APT_PROGRESS_PREFIX = 'apt-progress:';

export type PracticeMode = 'daily' | 'random' | 'interesting' | 'aptitude';

export interface StreakStats {
  dailyStreak: number;
  lastVisitDate: string;
  bestAccuracy: number;
  bestStreak: number;
  totalXP: number;
  testsCompleted: number;
}

export const DEFAULT_STREAK_STATS: StreakStats = {
  dailyStreak: 0,
  lastVisitDate: '',
  bestAccuracy: 0,
  bestStreak: 0,
  totalXP: 0,
  testsCompleted: 0,
};

/** YYYY-MM-DD in Asia/Karachi */
export function getTodayStrPKT(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function getYesterdayStrPKT(now = new Date()): string {
  // Shift by ~1 day in UTC then format in PKT can be wrong near midnight;
  // instead subtract one calendar day from today's PKT string.
  const today = getTodayStrPKT(now);
  const [y, m, d] = today.split('-').map(Number);
  const utcNoon = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  utcNoon.setUTCDate(utcNoon.getUTCDate() - 1);
  const yy = utcNoon.getUTCFullYear();
  const mm = String(utcNoon.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utcNoon.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export function computeNextDailyStreak(
  prevStreak: number,
  lastPracticeDate: string,
  today = getTodayStrPKT(),
  yesterday = getYesterdayStrPKT()
): number {
  if (lastPracticeDate === today) {
    return Math.max(1, prevStreak || 1);
  }
  if (lastPracticeDate === yesterday) {
    return (prevStreak || 0) + 1;
  }
  return 1;
}

export function computeEarnedXP(
  correctCount: number,
  bestRunStreak: number,
  accuracy: number
): number {
  return correctCount * 10 + bestRunStreak * 5 + (accuracy >= 80 ? 25 : 0);
}

export function applySessionToStats(
  prev: StreakStats,
  opts: {
    accuracy: number;
    bestRunStreak: number;
    earnedXP: number;
    today?: string;
  }
): StreakStats {
  const today = opts.today ?? getTodayStrPKT();
  const yesterday = getYesterdayStrPKT();
  const nextDaily = computeNextDailyStreak(prev.dailyStreak, prev.lastVisitDate, today, yesterday);

  return {
    dailyStreak: nextDaily,
    lastVisitDate: today,
    bestAccuracy: Math.max(prev.bestAccuracy, opts.accuracy),
    bestStreak: Math.max(prev.bestStreak, opts.bestRunStreak, nextDaily),
    totalXP: prev.totalXP + opts.earnedXP,
    testsCompleted: prev.testsCompleted + 1,
  };
}

/** Merge guest localStorage stats into server stats (max of counters; newer date wins). */
export function mergeLocalIntoServer(
  local: Partial<StreakStats>,
  server: StreakStats
): StreakStats {
  const localDate = local.lastVisitDate || '';
  const serverDate = server.lastVisitDate || '';
  const newerDate =
    !localDate ? serverDate : !serverDate ? localDate : localDate >= serverDate ? localDate : serverDate;

  // Prefer the streak that belongs to the newer practice date; otherwise take max.
  let dailyStreak = Math.max(local.dailyStreak ?? 0, server.dailyStreak);
  if (localDate && serverDate && localDate !== serverDate) {
    dailyStreak = localDate > serverDate ? (local.dailyStreak ?? 0) : server.dailyStreak;
  }

  return {
    dailyStreak,
    lastVisitDate: newerDate,
    bestAccuracy: Math.max(local.bestAccuracy ?? 0, server.bestAccuracy),
    bestStreak: Math.max(local.bestStreak ?? 0, server.bestStreak, dailyStreak),
    totalXP: Math.max(local.totalXP ?? 0, server.totalXP),
    testsCompleted: Math.max(local.testsCompleted ?? 0, server.testsCompleted),
  };
}

export function loadLocalStreakStats(): StreakStats {
  if (typeof window === 'undefined') return { ...DEFAULT_STREAK_STATS };
  try {
    const raw = window.localStorage.getItem(PRACTICE_STATS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STREAK_STATS };
    return { ...DEFAULT_STREAK_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STREAK_STATS };
  }
}

export function saveLocalStreakStats(next: StreakStats): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PRACTICE_STATS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function statsFromServerRow(row: {
  dailyStreak: number;
  bestDailyStreak: number;
  lastPracticeDate: string;
  bestAccuracy: number;
  totalXP: number;
  testsCompleted: number;
}): StreakStats {
  return {
    dailyStreak: row.dailyStreak,
    lastVisitDate: row.lastPracticeDate,
    bestAccuracy: row.bestAccuracy,
    bestStreak: row.bestDailyStreak,
    totalXP: row.totalXP,
    testsCompleted: row.testsCompleted,
  };
}

/** Scan local apt-progress:* keys for topics with any answers but not finished. */
export function findLocalUnfinishedAptitude(
  topics: { slug: string; title: string; count: number }[]
): { slug: string; title: string; answered: number; total: number }[] {
  if (typeof window === 'undefined') return [];
  const out: { slug: string; title: string; answered: number; total: number }[] = [];
  for (const t of topics) {
    try {
      const raw = window.localStorage.getItem(`${APT_PROGRESS_PREFIX}${t.slug}`);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as { answers?: Record<string, number> };
      const answered = Object.keys(parsed.answers || {}).length;
      if (answered > 0 && answered < t.count) {
        out.push({ slug: t.slug, title: t.title, answered, total: t.count });
      }
    } catch {
      /* skip */
    }
  }
  return out;
}
