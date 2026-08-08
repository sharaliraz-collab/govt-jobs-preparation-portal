'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Loader from '@/components/Loader';
import ShareButtons from '@/components/ShareButtons';
import { absoluteUrl } from '@/lib/seo';
import {
  BookMarked,
  BookOpen,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Printer,
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
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{ [qId: string]: boolean }>({});
  const [showSindhi, setShowSindhi] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/questions?subject=Biology&limit=1000');
      if (res.data && Array.isArray(res.data)) {
        setQuestions(res.data);
      }
    } catch (err) {
      console.error('Error fetching Biology MCQs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter & shuffle questions
  let displayQuestions = selectedTopic === 'All Topics'
    ? questions
    : questions.filter(q => q.topic === selectedTopic || q.explanationEn?.includes(selectedTopic) || q.textEn.toLowerCase().includes(selectedTopic.toLowerCase()));

  if (isShuffled && displayQuestions.length > 0) {
    displayQuestions = [...displayQuestions].sort((a, b) => (a.id > b.id ? 1 : -1));
  }

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

  const handlePrint = () => {
    window.print();
  };

  const shareUrl = absoluteUrl('/quizzes/biology');
  const shareTitle = 'Biology 1000 MCQs Solved Bank (بيالوجي) — Sindh, Punjab & Federal Boards';
  const shareDescription = 'Practice 1000 solved Biology MCQs covering Cell Biology, Bioenergetics, Genetics, Physiology & Ecology. MDCAT, NTS, PPSC & SPSC Aligned!';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 space-y-6">

      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Sindh • Punjab • Federal Boards • MDCAT Aligned
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full font-sindhi font-lateefi text-base" dir="rtl">
                بيالوجي سوالنامه 1000 MCQs
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <BookMarked className="w-8 h-8 text-emerald-400 fill-current animate-pulse" />
              <span>Biology 1000 MCQs Solved Bank (بيالوجي)</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-3xl">
              Complete 1000 Solved Biology MCQs Bank for Grades 9-12 &amp; Competitive Exams (MDCAT, NTS, SPSC, PPSC, FPSC). Topic-wise practice, instant answer key &amp; Sindhi translation toggle.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowSindhi(!showSindhi)}
              className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 no-print"
            >
              <span>{showSindhi ? 'English Only' : 'سنڌي ٻولي ۾ سوالن لاءِ ھت ڪلڪ ڪريو'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 no-print"
              title="Print questions or save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print Out PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3 w-full md:w-auto">
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

        <div className="flex items-center justify-between w-full md:w-auto gap-4 text-xs">
          <span className="font-bold text-slate-700">
            Total Questions: <span className="text-emerald-800 font-extrabold text-sm">{totalQuestions}</span>
          </span>

          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
              isShuffled ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{isShuffled ? 'Shuffled' : 'Sequential'}</span>
          </button>

          <button
            onClick={handleResetAnswers}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Answers</span>
          </button>
        </div>
      </div>

      {/* Top Pagination Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs no-print">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Page {currentPage} of {totalPages}</span>
          <span className="text-slate-500 font-normal text-[11px]">
            (Questions {startIndex + 1} – {Math.min(startIndex + QUESTIONS_PER_PAGE, totalQuestions)})
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev Page</span>
          </button>

          {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-7 h-7 rounded-lg text-[11px] font-bold transition ${
                  pageNum === currentPage ? 'bg-emerald-800 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition"
          >
            <span>Next Page</span>
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
                className={`p-5 sm:p-6 rounded-2xl border transition shadow-xs space-y-3 bg-white page-break-inside-avoid ${
                  isAnswered
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-red-300 bg-red-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {globalIndex + 1}
                    </span>
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {q.topic || 'Biology'}
                      </span>

                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed">
                        {q.textEn}
                      </h3>

                      {showSindhi && q.textUr && (
                        <p className="text-base font-sindhi font-lateefi text-right text-emerald-950 pt-1 font-bold" dir="rtl">
                          {q.textUr}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleReveal(q.id)}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition shrink-0 flex items-center gap-1 no-print"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isRevealed ? 'Hide Answer' : 'Reveal Answer'}</span>
                  </button>
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
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center gap-2.5 ${btnStyle}`}
                      >
                        <span className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center text-[10px] font-extrabold ${
                          isCorrectAnswer && (isAnswered || isRevealed)
                            ? 'bg-white text-emerald-950 border-white'
                            : isOptionSelected && !isCorrectAnswer
                            ? 'bg-white text-red-950 border-white'
                            : 'border-slate-300 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>

                        <span className="flex-1 font-medium">
                          {optText}
                          {showSindhi && q.optionsUr && q.optionsUr[optIdx] && (
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
                {(isRevealed || isAnswered) && (
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Correct Answer: {String.fromCharCode(65 + q.correctIndex)}. {q.optionsEn[q.correctIndex]}</span>
                    </p>
                    {q.explanationEn && (
                      <p className="text-[11px] text-slate-600 pt-0.5">
                        <span className="font-bold text-slate-800">Explanation:</span> {q.explanationEn}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Pagination */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center gap-2 no-print">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-xs font-bold flex items-center gap-1 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Page</span>
        </button>

        <span className="text-xs font-bold text-slate-700 px-3">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-xl border border-emerald-800 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black flex items-center gap-1 transition shadow-xs"
        >
          <span>Next Page</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Social Share Footer */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center no-print">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Share Biology 1000 MCQs Bank with Fellow Candidates</span>
        </h3>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Help students and candidates preparing for Sindh, Punjab, Federal Board Exams &amp; MDCAT by sharing this free 1000-question Biology practice paper!
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
