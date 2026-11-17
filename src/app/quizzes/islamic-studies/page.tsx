'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Loader from '@/components/Loader';
import { getCleanExplanation, getTopicFromExplanation, getWindowedPages } from '@/lib/mcqDisplay';

interface IslamicQuestion {
  id: string;
  subject: string;
  textEn: string;
  textUr?: string;
  optionsEn: string[];
  optionsUr?: string[];
  correctIndex: number;
  explanationEn?: string;
  topic?: string;
}

const CATEGORIES = [
  'All Categories',
  'Beliefs (Aqaid)',
  'Pillars of Islam',
  'The Holy Quran',
  'Hadith & Sunnah',
  'Seerat-un-Nabi (ﷺ)',
  'Khulafa-e-Rashideen',
  'Islamic History',
  'Fiqh & Ibadat',
  'Ethics & Society',
];

const QUESTIONS_PER_PAGE = 20;

export default function IslamicStudiesPage() {
  const [questions, setQuestions] = useState<IslamicQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{ [qId: string]: boolean }>({});
  const [showSindhi, setShowSindhi] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    let immediateCount = 0;

    try {
      const mod = await import('@/data/islamic-pdf-mcqs.json');
      const fallback = ((mod as any).default ?? mod) as IslamicQuestion[];
      if (Array.isArray(fallback) && fallback.length > 0) {
        immediateCount = fallback.length;
        setQuestions(fallback);
        setLoading(false);
      }
    } catch (e) {
      console.error('Failed to load bundled Islamic Studies MCQs:', e);
    }

    try {
      const res = await axios.get('/api/questions?subject=Islamic%20Studies', { timeout: 8000 });
      if (res.data && Array.isArray(res.data) && res.data.length > immediateCount) {
        setQuestions(res.data);
      }
    } catch (err) {
      if (immediateCount === 0) {
        console.error('Error fetching Islamic Studies MCQs:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShuffle = () => {
    if (!isShuffled) {
      const ids = questions.map((q) => q.id);
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
      setShuffleOrder(ids);
      setIsShuffled(true);
    } else {
      setIsShuffled(false);
    }
    setCurrentPage(1);
  };

  const displayQuestions = useMemo(() => {
    const qLower = searchQuery.trim().toLowerCase();
    const filtered = questions.filter((q) => {
      if (selectedCategory !== 'All Categories') {
        const cat = getTopicFromExplanation(q.explanationEn, q.topic || 'Islamic Studies');
        const matchesCat =
          cat === selectedCategory ||
          q.topic === selectedCategory ||
          q.explanationEn?.includes(selectedCategory);
        if (!matchesCat) return false;
      }
      if (qLower) {
        const inStem = q.textEn.toLowerCase().includes(qLower);
        const inOpts = q.optionsEn.some((o) => o.toLowerCase().includes(qLower));
        if (!inStem && !inOpts) return false;
      }
      return true;
    });

    if (isShuffled && shuffleOrder.length > 0) {
      const rank = new Map(shuffleOrder.map((id, idx) => [id, idx]));
      return [...filtered].sort((a, b) => (rank.get(a.id) ?? 999999) - (rank.get(b.id) ?? 999999));
    }
    return filtered;
  }, [questions, selectedCategory, searchQuery, isShuffled, shuffleOrder]);

  const totalQuestions = displayQuestions.length;
  const totalPages = Math.max(1, Math.ceil(totalQuestions / QUESTIONS_PER_PAGE));

  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = displayQuestions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

  const answeredIds = Object.keys(userAnswers);
  const answeredCount = answeredIds.length;
  const correctCount = answeredIds.reduce((acc, id) => {
    const q = questions.find((item) => item.id === id);
    return q && userAnswers[id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const handleOptionSelect = (qId: string, optIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const toggleReveal = (qId: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleResetAnswers = () => {
    setUserAnswers({});
    setRevealedAnswers({});
    setCurrentPage(1);
  };

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const bankTotal = questions.length > 0 ? questions.length.toLocaleString() : '1,711';

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* ───── Editorial Header ───── */}
      <section className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Islamic Studies · FPSC · PPSC · SPSC · NTS
              </p>
              <h1 className="mt-2.5 text-2xl sm:text-[2.15rem] font-semibold tracking-tight text-slate-900 leading-tight">
                Islamic Studies (Islamiat) Question Bank
              </h1>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                {bankTotal} verified multiple-choice questions covering Beliefs (Aqaid), Pillars of
                Islam, the Holy Quran, Hadith &amp; Sunnah, Seerat-un-Nabi (ﷺ), Khulafa-e-Rashideen,
                Islamic History, Fiqh, and Ethics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 no-print">
              <button
                type="button"
                onClick={() => setShowSindhi(!showSindhi)}
                className={`h-9 px-3.5 rounded-md border text-[13px] font-medium transition-colors ${
                  showSindhi
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-slate-900'
                }`}
              >
                {showSindhi ? 'English only' : 'Sindhi translation (سنڌي)'}
              </button>
              <Link
                href="/quizzes/random-test?subject=Islamic%20Studies&count=10"
                className="h-9 inline-flex items-center px-3.5 rounded-md border border-slate-300 hover:border-slate-900 text-[13px] font-medium text-slate-800 transition-colors"
              >
                10-question random test →
              </Link>
            </div>
          </div>

          {/* ───── Category Tabs ───── */}
          <div
            className="mt-7 flex items-center gap-5 overflow-x-auto no-scrollbar border-b border-slate-200 text-[13px] no-print"
            role="tablist"
            aria-label="Islamic Studies categories"
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`pb-2.5 -mb-px border-b-2 whitespace-nowrap transition-colors ${
                    active
                      ? 'border-slate-900 text-slate-900 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-900 font-medium'
                  }`}
                >
                  {cat === 'All Categories' ? 'All topics' : cat}
                </button>
              );
            })}
          </div>

          {/* ───── Search & Utility Bar ───── */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Filter questions by keyword (e.g. Badr, Surah, Zakat, Hijrah)..."
                aria-label="Filter Islamic Studies questions"
                className="w-full h-9 px-3 rounded-md border border-slate-300 bg-white text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="text-[12px] text-slate-500 hover:text-slate-900 px-2 shrink-0"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-slate-600">
              <span className="tabular-nums">
                Showing <strong className="font-semibold text-slate-900">{totalQuestions.toLocaleString()}</strong> questions
              </span>
              {answeredCount > 0 && (
                <span className="tabular-nums text-emerald-800 font-medium">
                  Score: {correctCount} / {answeredCount}
                </span>
              )}
              <button
                type="button"
                onClick={handleToggleShuffle}
                className={`underline underline-offset-4 transition-colors ${
                  isShuffled ? 'text-emerald-800 font-medium' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isShuffled ? 'Order: Shuffled' : 'Shuffle order'}
              </button>
              {(answeredCount > 0 || Object.keys(revealedAnswers).length > 0) && (
                <button
                  type="button"
                  onClick={handleResetAnswers}
                  className="text-slate-500 hover:text-slate-900 underline underline-offset-4 transition-colors"
                >
                  Reset answers
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ───── Main Content ───── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Top Pagination */}
        {totalQuestions > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 text-[13px] no-print">
            <div className="text-slate-600 tabular-nums">
              Page <strong className="font-semibold text-slate-900">{currentPage}</strong> of{' '}
              <strong className="font-semibold text-slate-900">{totalPages}</strong>
              <span className="text-slate-400 ml-2">
                (Questions {startIndex + 1}–{Math.min(startIndex + QUESTIONS_PER_PAGE, totalQuestions)})
              </span>
            </div>

            <div className="flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 px-2.5 rounded border border-slate-300 text-[12px] font-medium text-slate-700 hover:border-slate-900 disabled:opacity-35 disabled:hover:border-slate-300 transition-colors"
              >
                Prev
              </button>

              {getWindowedPages(currentPage, totalPages).map((p, idx) =>
                p === 'ellipsis' ? (
                  <span key={`el-${idx}`} className="px-1.5 text-slate-400 text-[12px]">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    className={`min-w-[2rem] h-8 px-2 rounded text-[12px] tabular-nums font-medium transition-colors ${
                      p === currentPage
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 px-2.5 rounded border border-slate-300 text-[12px] font-medium text-slate-700 hover:border-slate-900 disabled:opacity-35 disabled:hover:border-slate-300 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Questions List */}
        {loading ? (
          <Loader />
        ) : currentQuestions.length === 0 ? (
          <div className="py-16 text-center border border-slate-200 rounded-md">
            <p className="text-sm text-slate-600">No questions match your current filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {currentQuestions.map((q, idx) => {
              const globalIndex = startIndex + idx;
              const userSelected = userAnswers[q.id];
              const isAnswered = userSelected !== undefined;
              const isRevealed = revealedAnswers[q.id];
              const topicLabel = getTopicFromExplanation(q.explanationEn, q.topic || 'Islamic Studies');
              const cleanExp = getCleanExplanation(q.explanationEn);

              return (
                <article
                  key={q.id}
                  className="py-6 space-y-4 page-break-inside-avoid"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span className="text-[12px] font-semibold text-slate-400 tabular-nums shrink-0">
                        Q{String(globalIndex + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-700 truncate">
                        {topicLabel}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleReveal(q.id)}
                      className="text-[12px] text-slate-500 hover:text-slate-900 underline underline-offset-4 shrink-0 no-print"
                    >
                      {isRevealed ? 'Hide answer' : 'Show answer'}
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="mcq-question-text text-[15px] sm:text-base font-medium text-slate-900 leading-relaxed">
                      {q.textEn.replace(/_+/g, '______')}
                    </h2>

                    {showSindhi && q.textUr && q.textUr.trim() !== q.textEn.trim() && (
                      <p
                        className="text-base font-sindhi font-lateefi text-right text-slate-800 pt-1 leading-relaxed break-words"
                        dir="rtl"
                      >
                        {q.textUr}
                      </p>
                    )}
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.optionsEn.map((optText, optIdx) => {
                      const isOptionSelected = userSelected === optIdx;
                      const isCorrectAnswer = optIdx === q.correctIndex;

                      let btnStyle =
                        'border-slate-200 bg-white text-slate-800 hover:border-slate-400';

                      if (isAnswered || isRevealed) {
                        if (isCorrectAnswer) {
                          btnStyle =
                            'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-medium';
                        } else if (isOptionSelected) {
                          btnStyle =
                            'border-rose-600 bg-rose-50/70 text-rose-950 font-medium';
                        } else {
                          btnStyle = 'border-slate-200 bg-slate-50/40 text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleOptionSelect(q.id, optIdx)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-md border text-[13px] sm:text-sm transition-colors flex items-baseline gap-3 ${btnStyle}`}
                        >
                          <span className="text-[12px] font-semibold tabular-nums text-slate-400 shrink-0">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>

                          <span className="flex-1 min-w-0 mcq-option-text leading-snug">
                            {optText}
                            {showSindhi &&
                              q.optionsUr &&
                              q.optionsUr[optIdx] &&
                              q.optionsUr[optIdx].trim() !== optText.trim() && (
                                <span
                                  className="block font-sindhi font-lateefi text-right text-sm pt-0.5 text-slate-700"
                                  dir="rtl"
                                >
                                  {q.optionsUr[optIdx]}
                                </span>
                              )}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Answer & Explanation */}
                  {(isRevealed || isAnswered) && (
                    <div className="pt-1 text-[13px] text-slate-600 space-y-1">
                      <p>
                        <span className="font-semibold text-emerald-800">
                          Correct answer: {String.fromCharCode(65 + q.correctIndex)}.{' '}
                          {q.optionsEn[q.correctIndex]}
                        </span>
                      </p>
                      {cleanExp && (
                        <p className="text-[12px] text-slate-500 leading-relaxed">
                          {cleanExp}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom Pagination */}
        {totalQuestions > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-[13px] no-print">
            <div className="text-slate-500 tabular-nums">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 px-3 rounded border border-slate-300 text-[12px] font-medium text-slate-700 hover:border-slate-900 disabled:opacity-35 transition-colors"
              >
                Previous
              </button>

              {getWindowedPages(currentPage, totalPages).map((p, idx) =>
                p === 'ellipsis' ? (
                  <span key={`bel-${idx}`} className="px-1.5 text-slate-400 text-[12px]">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    className={`min-w-[2rem] h-8 px-2 rounded text-[12px] tabular-nums font-medium transition-colors ${
                      p === currentPage
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 px-3 rounded border border-slate-300 text-[12px] font-medium text-slate-700 hover:border-slate-900 disabled:opacity-35 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
