'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Loader from '@/components/Loader';
import ShareButtons from '@/components/ShareButtons';
import { absoluteUrl } from '@/lib/seo';
import {
  cleanQuestionStem,
  getCleanExplanation,
  getTopicFromExplanation,
  getWindowedPages,
} from '@/lib/mcqDisplay';
import {
  BookMarked,
  BookOpen,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  HelpCircle,
  Eye,
  Shuffle
} from 'lucide-react';

interface BioQuestion {
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

const TOPICS = [
  'All Topics',
  'Cell Biology',
  'Biological Molecules',
  'Enzymes',
  'Bioenergetics',
  'Cell Cycle',
  'Nutrition & Digestion',
  'Gaseous Exchange & Respiration',
  'Transport System',
  'Homeostasis & Excretion',
  'Support & Movement',
  'Nervous & Chemical Coordination',
  'Reproduction & Development',
  'Genetics & Biotechnology',
  'Ecology & Evolution'
];

const QUESTIONS_PER_PAGE = 20;

export default function BiologyQuizzesPage() {
  const { i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const [questions, setQuestions] = useState<BioQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [currentPage, setCurrentPage] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{ [qId: string]: boolean }>({});
  const [showSindhi, setShowSindhi] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const normalizeBioList = (raw: BioQuestion[]): BioQuestion[] =>
    raw.map((q) => ({
      ...q,
      topic: getTopicFromExplanation(q.explanationEn, q.topic || 'Biology'),
    }));

  const fetchQuestions = async () => {
    setLoading(true);
    let loadedImmediate = 0;

    // 1. Load bundled verified Biology PDF bank immediately so users never stall or hit 10s timeouts
    try {
      const mod = await import('@/data/biology-pdf-mcqs.json');
      const rawFallback = ((mod as any).default ?? mod) as BioQuestion[];
      if (Array.isArray(rawFallback) && rawFallback.length > 0) {
        loadedImmediate = rawFallback.length;
        setQuestions(normalizeBioList(rawFallback));
        setLoading(false);
      }
    } catch (fallbackErr) {
      console.error('Error loading bundled Biology MCQs:', fallbackErr);
    }

    // 2. Sync with live Neon DB in background (only replaces if DB holds newer/additional rows)
    try {
      const res = await axios.get('/api/questions?subject=Biology', { timeout: 8000 });
      if (res.data && Array.isArray(res.data) && res.data.length > loadedImmediate) {
        setQuestions(normalizeBioList(res.data));
      }
    } catch (err) {
      if (loadedImmediate === 0) {
        console.error('Error fetching Biology MCQs:', err);
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

  // Filter & Fisher-Yates shuffle questions
  const displayQuestions = useMemo(() => {
    const filtered =
      selectedTopic === 'All Topics'
        ? questions
        : questions.filter(
          (q) =>
            q.topic === selectedTopic ||
            q.explanationEn?.includes(selectedTopic) ||
            q.textEn.toLowerCase().includes(selectedTopic.toLowerCase())
        );

    if (isShuffled && shuffleOrder.length > 0) {
      const rank = new Map(shuffleOrder.map((id, idx) => [id, idx]));
      return [...filtered].sort((a, b) => (rank.get(a.id) ?? 999999) - (rank.get(b.id) ?? 999999));
    }
    return filtered;
  }, [questions, selectedTopic, isShuffled, shuffleOrder]);

  const totalQuestions = displayQuestions.length;
  const totalPages = Math.max(1, Math.ceil(totalQuestions / QUESTIONS_PER_PAGE));

  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = displayQuestions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

  const handleOptionSelect = (qId: string, optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const toggleReveal = (qId: string) => {
    setRevealedAnswers(prev => ({ ...prev, [qId]: !prev[qId] }));
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

  const bankCountLabel = (questions.length > 0 ? questions.length : 1547).toLocaleString();
  const pageNumbers = getWindowedPages(currentPage, totalPages);

  const shareUrl = absoluteUrl('/quizzes/biology');
  const shareTitle = `Biology ${bankCountLabel} MCQs Solved Bank (بيالوجي) — Sindh, Punjab & Federal Boards`;
  const shareDescription = `Practice ${bankCountLabel} solved Biology MCQs covering Cell Biology, Bioenergetics, Genetics, Physiology & Ecology. MDCAT, NTS, PPSC & SPSC Aligned!`;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-5 sm:space-y-6">

      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-teal-950 text-white p-5 sm:p-8 rounded-3xl shadow-xl border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Sindh • Punjab • Federal Boards • MDCAT Aligned
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-extrabold px-2.5 py-0.5 rounded-full font-sindhi font-lateefi text-sm sm:text-base" dir="rtl">
                بيالوجي سوالنامه {bankCountLabel} MCQs
              </span>
            </div>
            <h1 className="text-xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2.5 sm:gap-3">
              <BookMarked className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 fill-current animate-pulse shrink-0" />
              <span>Biology {bankCountLabel} MCQs Solved Bank (بيالوجي)</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-3xl text-justify [text-align-last:left]">
              Complete {bankCountLabel} Solved Biology MCQs Bank for Grades 9-12 &amp; Competitive Exams (MDCAT, NTS, SPSC, PPSC, FPSC). Topic-wise practice, instant answer key &amp; Sindhi translation toggle.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowSindhi(!showSindhi)}
              className="w-full sm:w-auto justify-center bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 no-print"
            >
              <span>{showSindhi ? 'English Only' : 'سنڌي ٻولي ۾ سوالن لاءِ ھت ڪلڪ ڪريو'}</span>
            </button>

          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 no-print">
        <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-emerald-700 shrink-0" />
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-72 bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-600"
          >
            {TOPICS.map(top => (
              <option key={top} value={top}>📂 {top}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-2.5 sm:gap-3 text-xs">
          <span className="font-bold text-slate-700">
            Total Questions: <span className="text-emerald-800 font-extrabold text-sm">{totalQuestions}</span>
          </span>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleToggleShuffle}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${isShuffled ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{isShuffled ? 'Shuffled' : 'Sequential'}</span>
            </button>

            <button
              onClick={handleResetAnswers}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Pagination Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs no-print">
        <div className="flex items-center gap-2 text-slate-800 font-bold flex-wrap justify-center">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Page {currentPage} of {totalPages}</span>
          {totalQuestions > 0 && (
            <span className="text-slate-500 font-normal text-[11px]">
              (Questions {startIndex + 1} – {Math.min(startIndex + QUESTIONS_PER_PAGE, totalQuestions)})
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {pageNumbers.map((item, i) =>
            item === 'ellipsis' ? (
              <span key={`e-${i}`} className="px-1 text-slate-400 font-bold select-none">…</span>
            ) : (
              <button
                key={item}
                onClick={() => handlePageChange(item)}
                className={`min-w-[1.75rem] h-7 px-1.5 rounded-lg text-[11px] font-bold tabular-nums transition ${item === currentPage ? 'bg-emerald-800 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
              >
                {item}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MCQs List */}
      {loading ? (
        <Loader />
      ) : currentQuestions.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-600">No Biology MCQs found for this topic.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentQuestions.map((q, idx) => {
            const globalIndex = startIndex + idx;
            const userSelected = userAnswers[q.id];
            const isAnswered = userSelected !== undefined;
            const isRevealed = revealedAnswers[q.id];
            const isCorrect = userSelected === q.correctIndex;

            return (
              <div
                key={q.id}
                className={`p-4 sm:p-6 rounded-2xl border transition shadow-xs space-y-3 bg-white page-break-inside-avoid ${isAnswered
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-red-300 bg-red-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                  }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="min-w-[2rem] h-8 px-1.5 rounded-lg bg-emerald-800 text-white font-black text-xs tabular-nums flex items-center justify-center shrink-0 shadow-xs">
                        {globalIndex + 1}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider sm:tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 truncate">
                        {getTopicFromExplanation(q.explanationEn, q.topic || 'Biology')}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleReveal(q.id)}
                      className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 sm:px-3 py-1.5 rounded-lg border border-emerald-200 transition shrink-0 flex items-center gap-1 no-print"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isRevealed ? 'Hide Answer' : 'Reveal Answer'}</span>
                    </button>
                  </div>

                  <div className="w-full min-w-0 space-y-1.5">
                    <h3 className="mcq-question-text font-bold sm:font-extrabold text-slate-900">
                      {cleanQuestionStem(q.textEn)}
                    </h3>

                    {showSindhi && q.textUr && q.textUr.trim() !== q.textEn.trim() && (
                      <p className="text-base font-sindhi font-lateefi text-right text-emerald-950 pt-1 font-bold break-words" dir="rtl">
                        {cleanQuestionStem(q.textUr)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.optionsEn.map((optText, optIdx) => {
                    const isOptionSelected = userSelected === optIdx;
                    const isCorrectAnswer = optIdx === q.correctIndex;

                    let btnStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200';

                    if (isAnswered || isRevealed) {
                      if (isCorrectAnswer) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs';
                      } else if (isOptionSelected) {
                        btnStyle = 'bg-red-600 text-white border-red-600 font-bold';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleOptionSelect(q.id, optIdx)}
                        className={`w-full text-left p-3 sm:p-3.5 rounded-xl border text-xs sm:text-[13px] transition flex items-start sm:items-center gap-2.5 ${btnStyle}`}
                      >
                        <span className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center text-[10px] font-extrabold mt-0.5 sm:mt-0 ${isCorrectAnswer && (isAnswered || isRevealed)
                            ? 'bg-white text-emerald-950 border-white'
                            : isOptionSelected && !isCorrectAnswer
                              ? 'bg-white text-red-950 border-white'
                              : 'border-slate-300 text-slate-500'
                          }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>

                        <span className="flex-1 min-w-0 font-medium mcq-option-text">
                          {optText}
                          {showSindhi && q.optionsUr && q.optionsUr[optIdx] && q.optionsUr[optIdx].trim() !== optText.trim() && (
                            <span className="block font-sindhi font-lateefi text-right text-sm pt-0.5" dir="rtl">
                              {q.optionsUr[optIdx]}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Reveal */}
                {(isRevealed || isAnswered) && (() => {
                  const cleanExp = getCleanExplanation(q.explanationEn);
                  return (
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                      <p className="font-bold flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="min-w-0 mcq-option-text">
                          Correct Answer: {String.fromCharCode(65 + q.correctIndex)}. {q.optionsEn[q.correctIndex]}
                        </span>
                      </p>
                      {cleanExp && (
                        <p className="text-[11px] text-slate-600 pt-0.5 mcq-option-text">
                          <span className="font-bold text-slate-800">Explanation:</span> {cleanExp}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Pagination */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 no-print">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 sm:px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-xs font-bold flex items-center gap-1 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>

        {pageNumbers.map((item, i) =>
          item === 'ellipsis' ? (
            <span key={`be-${i}`} className="px-1 text-slate-400 font-bold select-none text-xs">…</span>
          ) : (
            <button
              key={item}
              onClick={() => handlePageChange(item)}
              className={`min-w-[2rem] h-8 px-2 rounded-lg text-xs font-bold tabular-nums transition ${item === currentPage ? 'bg-emerald-800 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 sm:px-4 py-2 rounded-xl border border-emerald-800 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-30 text-white text-xs font-black flex items-center gap-1 transition shadow-xs"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Social Share Footer */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center no-print">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Share Biology {bankCountLabel} MCQs Bank with Fellow Candidates</span>
        </h3>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Help students and candidates preparing for Sindh, Punjab, Federal Board Exams &amp; MDCAT by sharing this free {bankCountLabel}-question Biology practice paper!
        </p>
        <div className="flex justify-center pt-1">
          <ShareButtons
            url={shareUrl}
            title={shareTitle}
            description={shareDescription}
          />
        </div>
      </div>

    </div>
  );
}
