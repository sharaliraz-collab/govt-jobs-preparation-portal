'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import JobCard from '@/components/JobCard';
import Loader from '@/components/Loader';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  Bookmark,
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  Flame,
  Trophy,
  Zap,
  Target,
  ArrowRight,
} from 'lucide-react';
import { IJob } from '@/lib/types';
import { StreakStats, DEFAULT_STREAK_STATS } from '@/lib/practiceStats';

interface PracticeSessionRow {
  id: string;
  mode: string;
  subject: string;
  topicSlug?: string | null;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

interface WeakSubject {
  subject: string;
  avgPercentage: number;
  attempts: number;
}

interface UnfinishedTopic {
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

export default function MyAccountPage() {
  const { t, i18n } = useTranslation();
  const { user, token } = useAuth();
  const isUr = i18n.language === 'ur';

  const [savedJobs, setSavedJobs] = useState<IJob[]>([]);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'saved' | 'history'>('saved');

  const [stats, setStats] = useState<StreakStats & { bestDailyStreak?: number }>(DEFAULT_STREAK_STATS);
  const [dailyDone, setDailyDone] = useState(false);
  const [recentSessions, setRecentSessions] = useState<PracticeSessionRow[]>([]);
  const [weakSubjects, setWeakSubjects] = useState<WeakSubject[]>([]);
  const [continueTopic, setContinueTopic] = useState<UnfinishedTopic | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const [meRes, historyRes, practiceRes] = await Promise.all([
          axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/quizzes/history/my', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/practice/stats', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setSavedJobs(meRes.data.savedJobs || []);
        setQuizHistory(historyRes.data || []);

        if (practiceRes.data?.stats) {
          setStats({
            dailyStreak: practiceRes.data.stats.dailyStreak ?? 0,
            lastVisitDate: practiceRes.data.stats.lastVisitDate ?? '',
            bestAccuracy: practiceRes.data.stats.bestAccuracy ?? 0,
            bestStreak: practiceRes.data.stats.bestStreak ?? 0,
            totalXP: practiceRes.data.stats.totalXP ?? 0,
            testsCompleted: practiceRes.data.stats.testsCompleted ?? 0,
            bestDailyStreak: practiceRes.data.stats.bestDailyStreak ?? 0,
          });
        }
        setDailyDone(Boolean(practiceRes.data?.dailyCompletedToday));
        setRecentSessions(practiceRes.data?.recentSessions || []);
        setWeakSubjects(practiceRes.data?.weakSubjects || []);
        const unfinished = practiceRes.data?.unfinishedAptitude as UnfinishedTopic[] | undefined;
        setContinueTopic(unfinished?.[0] || null);
      } catch (err) {
        console.error('Error fetching account data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSavedJobRemove = (jobId: string) => {
    setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
  };

  const recommended = weakSubjects[0];
  const recommendedHref = recommended
    ? SUBJECT_HREF[recommended.subject] || `/quizzes/random-test?subject=${encodeURIComponent(recommended.subject)}`
    : '/quizzes';

  const bestDaily = stats.bestDailyStreak ?? stats.bestStreak;

  return (
    <ProtectedRoute>
      <div className="bg-white text-slate-900 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
          <header className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Prep dashboard</p>
              <h1 className={`mt-2 text-2xl sm:text-[1.7rem] font-semibold tracking-tight text-slate-900 ${isUr ? 'font-urdu' : ''}`}>
                {t('nav.myAccount')}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Welcome back, <span className="font-medium text-slate-800">{user?.name}</span>
              </p>
            </div>
            <Link
              href="/quizzes/screening-test"
              className="shrink-0 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              Take Full 100-MCQ Screening Test →
            </Link>
          </header>

          {loading ? (
            <Loader />
          ) : (
            <>
              {/* Stats */}
              <section aria-label="Practice stats">
                <div className="grid grid-cols-2 sm:grid-cols-5 border-t border-l border-slate-200">
                  {[
                    { label: 'Current streak', value: `${stats.dailyStreak}`, icon: Flame },
                    { label: 'Best streak', value: `${bestDaily}`, icon: Trophy },
                    { label: 'XP', value: `${stats.totalXP}`, icon: Zap },
                    { label: 'Tests done', value: `${stats.testsCompleted}`, icon: Award },
                    { label: 'Best accuracy', value: `${stats.bestAccuracy}%`, icon: Target },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="border-r border-b border-slate-200 px-4 py-5 flex flex-col-reverse"
                    >
                      <dt className="mt-2 text-[12px] text-slate-500 flex items-center gap-1.5">
                        <card.icon className="w-3.5 h-3.5 text-emerald-700" aria-hidden />
                        {card.label}
                      </dt>
                      <dd className="text-xl font-semibold tracking-tight text-slate-900 tabular-nums leading-none">
                        {card.value}
                      </dd>
                    </div>
                  ))}
                </div>
              </section>

              {/* Next up */}
              <section aria-label="Next up" className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">Next up</h2>
                <div className="grid sm:grid-cols-3 border-t border-l border-slate-200">
                  <Link
                    href="/quizzes/random-test?mode=daily"
                    className="group border-r border-b border-slate-200 p-5 hover:bg-slate-50/80 transition-colors"
                  >
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400 font-medium">Daily</p>
                    <p className="mt-2 text-[15px] font-semibold text-slate-900 group-hover:text-emerald-800">
                      {dailyDone ? 'Challenge done today' : 'Today’s challenge'}
                    </p>
                    <p className="mt-1 text-[13px] text-slate-500">
                      {dailyDone ? 'Come back tomorrow to keep your streak' : 'Same set for everyone · resets daily'}
                    </p>
                  </Link>

                  <Link
                    href={recommendedHref}
                    className="group border-r border-b border-slate-200 p-5 hover:bg-slate-50/80 transition-colors"
                  >
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400 font-medium">Focus</p>
                    <p className="mt-2 text-[15px] font-semibold text-slate-900 group-hover:text-emerald-800">
                      {recommended ? recommended.subject : 'Browse subjects'}
                    </p>
                    <p className="mt-1 text-[13px] text-slate-500">
                      {recommended
                        ? `Avg ${recommended.avgPercentage}% across ${recommended.attempts} recent sets`
                        : 'Practice any bank to unlock recommendations'}
                    </p>
                  </Link>

                  <Link
                    href={continueTopic ? `/quizzes/aptitude/${continueTopic.slug}` : '/quizzes/aptitude'}
                    className="group border-r border-b border-slate-200 p-5 hover:bg-slate-50/80 transition-colors"
                  >
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400 font-medium">Aptitude</p>
                    <p className="mt-2 text-[15px] font-semibold text-slate-900 group-hover:text-emerald-800">
                      {continueTopic ? `Continue ${continueTopic.title}` : 'Open aptitude hub'}
                    </p>
                    <p className="mt-1 text-[13px] text-slate-500">
                      {continueTopic
                        ? `${continueTopic.answered} of ${continueTopic.total} answered`
                        : '43 chapters with worked solutions'}
                    </p>
                  </Link>
                </div>
              </section>

              {/* Recent practice sessions */}
              <section aria-label="Recent practice">
                <div className="flex items-end justify-between gap-4 mb-4">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900">Recent practice</h2>
                  <Link
                    href="/quizzes/random-test"
                    className="text-sm font-medium text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900"
                  >
                    Start a set
                  </Link>
                </div>
                {recentSessions.length === 0 ? (
                  <p className="py-8 text-sm text-slate-500 border-t border-slate-200">
                    No synced practice sessions yet. Finish today&apos;s challenge to start tracking.
                  </p>
                ) : (
                  <ul className="border-t border-slate-200">
                    {recentSessions.map((s) => (
                      <li
                        key={s.id}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 py-3.5 border-b border-slate-200 text-sm"
                      >
                        <div className="sm:col-span-5 font-medium text-slate-900 capitalize">
                          {s.mode}
                          {s.topicSlug ? ` · ${s.topicSlug}` : s.subject !== 'all' ? ` · ${s.subject}` : ''}
                        </div>
                        <div className="sm:col-span-3 text-slate-600 tabular-nums">
                          {s.score}/{s.totalQuestions} · {Math.round(s.percentage)}%
                        </div>
                        <div className="sm:col-span-4 sm:text-right text-slate-500 tabular-nums">
                          {new Date(s.completedAt).toLocaleDateString(isUr ? 'ur-PK' : 'en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Saved jobs / formal quiz history */}
              <section className="space-y-4 pt-2">
                <div className="flex gap-6 border-b border-slate-200 text-[13px] font-medium">
                  <button
                    type="button"
                    onClick={() => setActiveTab('saved')}
                    className={`pb-2.5 -mb-px border-b-2 transition-colors inline-flex items-center gap-1.5 ${
                      activeTab === 'saved'
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    Saved jobs ({savedJobs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className={`pb-2.5 -mb-px border-b-2 transition-colors inline-flex items-center gap-1.5 ${
                      activeTab === 'history'
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    Formal quiz history ({quizHistory.length})
                  </button>
                </div>

                {activeTab === 'saved' ? (
                  savedJobs.length === 0 ? (
                    <p className="py-10 text-sm text-slate-500">
                      No saved jobs yet.{' '}
                      <Link href="/jobs" className="underline underline-offset-4 text-slate-800">
                        Browse jobs
                      </Link>
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedJobs.map((job) => (
                        <JobCard key={job._id} job={job} onSaveToggle={handleSavedJobRemove} />
                      ))}
                    </div>
                  )
                ) : quizHistory.length === 0 ? (
                  <p className="py-10 text-sm text-slate-500">
                    No formal quiz attempts yet. Timed subject quizzes appear here after you submit.
                  </p>
                ) : (
                  <div className="border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
                        <tr>
                          <th className="p-3.5">Quiz</th>
                          <th className="p-3.5">Subject</th>
                          <th className="p-3.5">Score</th>
                          <th className="p-3.5">%</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {quizHistory.map((item) => (
                          <tr key={item._id} className="hover:bg-slate-50/80 transition">
                            <td className="p-3.5 font-medium text-slate-900">
                              {item.quiz
                                ? isUr && item.quiz.titleUr
                                  ? item.quiz.titleUr
                                  : item.quiz.titleEn
                                : 'Archived Quiz'}
                            </td>
                            <td className="p-3.5 text-slate-600">{item.quiz?.subject || 'N/A'}</td>
                            <td className="p-3.5 font-medium tabular-nums">
                              {item.score} / {item.totalQuestions}
                            </td>
                            <td className="p-3.5 font-medium tabular-nums">{item.percentage}%</td>
                            <td className="p-3.5">
                              {item.passed ? (
                                <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 font-medium text-red-700">
                                  <XCircle className="w-3.5 h-3.5" /> Failed
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-slate-500">
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(item.attemptedAt).toLocaleDateString()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <p className="text-[13px] text-slate-500 flex items-center gap-1">
                <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                Tip: finish the daily challenge each day to protect your streak.
              </p>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
