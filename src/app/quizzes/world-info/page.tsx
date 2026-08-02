'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Loader from '@/components/Loader';
import {
  ArrowLeft, Globe, MapPin, Banknote, Crown, ChevronLeft, ChevronRight,
  Sparkles, CheckCircle2, XCircle, Lock, Send, RotateCcw, Award, AlertCircle, HelpCircle
} from 'lucide-react';
import { IQuestion } from '@/lib/types';

// ─── Tab & Section Definitions ───────────────────────────────────────────────

type CategoryId = 'capitals' | 'currencies' | 'leaders';

interface Continent {
  id: string;
  label: string;
  emoji: string;
  subject: string;
  count: number;
}

const CATEGORIES: { id: CategoryId; label: string; icon: any; emoji: string; color: string }[] = [
  { id: 'capitals',   label: 'World Capitals',   icon: MapPin,   emoji: '🏛️', color: 'from-blue-600 to-indigo-700' },
  { id: 'currencies', label: 'World Currencies', icon: Banknote, emoji: '💰', color: 'from-emerald-600 to-teal-700' },
  { id: 'leaders',    label: 'World Leaders',    icon: Crown,    emoji: '👑', color: 'from-amber-600 to-yellow-700' },
];

const CONTINENTS: Record<CategoryId, Continent[]> = {
  capitals: [
    { id: 'asia',     label: 'Asia',     emoji: '🌏', subject: 'World Capitals - Asia',       count: 47 },
    { id: 'africa',   label: 'Africa',   emoji: '🌍', subject: 'World Capitals - Africa',     count: 54 },
    { id: 'europe',   label: 'Europe',   emoji: '🏛️', subject: 'World Capitals - Europe',     count: 45 },
    { id: 'americas', label: 'Americas', emoji: '🌎', subject: 'World Capitals - Americas',   count: 35 },
    { id: 'oceania',  label: 'Oceania',  emoji: '🏝️', subject: 'World Capitals - Oceania',    count: 14 },
  ],
  currencies: [
    { id: 'asia',     label: 'Asia',     emoji: '🌏', subject: 'World Currencies - Asia',     count: 47 },
    { id: 'africa',   label: 'Africa',   emoji: '🌍', subject: 'World Currencies - Africa',   count: 54 },
    { id: 'europe',   label: 'Europe',   emoji: '🏛️', subject: 'World Currencies - Europe',   count: 45 },
    { id: 'americas', label: 'Americas', emoji: '🌎', subject: 'World Currencies - Americas', count: 35 },
    { id: 'oceania',  label: 'Oceania',  emoji: '🏝️', subject: 'World Currencies - Oceania',  count: 14 },
  ],
  leaders: [
    { id: 'all', label: 'All Leaders', emoji: '👑', subject: 'World Leaders', count: 30 },
  ],
};

const ITEMS_PER_PAGE = 20;

// ─── Main Component ──────────────────────────────────────────────────────────

