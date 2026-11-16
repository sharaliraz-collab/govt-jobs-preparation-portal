'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  Sparkles,
  Flame,
  Shuffle,
  Calendar,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Lightbulb,
  Zap,
  Award,
  RefreshCw,
} from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';
import { absoluteUrl } from '@/lib/seo';
import { cleanQuestionStem, getCleanExplanation } from '@/lib/mcqDisplay';
import interestingBank from '@/data/interesting-questions.json';

export type QuizMode = 'random' | 'daily' | 'interesting';

export interface ArenaQuestion {
  id: string;
  subject: string;
  textEn: string;
  textUr?: string;
  optionsEn: string[];
  optionsUr?: string[];
  correctIndex: number;
  explanationEn?: string;
  funCategory?: string;
  didYouKnow?: string;
}

interface StreakStats {
  dailyStreak: number;
  lastVisitDate: string;
  bestAccuracy: number;
  bestStreak: number;
  totalXP: number;
  testsCompleted: number;
}

const DEFAULT_STATS: StreakStats = {
  dailyStreak: 0,
  lastVisitDate: '',
  bestAccuracy: 0,
  bestStreak: 0,
  totalXP: 0,
  testsCompleted: 0,
};

const STORAGE_KEY = 'pak_prep_random_stats_v1';

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function loadStats(): StreakStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

function saveStats(next: StreakStats) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
}

const SUBJECT_OPTIONS = [
  { value: 'all', label: 'All Subjects Mix' },
  { value: 'General Science', label: 'General Science & Everyday' },
  { value: 'Islamic Studies', label: 'Islamic Studies' },
  { value: 'Biology', label: 'Biology' },
  { value: 'Chemistry', label: 'Chemistry' },
  { value: 'Physics', label: 'Physics' },
  { value: 'Pakistan Studies', label: 'Pakistan Studies' },
  { value: 'English Grammar', label: 'English Grammar' },
  { value: 'World GK', label: 'World GK & Leaders' },
  { value: 'Aptitude', label: 'Quantitative Aptitude' },
];

const FUN_THEMES = [
  { value: 'all', label: 'All Surprising Themes' },
  { value: 'Islamic Wonders', label: 'Islamic Wonders' },
  { value: 'Human Body & Nature', label: 'Human Body & Nature' },
  { value: 'Cosmic & Physics', label: 'Cosmic & Physics' },
  { value: 'Everyday Chemistry', label: 'Everyday Chemistry' },
  { value: 'Pakistan & World Records', label: 'Pakistan & World Records' },
  { value: 'Brain Teasers', label: 'Brain Teasers' },
];

const COUNTS = [5, 10, 25, 50];

interface InterestingRandomQuizProps {
  variant?: 'compact' | 'arena';
  initialMode?: QuizMode;
  initialSubject?: string;
  initialCategory?: string;
  initialCount?: number;
}

