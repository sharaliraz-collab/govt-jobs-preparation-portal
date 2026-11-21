'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { APTITUDE_TOPICS } from '@/data/aptitudeTopics';
import {
  DEFAULT_STREAK_STATS,
  StreakStats,
  findLocalUnfinishedAptitude,
  loadLocalStreakStats,
} from '@/lib/practiceStats';

interface WeakSubject {
  subject: string;
  avgPercentage: number;
  attempts: number;
}

interface UnfinishedAptitude {
  slug: string;
  title: string;
  answered: number;
  total: number;
}

const SUBJECT_HREF: Record<string, string> = {
  'General Science': '/quizzes/subject/general-science',
  'Islamic Studies': '/quizzes/islamic-studies',
  Biology: '/quizzes/biology',
  Chemistry: '/quizzes/subject/chemistry',
  Physics: '/quizzes/physics',
  'Pakistan Studies': '/quizzes/pak-studies',
  'English Grammar': '/quizzes/english-grammar',
  'World GK': '/quizzes/world-info',
  Aptitude: '/quizzes/aptitude',
};

const HIDE_KEY = 'govtjobs_retention_bar_collapsed_v1';

export default function UserRetentionBar() {
  const pathname = usePathname() || '';
  const { user, token } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState<StreakStats>(DEFAULT_STREAK_STATS);
  const [dailyDone, setDailyDone] = useState(false);
  const [weakSubject, setWeakSubject] = useState<WeakSubject | null>(null);
  const [unfinishedApt, setUnfinishedApt] = useState<UnfinishedAptitude | null>(null);
  const [pensionDraftName, setPensionDraftName] = useState<string>('');
  const [savedJobsCount, setSavedJobsCount] = useState<number>(0);

  // Refresh local browser progress on route changes so data stays live everywhere
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setCollapsed(window.sessionStorage.getItem(HIDE_KEY) === '1');
    setStats(loadLocalStreakStats());

    const localUnfinished = findLocalUnfinishedAptitude(APTITUDE_TOPICS);
    setUnfinishedApt(localUnfinished[0] || null);

    try {
      const rawDraft =
        window.localStorage.getItem('govtjobs_pension_draft_v2') ||
        window.localStorage.getItem('pen');
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft);
        setPensionDraftName((parsed?.name || '').trim());
      } else {
        setPensionDraftName('');
      }
    } catch {
      setPensionDraftName('');
    }
  }, [pathname]);

  // Sync live server practice stats & saved jobs when logged in
  useEffect(() => {
    if (!user) {
      setSavedJobsCount(0);
      setWeakSubject(null);
      setDailyDone(false);
      return;
    }
    setSavedJobsCount(Array.isArray(user.savedJobs) ? user.savedJobs.length : 0);

    if (!token) return;
    let cancelled = false;
    axios
      .get('/api/practice/stats', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 6000,
      })
      .then((res) => {
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
        if (Array.isArray(res.data?.weakSubjects) && res.data.weakSubjects[0]) {
          setWeakSubject(res.data.weakSubjects[0]);
        }
        if (Array.isArray(res.data?.unfinishedAptitude) && res.data.unfinishedAptitude[0]) {
          setUnfinishedApt(res.data.unfinishedAptitude[0]);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [user, token, pathname]);

  // Hide on admin & inside Pension Papers studio (studio has its own full live calc bar)
  if (pathname.startsWith('/admin') || pathname.startsWith('/forms/pension-papers')) {
    return null;
  }

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      window.sessionStorage.setItem(HIDE_KEY, next ? '1' : '0');
    } catch {
      /* ignore */
    }
  };

  if (collapsed) {
    return (
      <div className="print:hidden bg-sky-50/70 border-b border-sky-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1 flex items-center justify-between text-[11px] text-sky-900">
          <span className="font-medium truncate">
            {user ? `${user.name} · ` : ''}
            {stats.dailyStreak}d streak · {stats.totalXP} XP · {stats.bestAccuracy}% best
          </span>
          <button
            type="button"
            onClick={toggleCollapse}
            className="text-sky-800 hover:text-sky-950 font-semibold underline underline-offset-2 shrink-0 ml-3"
          >
            Show My Dashboard Bar
          </button>
        </div>
      </div>
    );
  }

  const focusHref = weakSubject
    ? SUBJECT_HREF[weakSubject.subject] ||
      `/quizzes/random-test?subject=${encodeURIComponent(weakSubject.subject)}`
    : '/quizzes/screening-test';

  return (
    <div className="print:hidden bg-sky-50/80 border-b border-sky-200/80 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap text-[11.5px]">
          {/* User Identity or Guest Label */}
          {user ? (
            <Link
              href="/my-account"
              className="px-2.5 py-0.5 rounded-full bg-sky-700 text-white font-semibold hover:bg-sky-800 transition-colors shrink-0"
            >
              {user.name}
            </Link>
          ) : (
            <Link
              href="/register"
              className="px-2.5 py-0.5 rounded-full bg-sky-700 text-white font-semibold hover:bg-sky-800 transition-colors shrink-0"
            >
              Save Progress Free
            </Link>
          )}

          {/* Always-visible live metrics */}
          <Link
            href={user ? '/my-account' : '/quizzes/screening-test'}
            className="px-2 py-0.5 rounded-md bg-white border border-sky-200/90 text-sky-950 font-medium tabular-nums hover:border-sky-400 transition-colors shrink-0"
          >
            Streak: <b>{stats.dailyStreak}d</b>
          </Link>
          <span className="px-2 py-0.5 rounded-md bg-white border border-sky-200/90 text-slate-800 font-medium tabular-nums shrink-0">
            XP: <b>{stats.totalXP}</b>
          </span>
          {stats.bestAccuracy > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-white border border-sky-200/90 text-emerald-800 font-medium tabular-nums shrink-0">
              Best: <b>{stats.bestAccuracy}%</b>
            </span>
          )}
          {user && savedJobsCount > 0 && (
            <Link
              href="/my-account"
              className="px-2 py-0.5 rounded-md bg-white border border-sky-200/90 text-sky-900 font-medium tabular-nums hover:border-sky-400 shrink-0"
            >
              Saved Jobs: <b>{savedJobsCount}</b>
            </Link>
          )}

          {/* Contextual Continue / Action Chips */}
          {pensionDraftName && (
            <Link
              href="/forms/pension-papers"
              className="px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-300 text-amber-950 font-semibold hover:bg-amber-100 transition-colors shrink-0"
            >
              Resume Pension Draft: {pensionDraftName.slice(0, 18)} →
            </Link>
          )}

          {weakSubject ? (
            <Link
              href={focusHref}
              className="px-2.5 py-0.5 rounded-md bg-white border border-rose-200 text-rose-800 font-medium hover:border-rose-400 transition-colors shrink-0"
            >
              Weak Focus: {weakSubject.subject} ({weakSubject.avgPercentage}%) →
            </Link>
          ) : unfinishedApt ? (
            <Link
              href={`/quizzes/aptitude/${unfinishedApt.slug}`}
              className="px-2.5 py-0.5 rounded-md bg-white border border-sky-200 text-sky-900 font-medium hover:border-sky-400 transition-colors shrink-0"
            >
              Continue {unfinishedApt.title} ({unfinishedApt.answered}/{unfinishedApt.total}) →
            </Link>
          ) : (
            <Link
              href="/quizzes/screening-test"
              className="px-2.5 py-0.5 rounded-md bg-white border border-sky-200 text-sky-900 font-medium hover:border-sky-400 transition-colors shrink-0"
            >
              20-of-100 Screening Test →
            </Link>
          )}

          <Link
            href="/quizzes/random-test?mode=daily"
            className={`px-2.5 py-0.5 rounded-md border font-medium transition-colors shrink-0 ${
              dailyDone
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-sky-100/90 border-sky-300 text-sky-950 hover:bg-sky-200/80'
            }`}
          >
            {dailyDone ? 'Daily Challenge Done' : "Today's Challenge →"}
          </Link>
        </div>

        <button
          type="button"
          onClick={toggleCollapse}
          aria-label="Hide user progress bar"
          className="text-[10.5px] text-sky-800/80 hover:text-sky-950 font-medium shrink-0"
        >
          Hide
        </button>
      </div>
    </div>
  );
}