export default function WorldInfoPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('capitals');
  const [activeContinent, setActiveContinent] = useState<Continent>(CONTINENTS.capitals[0]);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load questions when subject changes
  const loadQuestions = useCallback(async (subject: string) => {
    setLoading(true);
    setFetchError('');
    setQuestions([]);
    setUserAnswers({});
    setIsSubmitted(false);
    setCurrentPage(1);
    try {
      const res = await axios.get(`/api/questions?subject=${encodeURIComponent(subject)}`);
      const data: IQuestion[] = Array.isArray(res.data) ? res.data : [];
      data.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setQuestions(data);
    } catch {
      setFetchError('Failed to load questions. Please retry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions(activeContinent.subject);
  }, [activeContinent, loadQuestions]);

  // Category switch
  const handleCategoryChange = (cat: CategoryId) => {
    setActiveCategory(cat);
    const firstContinent = CONTINENTS[cat][0];
    setActiveContinent(firstContinent);
  };

  // Continent switch
  const handleContinentChange = (cont: Continent) => {
    if (cont.subject === activeContinent.subject) return;
    setActiveContinent(cont);
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(questions.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const answeredCount = Object.keys(userAnswers).length;
  let correctCount = 0;
  questions.forEach(q => { if (userAnswers[q._id] === q.correctIndex) correctCount++; });
  const scorePercentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const isPassed = scorePercentage >= 50;

  const handleOptionSelect = (qId: string, optIdx: number) => {
    if (isSubmitted || userAnswers[qId] !== undefined) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    if (answeredCount === 0) {
      if (!confirm('No answers yet. Submit anyway?')) return;
    }
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCat = CATEGORIES.find(c => c.id === activeCategory)!;
  const continents = CONTINENTS[activeCategory];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-5">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl p-5 sm:p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-10 bg-blue-400 blur-3xl" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <Link href="/quizzes" className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white transition mb-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to MCQ Subjects
            </Link>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-400 shrink-0" />
              World Info MCQs
            </h1>
            <p className="text-xs text-slate-300">
              🏛️ World Capitals &nbsp;·&nbsp; 💰 World Currencies &nbsp;·&nbsp; 👑 World Leaders &nbsp;·&nbsp; 420 MCQs Total
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/15 text-center shrink-0">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Progress</span>
            <span className="text-sm font-extrabold text-blue-300">{answeredCount} / {questions.length} Answered</span>
          </div>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="grid grid-cols-3 gap-3">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 sm:p-4 rounded-xl border font-bold text-xs sm:text-sm transition-all duration-200 ${
                isActive
                  ? `bg-gradient-to-br ${cat.color} text-white border-transparent shadow-lg`
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <span className="text-lg sm:text-xl">{cat.emoji}</span>
              <span className="text-center leading-tight">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Continent Sub-tabs ── */}
      {continents.length > 1 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 pt-3 pb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Region</p>
          </div>
          <div className="flex overflow-x-auto gap-1 px-4 pb-0" style={{ scrollbarWidth: 'none' }}>
            {continents.map(cont => {
              const isActive = cont.subject === activeContinent.subject;
              return (
                <button
                  key={cont.id}
                  onClick={() => handleContinentChange(cont)}
                  className={`relative shrink-0 px-4 py-2.5 text-[11px] font-bold rounded-t-lg border-b-2 transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />}
                    {cont.emoji} {cont.label}
                    <span className="text-[9px] text-slate-400 font-semibold ml-0.5">({cont.count})</span>
                  </span>
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
                </button>
              );
            })}
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex items-center justify-between px-4 py-2 bg-slate-50 text-[11px]">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-500" />
              {activeCat.emoji} {activeCat.label} — {activeContinent.emoji} {activeContinent.label}
              &nbsp;|&nbsp; {questions.length} Questions &nbsp;|&nbsp; {ITEMS_PER_PAGE} per page
            </span>
          </div>
        </div>
      )}

      {/* Leaders heading (no sub-tabs) */}
      {continents.length === 1 && !loading && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex items-center gap-2 text-[11px] font-semibold text-slate-700">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>👑 World Leaders — {questions.length} Current Leaders &nbsp;|&nbsp; {ITEMS_PER_PAGE} per page</span>
        </div>
      )}

      {/* ── Error ── */}
      {fetchError && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-center gap-3 text-xs text-red-800">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="font-bold flex-1">{fetchError}</p>
          <button onClick={() => loadQuestions(activeContinent.subject)}
            className="bg-red-100 hover:bg-red-200 border border-red-300 font-bold px-3 py-1.5 rounded-lg text-[11px] transition">
            Retry
          </button>
        </div>
      )}

      {/* ── Score Result ── */}
      {isSubmitted && (
        <div className={`p-5 rounded-xl border shadow-sm text-center space-y-3 ${
          isPassed ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
        }`}>
          <Award className="w-10 h-10 mx-auto" />
          <h2 className="text-lg font-black">{isPassed ? '🎉 EXCELLENT!' : '⚠️ REVIEW & RETRY'}</h2>
          <div className="flex justify-center items-center gap-8">
            <div><p className="text-[11px] text-slate-500">Correct</p><p className="text-2xl font-black">{correctCount}/{questions.length}</p></div>
            <div className="border-r border-slate-300 h-8" />
            <div><p className="text-[11px] text-slate-500">Score</p><p className="text-2xl font-black">{scorePercentage}%</p></div>
            <div className="border-r border-slate-300 h-8" />
            <div><p className="text-[11px] text-slate-500">Attempted</p><p className="text-2xl font-black">{answeredCount}</p></div>
          </div>
          <button onClick={handleRetake}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition">
            <RotateCcw className="w-3.5 h-3.5" /> Retake Test
          </button>
        </div>
      )}

      {/* ── Top Pagination ── */}
      {!loading && questions.length > 0 && (
        <PaginationBar currentPage={currentPage} totalPages={totalPages} startIndex={startIndex}
          total={questions.length} perPage={ITEMS_PER_PAGE} onChange={handlePageChange} />
      )}

      {/* ── Questions ── */}
      {loading ? (
        <Loader />
      ) : questions.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center border border-slate-200 space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No questions found</p>
          <p className="text-xs text-slate-400">
            Please run <code className="bg-slate-100 px-1 rounded">node seed_world_info.js</code> to populate these questions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentQuestions.map((q, idx) => {
            const displayNumber = startIndex + idx + 1;
            const selectedOpt = userAnswers[q._id];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div key={q._id} className={`bg-white rounded-xl border p-4 shadow-sm space-y-3 transition ${
                isSubmitted
                  ? isCorrect ? 'border-emerald-300 bg-emerald-50/40'
                    : selectedOpt !== undefined ? 'border-red-300 bg-red-50/30'
                    : 'border-amber-200 bg-amber-50/20'
                  : isAnswered ? 'border-blue-300 bg-blue-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}>
                {/* Question Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className={`w-8 h-8 rounded-lg text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm leading-none bg-gradient-to-br ${activeCat.color}`}>
                      {displayNumber}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug pt-1">{q.textEn}</h3>
                  </div>
                  {isSubmitted ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shrink-0 ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800'
                        : selectedOpt !== undefined ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isCorrect ? <><CheckCircle2 className="w-3 h-3" /><span>Correct</span></>
                        : selectedOpt !== undefined ? <><XCircle className="w-3 h-3" /><span>Wrong</span></>
                        : <span>Skipped</span>}
                    </span>
                  ) : isAnswered ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 shrink-0">
                      <Lock className="w-3 h-3" /><span>Locked</span>
                    </span>
                  ) : null}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.optionsEn.map((optText, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    const isRight = optIdx === q.correctIndex;
                    let style = 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer';
                    if (isSubmitted) {
                      style = isRight ? 'border-emerald-500 bg-emerald-100/90 text-emerald-950 font-semibold cursor-default'
                        : isSelected ? 'border-red-500 bg-red-100/90 text-red-950 cursor-default'
                        : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 cursor-default';
                    } else if (isAnswered) {
                      style = isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-semibold ring-1 ring-blue-500 cursor-default'
                        : 'border-slate-200 bg-slate-50/70 text-slate-400 opacity-60 cursor-not-allowed';
                    }
                    return (
                      <button key={optIdx} type="button" disabled={isAnswered || isSubmitted}
                        onClick={() => handleOptionSelect(q._id, optIdx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center gap-2.5 ${style}`}>
                        <div className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center text-[10px] font-bold ${
                          isSubmitted && isRight ? 'border-emerald-600 bg-emerald-600 text-white'
                            : isSubmitted && isSelected ? 'border-red-600 bg-red-600 text-white'
                            : isSelected ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 text-slate-500'
                        }`}>{String.fromCharCode(65 + optIdx)}</div>
                        <span className="font-medium leading-normal">{optText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Submit Button ── */}
      {!isSubmitted && !loading && questions.length > 0 && (
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div>
            <h4 className="text-xs font-bold text-slate-200">Ready to check your answers?</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{answeredCount} of {questions.length} answered</p>
          </div>
          <button onClick={handleSubmit}
            className={`w-full sm:w-auto text-white text-xs font-extrabold px-6 py-2.5 rounded-lg transition shadow flex items-center justify-center gap-2 bg-gradient-to-r ${activeCat.color}`}>
            <Send className="w-4 h-4" /> Submit &amp; See Score
          </button>
        </div>
      )}

      {/* ── Bottom Pagination ── */}
      {!loading && questions.length > 0 && (
        <PaginationBar currentPage={currentPage} totalPages={totalPages} startIndex={startIndex}
          total={questions.length} perPage={ITEMS_PER_PAGE} onChange={handlePageChange} />
      )}
    </div>
  );
}

// ─── Pagination Component ─────────────────────────────────────────────────────
function PaginationBar({ currentPage, totalPages, startIndex, total, perPage, onChange }: {
  currentPage: number; totalPages: number; startIndex: number; total: number; perPage: number; onChange: (p: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm text-xs">
      <div className="flex items-center gap-2 text-slate-800 font-bold">
        <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
        <span>Page {currentPage} of {totalPages}</span>
        <span className="text-slate-400 font-normal text-[11px]">(Q{startIndex + 1}–Q{Math.min(startIndex + perPage, total)})</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <button onClick={() => onChange(currentPage - 1)} disabled={currentPage === 1}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition">
          <ChevronLeft className="w-3.5 h-3.5" /><span>Prev</span>
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-lg text-[11px] font-bold transition ${
              p === currentPage ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}>{p}</button>
        ))}
        <button onClick={() => onChange(currentPage + 1)} disabled={currentPage === totalPages}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition">
          <span>Next</span><ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
