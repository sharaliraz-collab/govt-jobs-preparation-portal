'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Flame, Target, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { APTITUDE_TOPICS } from '@/data/aptitudeTopics';
import {
  findLocalUnfinishedAptitude,
  loadLocalStreakStats,
  StreakStats,
  DEFAULT_STREAK_STATS,
  getTodayStrPKT,
} from '@/lib/practiceStats';

interface UnfinishedTopic {
  slug: string;
  title: string;
  answered: number;
  total: number;
}

export default function HabitStrip() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<StreakStats>(DEFAULT_STREAK_STATS);
  const [dailyDone, setDailyDone] = useState(false);
  const [continueTopic, setContinueTopic] = useState<UnfinishedTopic | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const local = loadLocalStreakStats();
    setStats(local);
    const unfinished = findLocalUnfinishedAptitude(APTITUDE_TOPICS);
    if (unfinished[0]) setContinueTopic(unfinished[0]);

    if (local.lastVisitDate === getTodayStrPKT() && local.testsCompleted > 0) {
      // optimistic; server confirms for logged-in users
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get('/api/practice/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        if (res.data?.stats) {
          setStats({
            dailyStreak: res.data.stats.dailyStreak ?? 0,
            lastVisitDate: res.data.stats.lastVisitDate ?? '',
            bestAccuracy: res.data.stats.bestAccuracy ?? 0,
            bestStreak: res.data.stats.bestStreak ?? res.data.stats.bestDailyStreak ?? 0,
            totalXP: res.data.stats.totalXP ?? 0,
            testsCompleted: res.data.stats.testsCompleted ?? 0,
          });
        }
        setDailyDone(Boolean(res.data?.dailyCompletedToday));
        const unfinished = res.data?.unfinishedAptitude as UnfinishedTopic[] | undefined;
        if (unfinished && unfinished.length > 0) {
          setContinueTopic(unfinished[0]);
        }
      } catch {
        /* keep local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const showSignInNudge = useMemo(
    () => hydrated && !user && stats.dailyStreak > 0,
    [hydrated, user, stats.dailyStreak]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-1.5 text-emerald-300 font-medium">
          <Flame className="w-4 h-4" aria-hidden />
          {stats.dailyStreak > 0 ? `${stats.dailyStreak}-day streak` : 'Start a streak today'}
        </span>
        {stats.bestAccuracy > 0 && (
          <span className="inline-flex items-center gap-1.5 text-slate-300">
            <Target className="w-4 h-4" aria-hidden />
            Best accuracy {stats.bestAccuracy}%
          </span>
        )}
        {stats.totalXP > 0 && (
          <span className="text-slate-400 tabular-nums">{stats.totalXP} XP</span>
        )}
      </div>

      <p className="text-sm text-slate-300 leading-relaxed max-w-md">
        {user
          ? 'Your streak and progress sync across devices when you are signed in.'
          : 'Practice free without an account. Sign in to keep your streak when you change devices.'}
      </p>

      <ul className="space-y-0">
        <li className="border-t border-white/10">
          <Link
            href="/quizzes/random-test?mode=daily"
            className="group flex items-baseline justify-between gap-4 py-3.5"
          >
            <span className="text-[15px] font-medium text-white group-hover:text-emerald-300 transition-colors">
              {dailyDone ? 'Today’s challenge — done' : 'Today’s challenge'}
            </span>
            <span className="text-[12px] text-slate-400 text-right">
              {dailyDone ? 'Come back tomorrow' : 'Same set for everyone · resets daily'}
            </span>
          </Link>
        </li>
        <li className="border-t border-white/10">
          <Link
            href="/quizzes/random-test"
            className="group flex items-baseline justify-between gap-4 py-3.5"
          >
            <span className="text-[15px] font-medium text-white group-hover:text-emerald-300 transition-colors">
              Random mixed test
            </span>
            <span className="text-[12px] text-slate-400 text-right">Choose subject and length</span>
          </Link>
        </li>
        {continueTopic ? (
          <li className="border-t border-b border-white/10">
            <Link
              href={`/quizzes/aptitude/${continueTopic.slug}`}
              className="group flex items-baseline justify-between gap-4 py-3.5"
            >
              <span className="text-[15px] font-medium text-white group-hover:text-emerald-300 transition-colors">
                Continue aptitude — {continueTopic.title}
              </span>
              <span className="text-[12px] text-slate-400 text-right tabular-nums">
                {continueTopic.answered}/{continueTopic.total}
                <ArrowRight className="inline w-3.5 h-3.5 ml-1 opacity-70" aria-hidden />
              </span>
            </Link>
          </li>
        ) : (
          <li className="border-t border-b border-white/10">
            <Link
              href="/quizzes/random-test?mode=interesting"
              className="group flex items-baseline justify-between gap-4 py-3.5"
            >
              <span className="text-[15px] font-medium text-white group-hover:text-emerald-300 transition-colors">
                Interesting facts quiz
              </span>
              <span className="text-[12px] text-slate-400 text-right">Curated questions with notes</span>
            </Link>
          </li>
        )}
      </ul>

      {showSignInNudge && (
        <p className="text-[13px] text-amber-200/90">
          You have a {stats.dailyStreak}-day streak on this device.{' '}
          <Link href="/login" className="underline underline-offset-4 hover:text-amber-100">
            Sign in to save it across devices
          </Link>
          .
        </p>
      )}
    </div>
  );
}
