'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import {
  cleanQuestionStem,
  getCleanExplanation,
  getDynamicOptionGridClass,
} from '@/lib/mcqDisplay';
import {
  applySessionToStats,
  computeEarnedXP,
  loadLocalStreakStats,
  saveLocalStreakStats,
} from '@/lib/practiceStats';

interface ScreeningQuestion {
  id: string;
  section: string;
  subject: string;
  textEn: string;
  optionsEn: string[];
  correctIndex: number;
  explanationEn?: string;
}

interface BlueprintSection {
  section: string;
  weightPercent: number;
  starterCount: number;
  fullCount: number;
}

const DEFAULT_BLUEPRINT: BlueprintSection[] = [
  { section: 'English Grammar', weightPercent: 20, starterCount: 4, fullCount: 20 },
  { section: 'Pakistan Studies', weightPercent: 20, starterCount: 4, fullCount: 20 },
  { section: 'General Science', weightPercent: 20, starterCount: 4, fullCount: 20 },
  { section: 'Islamic Studies', weightPercent: 15, starterCount: 3, fullCount: 15 },
  { section: 'Aptitude', weightPercent: 15, starterCount: 3, fullCount: 15 },
  { section: 'World GK', weightPercent: 10, starterCount: 2, fullCount: 10 },
];

const SECTION_PRACTICE_HREF: Record<string, string> = {
  'English Grammar': '/quizzes/english-grammar',
  'Pakistan Studies': '/quizzes/pak-studies',
  'General Science': '/quizzes/subject/general-science',
  'Islamic Studies': '/quizzes/islamic-studies',
  Aptitude: '/quizzes/aptitude',
  'World GK': '/quizzes/world-info',
};

const PAGE_SIZE = 20;
const STARTER_LIMIT = 20;
const STARTER_SECONDS = 15 * 60;
const FULL_SECONDS = 90 * 60;