export default function InterestingRandomQuiz({
  variant = 'arena',
  initialMode = 'random',
  initialSubject = 'all',
  initialCategory = 'all',
  initialCount = 10,
}: InterestingRandomQuizProps) {
  const [stats, setStats] = useState<StreakStats>(DEFAULT_STATS);

  // Compact teaser state
  const teaserPool = interestingBank as ArenaQuestion[];
  const [teaserIdx, setTeaserIdx] = useState<number>(0);
  const [teaserSelected, setTeaserSelected] = useState<number | null>(null);

  // Arena full interactive state
  const [mode, setMode] = useState<QuizMode>(initialMode);
  const [subject, setSubject] = useState<string>(initialSubject);
  const [category, setCategory] = useState<string>(initialCategory);
  const [count, setCount] = useState<number>(COUNTS.includes(initialCount) ? initialCount : 10);
  const [playStyle, setPlayStyle] = useState<'practice' | 'exam'>('practice');

  const [questions, setQuestions] = useState<ArenaQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(variant === 'arena');
  const [fetchError, setFetchError] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
  const [liveStreak, setLiveStreak] = useState<number>(0);
  const [sessionBestStreak, setSessionBestStreak] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong'>('all');

  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const recordedResultRef = useRef<boolean>(false);

  // Initialize local stats & deterministic daily question on teaser
  useEffect(() => {
    setStats(loadStats());
    const today = getTodayStr();
    let hash = 0;
    for (let i = 0; i < today.length; i++) hash = (hash * 31 + today.charCodeAt(i)) >>> 0;
    setTeaserIdx(hash % Math.max(1, teaserPool.length));
  }, [teaserPool.length]);

  const loadArenaQuestions = useCallback(
    async (
      targetMode: QuizMode,
      targetSubject: string,
      targetCategory: string,
      targetCount: number
    ) => {
      setLoading(true);
      setFetchError('');
      setCurrentIndex(0);
      setAnswers({});
      setLiveStreak(0);
      setSessionBestStreak(0);
      setIsSubmitted(false);
      setReviewFilter('all');
      recordedResultRef.current = false;

      const totalSecs = targetCount * 45;
      setSecondsLeft(totalSecs);
      setElapsedSeconds(0);

      try {
        const params = new URLSearchParams({
          mode: targetMode,
          subject: targetSubject,
          category: targetCategory,
          count: String(targetCount),
          date: getTodayStr(),
          t: String(Date.now()),
        });
        const res = await axios.get(`/api/questions/random?${params.toString()}`);
        const list = res.data?.questions;
        if (Array.isArray(list) && list.length > 0) {
          setQuestions(list);
        } else {
          // Graceful fallback to interesting bank slice
          const copy = [...teaserPool].sort(() => Math.random() - 0.5).slice(0, targetCount);
          setQuestions(copy);
        }
      } catch (err) {
        console.error('Failed loading random test, falling back:', err);
        setFetchError('Live database busy — loaded surprise offline mix instead.');
        const copy = [...teaserPool].sort(() => Math.random() - 0.5).slice(0, targetCount);
        setQuestions(copy);
      } finally {
        setLoading(false);
      }
    },
    [teaserPool]
  );

  useEffect(() => {
    if (variant === 'arena') {
      loadArenaQuestions(mode, subject, category, count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, mode, subject, category, count]);

  const finalizeStats = useCallback(
    (finalQuestions: ArenaQuestion[], finalAnswers: { [qId: string]: number }, bestRunStreak: number) => {
      if (recordedResultRef.current || finalQuestions.length === 0) return;
      recordedResultRef.current = true;

      let correctCount = 0;
      for (const q of finalQuestions) {
        if (finalAnswers[q.id] === q.correctIndex) correctCount++;
      }
      const accuracy = Math.round((correctCount / finalQuestions.length) * 100);
      const earnedXP = correctCount * 10 + bestRunStreak * 5 + (accuracy >= 80 ? 25 : 0);

      const today = getTodayStr();
      const yesterday = getYesterdayStr();
      const prev = loadStats();
      let nextDaily = prev.dailyStreak;
      if (prev.lastVisitDate === today) {
        nextDaily = Math.max(1, prev.dailyStreak);
      } else if (prev.lastVisitDate === yesterday) {
        nextDaily = prev.dailyStreak + 1;
      } else {
        nextDaily = 1;
      }

      const updated: StreakStats = {
        dailyStreak: nextDaily,
        lastVisitDate: today,
        bestAccuracy: Math.max(prev.bestAccuracy, accuracy),
        bestStreak: Math.max(prev.bestStreak, bestRunStreak),
        totalXP: prev.totalXP + earnedXP,
        testsCompleted: prev.testsCompleted + 1,
      };
      saveStats(updated);
      setStats(updated);
    },
    []
  );

  // Timer tick in arena mode
  useEffect(() => {
    if (variant !== 'arena' || loading || isSubmitted || questions.length === 0) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      if (playStyle === 'exam') {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsSubmitted(true);
            finalizeStats(questions, answers, sessionBestStreak);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [variant, loading, isSubmitted, playStyle, questions, answers, sessionBestStreak, finalizeStats]);

  // ────────────────────────────────────────────────────────────────────────
  // VARIANT 1: COMPACT TEASER WIDGET (Embedded on /, /quizzes, /mock-tests)
  // ────────────────────────────────────────────────────────────────────────
  if (variant === 'compact') {
    const q = teaserPool[teaserIdx] || teaserPool[0];
    const hasAnsweredTeaser = teaserSelected !== null;
    const isTeaserRight = hasAnsweredTeaser && teaserSelected === q.correctIndex;

    const handleNextTeaser = () => {
      setTeaserSelected(null);
      setTeaserIdx((prev) => (prev + 1 + Math.floor(Math.random() * 5)) % teaserPool.length);
    };

    const handlePickTeaser = (optIdx: number) => {
      if (hasAnsweredTeaser) return;
      setTeaserSelected(optIdx);
      const today = getTodayStr();
      const yesterday = getYesterdayStr();
      const prev = loadStats();
      const nextStreak =
        prev.lastVisitDate === today
          ? Math.max(1, prev.dailyStreak)
          : prev.lastVisitDate === yesterday
          ? prev.dailyStreak + 1
          : 1;
      const updated: StreakStats = {
        ...prev,
        dailyStreak: nextStreak,
        lastVisitDate: today,
        totalXP: prev.totalXP + (optIdx === q.correctIndex ? 15 : 5),
      };
      saveStats(updated);
      setStats(updated);
    };

    return (
      <section
        className="rounded-3xl border border-amber-300/80 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white p-5 sm:p-7 shadow-lg relative overflow-hidden"
        aria-label="Daily Brain Spark and Random Test Generator"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Interactive Surprise Question Card */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>{q.funCategory || 'Brain Spark'}</span>
                </span>
                <span className="text-[11px] font-bold text-slate-500 truncate">{q.subject}</span>
              </div>

              <button
                type="button"
                onClick={handleNextTeaser}
                className="text-[11px] font-extrabold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
              >
                <Shuffle className="w-3 h-3" />
                <span>Next Fun Question</span>
              </button>
            </div>

            <h3 className="mcq-question-text font-extrabold text-slate-900">
              {cleanQuestionStem(q.textEn)}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.optionsEn.map((opt, idx) => {
                let optClass =
                  'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200 hover:border-emerald-300';
                if (hasAnsweredTeaser) {
                  if (idx === q.correctIndex) {
                    optClass = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs';
                  } else if (idx === teaserSelected) {
                    optClass = 'bg-red-600 text-white border-red-600 font-bold';
                  } else {
                    optClass = 'bg-slate-50 text-slate-400 border-slate-200 opacity-75';
                  }
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasAnsweredTeaser}
                    onClick={() => handlePickTeaser(idx)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center gap-2 ${optClass}`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center text-[10px] font-black ${
                        hasAnsweredTeaser && idx === q.correctIndex
                          ? 'bg-white text-emerald-900 border-white'
                          : hasAnsweredTeaser && idx === teaserSelected
                          ? 'bg-white text-red-900 border-white'
                          : 'border-slate-300 text-slate-500 bg-white'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 min-w-0 font-semibold mcq-option-text">{opt}</span>
                  </button>
                );
              })}
            </div>

            {hasAnsweredTeaser && (
              <div
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  isTeaserRight
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="font-extrabold flex items-center gap-1.5">
                  {isTeaserRight ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Spot on! +15 XP</span>
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Correct Answer: {String.fromCharCode(65 + q.correctIndex)}. {q.optionsEn[q.correctIndex]}
                      </span>
                    </>
                  )}
                </div>
                {q.didYouKnow && (
                  <p className="text-[11px] leading-relaxed text-slate-700">
                    <span className="font-bold text-slate-900">Did you know? </span>
                    {q.didYouKnow}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right: Daily Streak + Quick Random Test Launcher */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{stats.dailyStreak > 0 ? `${stats.dailyStreak}-Day Visit Streak` : 'Daily Challenge Ready'}</span>
                </span>
                {stats.totalXP > 0 && (
                  <span className="bg-emerald-400/20 border border-emerald-400/30 text-emerald-200 text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                    {stats.totalXP} XP · Best {stats.bestAccuracy}%
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Random Tests &amp; Surprising MCQs
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
                Keep your prep fresh! Play today&apos;s mixed Daily Challenge, spin up unlimited custom Random Sprints across all subjects, or test yourself with mind-bending facts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Link
                href="/quizzes/random-test?mode=daily&count=10"
                className="flex items-center justify-between gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-3 rounded-xl shadow transition"
              >
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Today&apos;s 10Q Daily</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>

              <Link
                href="/quizzes/random-test?mode=random&count=10"
                className="flex items-center justify-between gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-3 rounded-xl shadow transition"
              >
                <span className="flex items-center gap-1.5">
                  <Shuffle className="w-4 h-4 shrink-0" />
                  <span>10Q Random Mix</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>

              <Link
                href="/quizzes/random-test?mode=interesting&count=10"
                className="flex items-center justify-between gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/20 font-extrabold text-xs px-4 py-3 rounded-xl transition"
              >
                <span className="flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Interesting Quiz (73)</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>

              <Link
                href="/quizzes/random-test?mode=random&count=25"
                className="flex items-center justify-between gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/20 font-extrabold text-xs px-4 py-3 rounded-xl transition"
              >
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-sky-300 shrink-0" />
                  <span>25Q Rapid Marathon</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // VARIANT 2: FULL INTERACTIVE RANDOM QUIZ ARENA (/quizzes/random-test)
  // ────────────────────────────────────────────────────────────────────────
  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQ = questions.length;
  const scoreCount = questions.reduce(
    (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
    0
  );
  const accuracyPct = totalQ > 0 ? Math.round((scoreCount / totalQ) * 100) : 0;

  const formatClock = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getRank = (pct: number) => {
    if (pct >= 90) return { title: 'Grandmaster Scholar', badge: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (pct >= 75) return { title: 'Merit Distinction', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    if (pct >= 60) return { title: 'Strong Contender', badge: 'bg-sky-100 text-sky-900 border-sky-300' };
    return { title: 'Rising Challenger', badge: 'bg-slate-100 text-slate-800 border-slate-300' };
  };

  const handleSelectOption = (qId: string, optIdx: number, correctIdx: number) => {
    if (isSubmitted) return;
    if (playStyle === 'practice' && answers[qId] !== undefined) return;

    const nextAnswers = { ...answers, [qId]: optIdx };
    setAnswers(nextAnswers);

    if (playStyle === 'practice') {
      if (optIdx === correctIdx) {
        const nextStreak = liveStreak + 1;
        setLiveStreak(nextStreak);
        if (nextStreak > sessionBestStreak) setSessionBestStreak(nextStreak);
      } else {
        setLiveStreak(0);
      }
    }
  };

  const handleSubmitTest = () => {
    let best = sessionBestStreak;
    if (playStyle === 'exam') {
      let run = 0;
      for (const q of questions) {
        if (answers[q.id] === q.correctIndex) {
          run++;
          if (run > best) best = run;
        } else {
          run = 0;
        }
      }
      setSessionBestStreak(best);
    }
    setIsSubmitted(true);
    finalizeStats(questions, answers, best);
  };

  const rank = getRank(accuracyPct);
  const shareUrl = absoluteUrl('/quizzes/random-test');
  const shareTitle = isSubmitted
    ? `I scored ${scoreCount}/${totalQ} (${accuracyPct}%) in today's Pak Exam Prep Challenge!`
    : 'Daily Random MCQ Test & Interesting Questions — Pak Govt Jobs & Prep';

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-8 space-y-6">
      {/* Hero Banner with Visitor Stats */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-amber-400/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fresh Sets Every Visit</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-white/10 border border-white/20 text-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{stats.dailyStreak || 1}-Day Streak</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-white/10 border border-white/20 text-sky-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>{stats.totalXP} XP</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Random Tests &amp; Interesting Questions Arena
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Never practice the same static sheet twice! Switch between today&apos;s synced Daily Challenge, custom randomized exams from 8,800+ MCQs, or curated surprising trivia with &ldquo;Did You Know?&rdquo; facts.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 shrink-0">
            <div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-amber-300">{stats.bestAccuracy}%</div>
              <div className="text-[10px] font-bold text-emerald-100/80 uppercase">Best Score</div>
            </div>
            <div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-emerald-300">{stats.testsCompleted}</div>
              <div className="text-[10px] font-bold text-emerald-100/80 uppercase">Tests Played</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode & Settings Control Panel */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Mode Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            {
              id: 'random' as QuizMode,
              label: '🎲 Random Test Mix',
              sub: 'Fresh shuffle every click',
            },
            {
              id: 'daily' as QuizMode,
              label: '🗓️ Daily Challenge',
              sub: `Synced set for ${getTodayStr()}`,
            },
            {
              id: 'interesting' as QuizMode,
              label: '✨ Interesting Facts',
              sub: '73 surprising & memorable Qs',
            },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`p-3 rounded-xl border text-left transition ${
                mode === m.id
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <div className="text-xs sm:text-sm font-black">{m.label}</div>
              <div
                className={`text-[11px] mt-0.5 ${
                  mode === m.id ? 'text-emerald-100' : 'text-slate-500'
                }`}
              >
                {m.sub}
              </div>
            </button>
          ))}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2.5">
            {mode === 'interesting' ? (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Interesting question theme"
                className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600"
              >
                {FUN_THEMES.map((t) => (
                  <option key={t.value} value={t.value}>
                    ✨ {t.label}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                aria-label="Quiz subject filter"
                className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600"
              >
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    📚 {s.label}
                  </option>
                ))}
              </select>
            )}

            {/* Question Count Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {COUNTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCount(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition ${
                    count === c
                      ? 'bg-white text-emerald-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {c}Q
                </button>
              ))}
            </div>

            {/* Play Style Toggle */}
            <button
              type="button"
              onClick={() => setPlayStyle(playStyle === 'practice' ? 'exam' : 'practice')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold border transition flex items-center gap-1.5 ${
                playStyle === 'exam'
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200'
              }`}
            >
              {playStyle === 'exam' ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Timed Exam Mode</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant Feedback Mode</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => loadArenaQuestions(mode, subject, category, count)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{mode === 'daily' ? 'Restart Daily Test' : 'Deal Fresh Random Set'}</span>
          </button>
        </div>

        {fetchError && (
          <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
            {fetchError}
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            Shuffling a fresh set of questions for you...
          </p>
        </div>
      ) : isSubmitted ? (
        /* ─── RESULTS & REVIEW SCREEN ─── */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-black mx-auto shadow-2xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span className={`px-2 py-0.5 rounded-full border ${rank.badge}`}>{rank.title}</span>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-slate-900 tabular-nums">
                {scoreCount} <span className="text-2xl text-slate-400">/ {totalQ}</span>
              </div>
              <p className="text-sm font-bold text-emerald-700">
                {accuracyPct}% Accuracy · Completed in {formatClock(elapsedSeconds)}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
                <div className="text-lg font-black text-emerald-800">{scoreCount}</div>
                <div className="text-[11px] font-bold text-emerald-700">Correct</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
                <div className="text-lg font-black text-red-700">{totalQ - scoreCount}</div>
                <div className="text-[11px] font-bold text-red-600">Missed / Wrong</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                <div className="text-lg font-black text-amber-800">{sessionBestStreak}</div>
                <div className="text-[11px] font-bold text-amber-700">Best Streak 🔥</div>
              </div>
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3">
                <div className="text-lg font-black text-sky-800">{stats.dailyStreak} Days</div>
                <div className="text-[11px] font-bold text-sky-700">Daily Streak</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => loadArenaQuestions(mode === 'daily' ? 'random' : mode, subject, category, count)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-black px-5 py-3 rounded-xl shadow transition flex items-center gap-2"
              >
                <Shuffle className="w-4 h-4" />
                <span>Play New Random Test</span>
              </button>
              <button
                type="button"
                onClick={() => loadArenaQuestions('interesting', 'all', category, 10)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black px-5 py-3 rounded-xl shadow transition flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Try 10 Interesting Questions</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                Challenge your friends with this score:
              </span>
              <ShareButtons url={shareUrl} title={shareTitle} description="Test yourself on Pakistan's Daily Random MCQ & Trivia Arena!" />
            </div>
          </div>

          {/* Review Answers Filter */}
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Detailed Review &amp; Facts
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                  reviewFilter === 'all'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                All ({totalQ})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('wrong')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                  reviewFilter === 'wrong'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Wrong / Skipped ({totalQ - scoreCount})
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {questions
              .map((q, idx) => ({ q, idx }))
              .filter(({ q }) => reviewFilter === 'all' || answers[q.id] !== q.correctIndex)
              .map(({ q, idx }) => {
                const chosen = answers[q.id];
                const ok = chosen === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-4 sm:p-5 rounded-2xl border bg-white space-y-2.5 ${
                      ok ? 'border-emerald-200' : 'border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black text-slate-500">
                        Q{idx + 1} · {q.funCategory || q.subject}
                      </span>
                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {ok ? 'Correct' : chosen === undefined ? 'Skipped' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="mcq-question-text font-bold text-slate-900">
                      {cleanQuestionStem(q.textEn)}
                    </p>
                    <div className="text-xs space-y-1">
                      {chosen !== undefined && !ok && (
                        <p className="text-red-600 font-semibold">
                          Your answer: {String.fromCharCode(65 + chosen)}. {q.optionsEn[chosen]}
                        </p>
                      )}
                      <p className="text-emerald-700 font-bold">
                        Correct answer: {String.fromCharCode(65 + q.correctIndex)}. {q.optionsEn[q.correctIndex]}
                      </p>
                    </div>
                    {(q.didYouKnow || getCleanExplanation(q.explanationEn)) && (
                      <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-slate-700">
                        <span className="font-extrabold text-amber-900">
                          {q.didYouKnow ? '💡 Did You Know? ' : 'Explanation: '}
                        </span>
                        {q.didYouKnow || getCleanExplanation(q.explanationEn)}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ) : currentQ ? (
        /* ─── ACTIVE TEST ARENA ─── */
        <div className="space-y-4">
          {/* HUD Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
                <span className="bg-emerald-700 text-white px-2.5 py-1 rounded-lg tabular-nums">
                  Q {currentIndex + 1} / {totalQ}
                </span>
                <span className="text-slate-500 font-bold">
                  {answeredCount} of {totalQ} answered
                </span>
              </div>

              <div className="flex items-center gap-2">
                {playStyle === 'practice' && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black px-2.5 py-1 rounded-lg">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Streak {liveStreak}</span>
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-lg border tabular-nums ${
                    playStyle === 'exam' && secondsLeft < 60
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {playStyle === 'exam' ? formatClock(secondsLeft) : formatClock(elapsedSeconds)}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-black px-3.5 py-1.5 rounded-lg transition"
                >
                  Finish Test
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
                style={{ width: `${Math.round((answeredCount / Math.max(1, totalQ)) * 100)}%` }}
              />
            </div>

            {/* Question Palette */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const isCurr = idx === currentIndex;
                let pill = 'bg-slate-100 text-slate-600 border-slate-200';
                if (ans !== undefined) {
                  if (playStyle === 'practice') {
                    pill =
                      ans === q.correctIndex
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-red-500 text-white border-red-500';
                  } else {
                    pill = 'bg-emerald-700 text-white border-emerald-700';
                  }
                }
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-black border transition ${pill} ${
                      isCurr ? 'ring-2 ring-amber-400 ring-offset-1' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Card */}
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                {currentQ.funCategory ? `${currentQ.funCategory} · ${currentQ.subject}` : currentQ.subject}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                Question {currentIndex + 1} of {totalQ}
              </span>
            </div>

            <h2 className="mcq-question-text font-extrabold text-slate-900">
              {cleanQuestionStem(currentQ.textEn)}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.optionsEn.map((opt, optIdx) => {
                const chosen = answers[currentQ.id];
                const isChosen = chosen === optIdx;
                const isRight = optIdx === currentQ.correctIndex;
                const showFeedback = playStyle === 'practice' && chosen !== undefined;

                let btnClass =
                  'bg-slate-50 hover:bg-emerald-50/70 text-slate-800 border-slate-200 hover:border-emerald-300';
                if (showFeedback) {
                  if (isRight) {
                    btnClass = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs';
                  } else if (isChosen) {
                    btnClass = 'bg-red-600 text-white border-red-600 font-bold';
                  } else {
                    btnClass = 'bg-slate-50 text-slate-400 border-slate-200 opacity-80';
                  }
                } else if (isChosen) {
                  btnClass = 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-xs';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, optIdx, currentQ.correctIndex)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center gap-3 ${btnClass}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg border shrink-0 flex items-center justify-center text-[11px] font-black ${
                        (showFeedback && (isRight || isChosen)) || isChosen
                          ? 'bg-white text-slate-900 border-white'
                          : 'bg-white text-slate-500 border-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 min-w-0 font-medium mcq-option-text">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback & Curiosity Fact */}
            {playStyle === 'practice' && answers[currentQ.id] !== undefined && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                  answers[currentQ.id] === currentQ.correctIndex
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="font-black flex items-center gap-1.5">
                  {answers[currentQ.id] === currentQ.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Correct Answer! (+{10 + liveStreak * 2} pts)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>
                        Correct Answer: {String.fromCharCode(65 + currentQ.correctIndex)}.{' '}
                        {currentQ.optionsEn[currentQ.correctIndex]}
                      </span>
                    </>
                  )}
                </div>
                {(currentQ.didYouKnow || getCleanExplanation(currentQ.explanationEn)) && (
                  <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed">
                    <span className="font-extrabold text-slate-900">
                      {currentQ.didYouKnow ? '💡 Did You Know? ' : 'Explanation: '}
                    </span>
                    {currentQ.didYouKnow || getCleanExplanation(currentQ.explanationEn)}
                  </p>
                )}
              </div>
            )}

            {/* Navigation Footer */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-35 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIndex < totalQ - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((i) => Math.min(totalQ - 1, i + 1))}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-xs transition"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Submit &amp; See Scorecard</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <RotateCcw className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No questions matched those filters.</p>
        </div>
      )}
    </div>
  );
}