function formatTimer(totalSec: number): string {
  const safe = Math.max(0, totalSec);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function ScreeningTestPage() {
  const { user, token, loading: authLoading, register, login } = useAuth();

  const [blueprint, setBlueprint] = useState<BlueprintSection[]>(DEFAULT_BLUEPRINT);
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submittedScope, setSubmittedScope] = useState<null | 20 | 100>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'unanswered'>('all');
  const [reviewSection, setReviewSection] = useState<string>('ALL');
  const [secondsLeft, setSecondsLeft] = useState<number>(STARTER_SECONDS);

  // Inline newcomer signup/login panel state
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [authTab, setAuthTab] = useState<'register' | 'login'>('register');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  // Progress persistence state
  const [savedToAccount, setSavedToAccount] = useState(false);
  const [savingToAccount, setSavingToAccount] = useState(false);
  const lastSavedKeyRef = useRef<string>('');

  const isSignedIn = Boolean(user && token);
  const totalPages = Math.max(1, Math.ceil(questions.length / PAGE_SIZE));
  const activeExamTotal = isSignedIn ? questions.length : Math.min(STARTER_LIMIT, questions.length);

  const loadFreshPaper = useCallback(async (signedInNow: boolean) => {
    setLoading(true);
    setLoadError('');
    setAnswers({});
    setCurrentPage(1);
    setSubmittedScope(null);
    setReviewFilter('all');
    setReviewSection('ALL');
    setShowAuthGate(false);
    setSavedToAccount(false);
    lastSavedKeyRef.current = '';
    setSecondsLeft(signedInNow ? FULL_SECONDS : STARTER_SECONDS);

    try {
      const res = await axios.get(`/api/questions/exam-pattern?size=100&t=${Date.now()}`, {
        timeout: 15000,
      });
      if (Array.isArray(res.data?.blueprint)) {
        setBlueprint(res.data.blueprint);
      }
      if (Array.isArray(res.data?.questions) && res.data.questions.length > 0) {
        setQuestions(res.data.questions);
      } else {
        setLoadError('Could not load screening questions. Please try again.');
      }
    } catch {
      setLoadError('Network busy while generating your randomized paper. Please retry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      loadFreshPaper(Boolean(user && token));
    }
    // Load once when auth settles
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);

  // Countdown timer (pauses cleanly when submitted or filling inline signup form)
  useEffect(() => {
    if (loading || submittedScope !== null || showAuthGate || questions.length === 0) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [loading, submittedScope, showAuthGate, questions.length]);

  // Helper: compute score + per-section breakdown for a given question slice (20 or 100)
  const computeEvaluation = useCallback(
    (scopeCount: number, currentAnswers: Record<string, number>) => {
      const slice = questions.slice(0, Math.min(scopeCount, questions.length));
      let correct = 0;
      let answered = 0;
      let runStreak = 0;
      let bestRunStreak = 0;

      const sectionMap = new Map<string, { score: number; totalQuestions: number; answered: number }>();
      for (const bp of blueprint) {
        sectionMap.set(bp.section, { score: 0, totalQuestions: 0, answered: 0 });
      }

      for (const q of slice) {
        const bucket = sectionMap.get(q.section) || { score: 0, totalQuestions: 0, answered: 0 };
        bucket.totalQuestions += 1;
        const chosen = currentAnswers[q.id];
        if (chosen !== undefined) {
          answered += 1;
          bucket.answered += 1;
          if (chosen === q.correctIndex) {
            correct += 1;
            bucket.score += 1;
            runStreak += 1;
            if (runStreak > bestRunStreak) bestRunStreak = runStreak;
          } else {
            runStreak = 0;
          }
        } else {
          runStreak = 0;
        }
        sectionMap.set(q.section, bucket);
      }

      const total = Math.max(1, slice.length);
      const percentage = Math.round((correct / total) * 100);
      const subjectBreakdown = Array.from(sectionMap.entries())
        .filter(([, v]) => v.totalQuestions > 0)
        .map(([section, v]) => ({
          subject: section,
          score: v.score,
          totalQuestions: v.totalQuestions,
          answered: v.answered,
          percentage: Math.round((v.score / v.totalQuestions) * 100),
        }));

      const weakest = [...subjectBreakdown].sort((a, b) => a.percentage - b.percentage)[0] || null;
      const strongest = [...subjectBreakdown].sort((a, b) => b.percentage - a.percentage)[0] || null;

      return {
        slice,
        correct,
        answered,
        total,
        percentage,
        bestRunStreak,
        subjectBreakdown,
        weakest,
        strongest,
      };
    },
    [questions, blueprint]
  );

  const persistProgressToAccount = useCallback(
    async (
      scopeCount: 20 | 100,
      authToken: string,
      currentAnswers: Record<string, number>
    ) => {
      const evalData = computeEvaluation(scopeCount, currentAnswers);
      const dedupKey = `${scopeCount}:${evalData.correct}:${evalData.answered}:${questions[0]?.id || ''}`;
      if (lastSavedKeyRef.current === dedupKey) {
        setSavedToAccount(true);
        return;
      }

      setSavingToAccount(true);
      try {
        await axios.post(
          '/api/practice/complete',
          {
            mode: 'random',
            subject:
              scopeCount === 100
                ? 'Screening Test Pattern (100 MCQs)'
                : 'Screening Test Starter (20/100 MCQs)',
            topicSlug: scopeCount === 100 ? 'screening-100' : 'screening-20',
            score: evalData.correct,
            totalQuestions: evalData.total,
            percentage: evalData.percentage,
            bestRunStreak: evalData.bestRunStreak,
            subjectBreakdown: evalData.subjectBreakdown.map((item) => ({
              subject: item.subject,
              score: item.score,
              totalQuestions: item.totalQuestions,
              percentage: item.percentage,
            })),
          },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        lastSavedKeyRef.current = dedupKey;
        setSavedToAccount(true);
      } catch {
        /* local fallback already saved */
      } finally {
        setSavingToAccount(false);
      }
    },
    [computeEvaluation, questions]
  );

  const handleSubmitScope = async (scopeCount: 20 | 100) => {
    const evalData = computeEvaluation(scopeCount, answers);
    if (evalData.answered === 0) {
      if (!window.confirm('You have not selected any answers yet. Grade anyway?')) {
        return;
      }
    }

    // Update local device streak/XP stats immediately
    const earnedXP = computeEarnedXP(evalData.correct, evalData.bestRunStreak, evalData.percentage);
    const updatedLocal = applySessionToStats(loadLocalStreakStats(), {
      accuracy: evalData.percentage,
      bestRunStreak: evalData.bestRunStreak,
      earnedXP,
    });
    saveLocalStreakStats(updatedLocal);

    setSubmittedScope(scopeCount);
    setShowAuthGate(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const activeToken =
      token ||
      (typeof window !== 'undefined' ? window.localStorage.getItem('govt_portal_token') : null);
    if (activeToken) {
      await persistProgressToAccount(scopeCount, activeToken, answers);
    }
  };

  const handlePageSelect = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    if (pageNum > 1 && !isSignedIn) {
      setShowAuthGate(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentPage(pageNum);
    setShowAuthGate(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOptionSelect = (qId: string, optIdx: number) => {
    if (submittedScope !== null) return;
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleInlineAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthBusy(true);

    try {
      if (authTab === 'register') {
        await register(authName.trim(), authEmail.trim(), authPassword);
      } else {
        await login(authEmail.trim(), authPassword);
      }

      const freshToken =
        typeof window !== 'undefined' ? window.localStorage.getItem('govt_portal_token') : null;

      // If they already graded the 20-MCQ starter test, immediately sync it to their brand-new account!
      if (submittedScope === 20 && freshToken) {
        await persistProgressToAccount(20, freshToken, answers);
      } else if (showAuthGate) {
        // They unlocked Q21..Q100 mid-exam: extend timer to remaining full-paper budget & jump to Page 2!
        setShowAuthGate(false);
        setSecondsLeft((prev) => Math.max(prev + (FULL_SECONDS - STARTER_SECONDS), 75 * 60));
        setCurrentPage(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setAuthError(
        err?.response?.data?.message ||
          (authTab === 'register'
            ? 'Could not create account. Please check your details.'
            : 'Invalid email or password.')
      );
    } finally {
      setAuthBusy(false);
    }
  };

  const handleContinueToFull100 = () => {
    setSubmittedScope(null);
    setShowAuthGate(false);
    setSecondsLeft(75 * 60);
    setCurrentPage(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentQuestions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return questions.slice(start, start + PAGE_SIZE);
  }, [questions, currentPage]);

  const starterAnsweredCount = useMemo(() => {
    return questions.slice(0, STARTER_LIMIT).reduce((acc, q) => (answers[q.id] !== undefined ? acc + 1 : acc), 0);
  }, [questions, answers]);

  const totalAnsweredCount = useMemo(() => {
    return questions
      .slice(0, activeExamTotal)
      .reduce((acc, q) => (answers[q.id] !== undefined ? acc + 1 : acc), 0);
  }, [questions, activeExamTotal, answers]);

  const evaluation = useMemo(() => {
    if (submittedScope === null) return null;
    return computeEvaluation(submittedScope, answers);
  }, [submittedScope, computeEvaluation, answers]);

  const filteredReviewQuestions = useMemo(() => {
    if (!evaluation) return [];
    return evaluation.slice.filter((q) => {
      if (reviewSection !== 'ALL' && q.section !== reviewSection) return false;
      const chosen = answers[q.id];
      if (reviewFilter === 'wrong') return chosen !== undefined && chosen !== q.correctIndex;
      if (reviewFilter === 'unanswered') return chosen === undefined;
      return true;
    });
  }, [evaluation, answers, reviewFilter, reviewSection]);

  return (
    <div className="text-slate-900 pb-12 font-sans selection:bg-slate-900 selection:text-white">
      {/* Editorial Header */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 sm:p-6 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/quizzes" className="hover:text-slate-900 transition-colors">
              Subjects
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">100-MCQ Screening Pattern</span>
          </div>

          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <Link
                href="/my-account"
                className="px-2.5 py-1 rounded border border-emerald-200 bg-emerald-50 text-[11px] font-medium text-emerald-900 hover:border-emerald-400 transition-colors"
              >
                My Progress Dashboard →
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuthGate((v) => !v)}
                className="px-2.5 py-1 rounded border border-slate-900 bg-slate-900 text-[11px] font-medium text-white hover:bg-slate-800 transition-colors"
              >
                Create Free Account
              </button>
            )}
            <button
              type="button"
              onClick={() => loadFreshPaper(isSignedIn)}
              disabled={loading}
              className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 hover:border-slate-400 text-[11px] font-medium text-slate-800 transition-colors disabled:opacity-50"
            >
              New Random Paper
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700 mb-1.5">
              FPSC · PPSC · SPSC · KPPSC · NTS One-Paper Blueprint
            </p>
            <h1 className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-slate-950">
              {isSignedIn
                ? 'Full 100-MCQ Screening Exam Pattern'
                : '20-of-100 Screening Test Pattern (Starter Assessment)'}
            </h1>
            <p className="mt-1.5 text-slate-600 text-xs sm:text-[13px] leading-relaxed">
              {isSignedIn
                ? 'Freshly randomized 100-MCQ screening paper across all 6 core exam subjects. Your overall score and subject-by-subject accuracy automatically sync to your account dashboard.'
                : 'Start immediately with 20 randomly selected questions matching the exact 100-MCQ screening test blueprint across all 6 subjects. Create a free account anytime to save your score, unlock Questions 21–100, and track weak subjects.'}
            </p>
          </div>

          <div className="grid grid-cols-3 border border-slate-200 divide-x divide-slate-200 bg-slate-50/60 rounded-md shrink-0">
            <div className="px-3.5 py-2">
              <div className="text-sm sm:text-base font-semibold text-slate-950 tabular-nums">
                {totalAnsweredCount}/{activeExamTotal || 20}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-medium mt-0.5">
                Answered
              </div>
            </div>
            <div className="px-3.5 py-2">
              <div className="text-sm sm:text-base font-semibold text-slate-950 tabular-nums">
                {formatTimer(secondsLeft)}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-medium mt-0.5">
                Timer
              </div>
            </div>
            <div className="px-3.5 py-2">
              <div className="text-sm sm:text-base font-semibold text-emerald-700 tabular-nums">
                {isSignedIn ? '100 / 100' : '20 / 100'}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-medium mt-0.5">
                {isSignedIn ? 'Unlocked' : 'Free Slice'}
              </div>
            </div>
          </div>
        </div>

        {/* 6-Subject Exam Blueprint Strip */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Official 100-MCQ Pattern Weightage (Proportional 20-Q Starter Block)
            </span>
            <span className="text-[11px] text-slate-500 tabular-nums">
              Randomized from 15,677 MCQs
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {blueprint.map((bp) => (
              <div
                key={bp.section}
                className="border border-slate-200/80 bg-slate-50/50 rounded-md px-2.5 py-2"
              >
                <div className="text-[11px] font-semibold text-slate-900 truncate">
                  {bp.section}
                </div>
                <div className="mt-0.5 flex items-baseline justify-between text-[10px] text-slate-500 tabular-nums">
                  <span>{bp.weightPercent}% weight</span>
                  <span className="font-medium text-slate-700">
                    {isSignedIn ? `${bp.fullCount} Qs` : `${bp.starterCount}/${bp.fullCount} Qs`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline Newcomer Account Unlock Panel (when triggered mid-exam) */}
      {showAuthGate && !isSignedIn && submittedScope === null && (
        <div className="bg-slate-950 text-white rounded-lg border border-slate-800 p-5 sm:p-6 mb-5">
          <div className="grid md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-6 space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                Free Candidate Account · Unlock Q21–Q100
              </p>
              <h2 className="text-lg sm:text-xl font-serif font-semibold tracking-tight text-white">
                Save your {starterAnsweredCount} answers and unlock the remaining 80 questions.
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                Creating a free account takes 15 seconds. Your answers on Questions 1–20 remain
                intact, Questions 21–100 unlock immediately, and every future test updates your
                personal progress dashboard.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-semibold">01.</span>
                  <span>Complete all 100 randomized MCQs in the official 6-subject pattern.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-semibold">02.</span>
                  <span>Track subject-by-subject accuracy and pinpoint weak areas automatically.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-semibold">03.</span>
                  <span>Keep your daily streak, XP, and exam history synced across devices.</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={() => setShowAuthGate(false)}
                className="text-xs text-slate-400 hover:text-white underline underline-offset-4 pt-1"
              >
                ← Back to Questions 1–20
              </button>
            </div>

            <div className="md:col-span-6 bg-white text-slate-900 rounded-md p-4 sm:p-5">
              <div className="flex border-b border-slate-200 mb-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('register');
                    setAuthError('');
                  }}
                  className={`pb-2.5 pr-4 border-b-2 transition-colors ${
                    authTab === 'register'
                      ? 'border-slate-900 text-slate-950'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Create Free Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('login');
                    setAuthError('');
                  }}
                  className={`pb-2.5 px-4 border-b-2 transition-colors ${
                    authTab === 'login'
                      ? 'border-slate-900 text-slate-950'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {authError && (
                <div className="mb-3 px-3 py-2 rounded border border-rose-200 bg-rose-50 text-xs text-rose-800">
                  {authError}
                </div>
              )}

              <form onSubmit={handleInlineAuthSubmit} className="space-y-3 text-xs">
                {authTab === 'register' && (
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g., Ali Raza"
                      className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>
                )}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authBusy}
                  className="w-full py-2.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors disabled:opacity-50"
                >
                  {authBusy
                    ? 'Setting up your account...'
                    : authTab === 'register'
                    ? 'Create Account & Unlock Questions 21–100'
                    : 'Sign In & Unlock Questions 21–100'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Results & Diagnostic Dashboard (after grading 20 or 100 MCQs) */}
      {evaluation && submittedScope !== null && (
        <div className="space-y-5 mb-6">
          {/* Overall Readiness Summary */}
          <div className="bg-white border border-slate-200/90 rounded-lg p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  {submittedScope === 100
                    ? 'Full 100-MCQ Screening Report'
                    : '20-of-100 Starter Diagnostic Report'}
                </p>
                <h2 className="mt-1 text-xl sm:text-2xl font-serif font-semibold text-slate-950">
                  Score: {evaluation.correct} / {evaluation.total} ({evaluation.percentage}%)
                </h2>
                <p className="mt-1 text-xs sm:text-[13px] text-slate-600">
                  {submittedScope === 20
                    ? `Projected 100-MCQ Exam Score: ~${evaluation.percentage} / 100 · `
                    : ''}
                  {evaluation.percentage >= 70
                    ? 'Strong screening readiness — competitive merit zone.'
                    : evaluation.percentage >= 50
                    ? 'Passing range — focused revision on weaker subjects will lift your merit score.'
                    : 'Foundational stage — review the weak sections below and practice daily sets.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {isSignedIn && submittedScope === 20 && questions.length > 20 && (
                  <button
                    type="button"
                    onClick={handleContinueToFull100}
                    className="px-3.5 py-2 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
                  >
                    Continue to Full 100 MCQs (Q21–100) →
                  </button>
                )}
                {isSignedIn && (
                  <Link
                    href="/my-account"
                    className="px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                  >
                    View My Progress →
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => loadFreshPaper(isSignedIn)}
                  className="px-3.5 py-2 rounded-md border border-slate-300 bg-white hover:border-slate-500 text-slate-800 text-xs font-medium transition-colors"
                >
                  Take Fresh Random Paper
                </button>
              </div>
            </div>

            {isSignedIn && (
              <div className="mt-4 px-3.5 py-2.5 rounded-md border border-emerald-200 bg-emerald-50/70 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2">
                <span>
                  {savingToAccount
                    ? 'Saving your score and 6-subject diagnostic to your account...'
                    : savedToAccount
                    ? 'Saved to your account — your My Account dashboard now reflects this test and your weakest subjects.'
                    : 'Signed in — progress synced.'}
                </span>
                <Link
                  href="/my-account"
                  className="font-semibold underline underline-offset-4 hover:text-emerald-700"
                >
                  Open Progress Dashboard →
                </Link>
              </div>
            )}

            {/* 6-Subject Diagnostic Table */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Subject-by-Subject Performance Breakdown
                </h3>
                {evaluation.weakest && (
                  <span className="text-[11px] text-slate-600">
                    Priority focus:{' '}
                    <strong className="text-rose-700 font-semibold">
                      {evaluation.weakest.subject} ({evaluation.weakest.percentage}%)
                    </strong>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {evaluation.subjectBreakdown.map((sec) => {
                  const statusLabel =
                    sec.percentage >= 75
                      ? 'Strong'
                      : sec.percentage >= 50
                      ? 'Moderate'
                      : 'Needs Focus';
                  const barColor =
                    sec.percentage >= 75
                      ? 'bg-emerald-600'
                      : sec.percentage >= 50
                      ? 'bg-amber-500'
                      : 'bg-rose-600';
                  const badgeStyle =
                    sec.percentage >= 75
                      ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                      : sec.percentage >= 50
                      ? 'text-amber-800 bg-amber-50 border-amber-200'
                      : 'text-rose-800 bg-rose-50 border-rose-200';
                  const practiceHref = SECTION_PRACTICE_HREF[sec.subject] || '/quizzes';

                  return (
                    <div
                      key={sec.subject}
                      className="border border-slate-200/90 rounded-md p-3.5 bg-slate-50/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900">{sec.subject}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badgeStyle}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between text-xs tabular-nums">
                        <span className="font-semibold text-slate-950">
                          {sec.score} / {sec.totalQuestions} correct
                        </span>
                        <span className="font-semibold text-slate-700">{sec.percentage}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor}`}
                          style={{ width: `${Math.max(4, sec.percentage)}%` }}
                        />
                      </div>
                      <div className="mt-2.5 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">
                          Attempted {sec.answered}/{sec.totalQuestions}
                        </span>
                        <Link
                          href={practiceHref}
                          className="font-medium text-slate-800 hover:text-emerald-700 underline underline-offset-4"
                        >
                          Practice →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Newcomer Post-20-MCQ Conversion Card (inline account signup that immediately saves this result!) */}
          {!isSignedIn && (
            <div className="bg-slate-950 text-white rounded-lg border border-slate-800 p-5 sm:p-6">
              <div className="grid md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-6 space-y-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    Save Your {evaluation.correct}/{evaluation.total} Diagnostic &amp; Track Progress
                  </p>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-white">
                    Create a free account to save this score and unlock all 100 MCQs.
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                    Right now this 20-MCQ result is only on this browser tab. Create a free
                    candidate account below and we will immediately save your{' '}
                    <strong className="text-white">{evaluation.percentage}%</strong> score and
                    6-subject report to your permanent progress dashboard — plus unlock Questions
                    21–100 on this exact paper.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="border border-white/10 rounded p-2.5 bg-white/5">
                      <div className="text-sm font-semibold text-white tabular-nums">
                        {evaluation.percentage}%
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                        Saved Score
                      </div>
                    </div>
                    <div className="border border-white/10 rounded p-2.5 bg-white/5">
                      <div className="text-sm font-semibold text-emerald-300 tabular-nums">+80</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                        More MCQs
                      </div>
                    </div>
                    <div className="border border-white/10 rounded p-2.5 bg-white/5">
                      <div className="text-sm font-semibold text-white tabular-nums">6</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                        Subjects Tracked
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-6 bg-white text-slate-900 rounded-md p-4 sm:p-5">
                  <div className="flex border-b border-slate-200 mb-4 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('register');
                        setAuthError('');
                      }}
                      className={`pb-2.5 pr-4 border-b-2 transition-colors ${
                        authTab === 'register'
                          ? 'border-slate-900 text-slate-950'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Create Free Account
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('login');
                        setAuthError('');
                      }}
                      className={`pb-2.5 px-4 border-b-2 transition-colors ${
                        authTab === 'login'
                          ? 'border-slate-900 text-slate-950'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Already Registered? Sign In
                    </button>
                  </div>

                  {authError && (
                    <div className="mb-3 px-3 py-2 rounded border border-rose-200 bg-rose-50 text-xs text-rose-800">
                      {authError}
                    </div>
                  )}

                  <form onSubmit={handleInlineAuthSubmit} className="space-y-3 text-xs">
                    {authTab === 'register' && (
                      <div>
                        <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="e.g., Ayesha Khan"
                          className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={authBusy}
                      className="w-full py-2.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors disabled:opacity-50"
                    >
                      {authBusy
                        ? 'Saving progress to your account...'
                        : authTab === 'register'
                        ? 'Create Account & Save My Progress'
                        : 'Sign In & Save My Progress'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Answer Review Filter Bar */}
          <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all' as const, label: `All (${evaluation.total})` },
                {
                  id: 'wrong' as const,
                  label: `Incorrect (${evaluation.answered - evaluation.correct})`,
                },
                {
                  id: 'unanswered' as const,
                  label: `Unanswered (${evaluation.total - evaluation.answered})`,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setReviewFilter(tab.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                    reviewFilter === tab.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              <button
                type="button"
                onClick={() => setReviewSection('ALL')}
                className={`px-2 py-1 rounded text-[11px] font-medium border whitespace-nowrap ${
                  reviewSection === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                All Sections
              </button>
              {blueprint.map((bp) => (
                <button
                  key={bp.section}
                  type="button"
                  onClick={() => setReviewSection(bp.section)}
                  className={`px-2 py-1 rounded text-[11px] font-medium border whitespace-nowrap ${
                    reviewSection === bp.section
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {bp.section}
                </button>
              ))}
            </div>
          </div>

          {/* Graded Answer Review List */}
          <div className="space-y-3">
            {filteredReviewQuestions.map((q) => {
              const qNumber = questions.findIndex((item) => item.id === q.id) + 1;
              const chosen = answers[q.id];
              const isCorrect = chosen === q.correctIndex;
              const isUnanswered = chosen === undefined;
              const cleanExplanation = getCleanExplanation(q.explanationEn);
              const optionGridClass = getDynamicOptionGridClass(q.optionsEn, false);

              return (
                <article
                  key={q.id}
                  className="bg-white rounded-lg border border-slate-200/90 p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded tabular-nums">
                        Q.{qNumber}
                      </span>
                      <span className="text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded">
                        {q.section}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isUnanswered
                          ? 'bg-slate-50 text-slate-600 border-slate-200'
                          : isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {isUnanswered ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <h3 className="text-[14px] sm:text-[15px] font-medium text-slate-900 leading-relaxed">
                    {cleanQuestionStem(q.textEn)}
                  </h3>

                  <div className={`${optionGridClass} mt-2.5`}>
                    {q.optionsEn.map((optText, optIdx) => {
                      const isRight = optIdx === q.correctIndex;
                      const isPicked = chosen === optIdx;
                      let btnStyle = 'border-slate-200/60 bg-slate-50/20 text-slate-400';
                      let badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
                      if (isRight) {
                        btnStyle =
                          'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-medium';
                        badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                      } else if (isPicked) {
                        btnStyle = 'border-rose-500 bg-rose-50/80 text-rose-950 font-medium';
                        badgeStyle = 'bg-rose-600 text-white border-rose-600';
                      }
                      return (
                        <div
                          key={optIdx}
                          className={`px-2.5 py-1.5 rounded-md border text-[12.5px] sm:text-[13px] leading-snug flex items-center gap-2 ${btnStyle}`}
                        >
                          <span
                            className={`w-4 h-4 rounded text-[10px] font-semibold flex items-center justify-center shrink-0 tabular-nums border ${badgeStyle}`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="break-words">{optText}</span>
                        </div>
                      );
                    })}
                  </div>

                  {cleanExplanation && (
                    <div className="mt-2.5 bg-slate-50 border border-slate-200/80 rounded-md p-2.5 text-xs text-slate-600">
                      {cleanExplanation}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Exam Paper View (when not yet submitted) */}
      {submittedScope === null && (
        <>
          {/* 5-Page Paper Navigator (Page 1 Free · Pages 2–5 Unlocked with Free Account) */}
          {!loading && questions.length > 0 && (
            <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 sm:p-4 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const startQ = (pageNum - 1) * PAGE_SIZE + 1;
                    const endQ = Math.min(pageNum * PAGE_SIZE, questions.length);
                    const locked = pageNum > 1 && !isSignedIn;
                    const pageSlice = questions.slice(startQ - 1, endQ);
                    const pageAnswered = pageSlice.reduce(
                      (acc, q) => (answers[q.id] !== undefined ? acc + 1 : acc),
                      0
                    );
                    const isActive = currentPage === pageNum && !showAuthGate;

                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageSelect(pageNum)}
                        className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium border transition-colors tabular-nums ${
                          isActive
                            ? 'bg-slate-900 text-white border-slate-900'
                            : locked
                            ? 'bg-slate-50 text-slate-500 border-dashed border-slate-300 hover:border-slate-500 hover:text-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        Q{startQ}–{endQ}
                        {locked ? ' · Account' : ` (${pageAnswered}/${pageSlice.length})`}
                      </button>
                    );
                  })}
                </div>

                <span className="text-[11px] text-slate-500">
                  {isSignedIn
                    ? 'Full 100-MCQ paper unlocked'
                    : 'Starter block Q1–Q20 open · Sign up free for Q21–Q100'}
                </span>
              </div>
            </div>
          )}

          {/* Loading / Error / Questions */}
          {loading ? (
            <div className="bg-white border border-slate-200/90 rounded-lg p-10 text-center">
              <p className="text-sm font-medium text-slate-900">
                Generating your randomized 100-MCQ screening paper...
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Sampling across English, Pakistan Studies, General Science, Islamic Studies,
                Aptitude, and World GK.
              </p>
            </div>
          ) : loadError ? (
            <div className="bg-white border border-rose-200 rounded-lg p-8 text-center">
              <p className="text-sm font-semibold text-rose-800">{loadError}</p>
              <button
                type="button"
                onClick={() => loadFreshPaper(isSignedIn)}
                className="mt-3 px-4 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
              >
                Retry Paper Generation
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {currentQuestions.map((q, idx) => {
                const globalNumber = (currentPage - 1) * PAGE_SIZE + idx + 1;
                const chosen = answers[q.id];
                const optionGridClass = getDynamicOptionGridClass(q.optionsEn, false);

                return (
                  <article
                    key={q.id}
                    className="bg-white rounded-lg border border-slate-200/90 p-4 sm:p-5 transition-colors hover:border-slate-300"
                  >
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded tabular-nums">
                            Q.{globalNumber}
                          </span>
                          <span className="text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded">
                            {q.section}
                          </span>
                        </div>
                        {chosen !== undefined && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            Selected {String.fromCharCode(65 + chosen)}
                          </span>
                        )}
                      </div>

                      <h2 className="text-[14px] sm:text-[15px] font-medium text-slate-900 leading-relaxed">
                        {cleanQuestionStem(q.textEn)}
                      </h2>

                      <div className={`${optionGridClass} pt-0.5`}>
                        {q.optionsEn.map((optText, optIdx) => {
                          const isSelected = chosen === optIdx;
                          const btnStyle = isSelected
                            ? 'border-slate-900 bg-slate-900 text-white font-medium'
                            : 'border-slate-200/90 bg-slate-50/40 text-slate-800 hover:bg-slate-100/70 hover:border-slate-300';
                          const badgeStyle = isSelected
                            ? 'bg-white text-slate-900 border-white'
                            : 'bg-white text-slate-600 border-slate-200/90';

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleOptionSelect(q.id, optIdx)}
                              className={`text-left px-2.5 py-1.5 rounded-md border text-[12.5px] sm:text-[13px] leading-snug transition-colors flex items-center gap-2 ${btnStyle}`}
                            >
                              <span
                                className={`w-4 h-4 rounded text-[10px] font-semibold flex items-center justify-center shrink-0 tabular-nums border ${badgeStyle}`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1 min-w-0 break-words">{optText}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* Bottom Action Bar */}
              <div className="mt-6 bg-slate-950 text-white rounded-lg border border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  {isSignedIn ? (
                    <>
                      <h3 className="text-sm font-semibold text-white">
                        Page {currentPage} of {totalPages} · {totalAnsweredCount} / {questions.length}{' '}
                        answered
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Move across pages freely or submit anytime to grade and sync your 6-subject
                        report to My Account.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-sm font-semibold text-white">
                        Starter Screening Block: {starterAnsweredCount} / {STARTER_LIMIT} answered
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Grade your 20-MCQ diagnostic now, or create a free account to unlock
                        Questions 21–100 without losing your answers.
                      </p>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {isSignedIn ? (
                    <>
                      {currentPage > 1 && (
                        <button
                          type="button"
                          onClick={() => handlePageSelect(currentPage - 1)}
                          className="px-3.5 py-2 rounded-md border border-slate-700 text-slate-200 hover:border-slate-500 text-xs font-medium transition-colors"
                        >
                          Previous Page
                        </button>
                      )}
                      {currentPage < totalPages && (
                        <button
                          type="button"
                          onClick={() => handlePageSelect(currentPage + 1)}
                          className="px-3.5 py-2 rounded-md bg-white text-slate-950 hover:bg-slate-100 text-xs font-semibold transition-colors"
                        >
                          Next Page (Q{currentPage * PAGE_SIZE + 1}–
                          {Math.min((currentPage + 1) * PAGE_SIZE, questions.length)}) →
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSubmitScope(100)}
                        className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                      >
                        Submit &amp; Grade Paper
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAuthGate(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3.5 py-2 rounded-md border border-slate-600 text-white hover:border-white text-xs font-medium transition-colors"
                      >
                        Unlock Q21–100 (Free Account)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubmitScope(20)}
                        className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                      >
                        Grade 20-MCQ Starter Test →
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
