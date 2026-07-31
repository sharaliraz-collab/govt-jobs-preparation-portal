'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Loader from '@/components/Loader';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Award,
  Lock,
  Send
} from 'lucide-react';
import { IQuestion } from '@/lib/types';

export default function EnglishGrammarMCQsPage() {
  const { i18n } = useTranslation();

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: string]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const itemsPerPage = 25;

  useEffect(() => {
    fetchEnglishQuestions();
  }, []);

  const fetchEnglishQuestions = async () => {
    setLoading(true);
    try {
      const targetSub = encodeURIComponent('English');
      const res = await axios.get(`/api/questions?subject=${targetSub}`);
      if (res.data && res.data.length > 0) {
        setQuestions(res.data);
      } else {
        const fallbackRes = await axios.get('/api/questions');
        const englishOnly = fallbackRes.data.filter((q: any) =>
          q.subject?.toLowerCase().includes('english')
        );
        setQuestions(englishOnly.length > 0 ? englishOnly : fallbackRes.data);
      }
    } catch (err) {
      console.error('Error fetching English questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(questions.length / itemsPerPage) || 4;

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    // If test is submitted or question answer is already locked, prevent changes
    if (isSubmitted || userAnswers[questionId] !== undefined) return;

    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitTest = () => {
    if (Object.keys(userAnswers).length === 0) {
      if (!confirm('You have not selected any answers yet. Are you sure you want to submit?')) {
        return;
      }
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentQuestions = questions.slice(startIndex, startIndex + itemsPerPage);

  // Score calculation
  const totalQuestionsCount = questions.length || 100;
  const answeredCount = Object.keys(userAnswers).length;
  let correctCount = 0;
  questions.forEach(q => {
    if (userAnswers[q._id] === q.correctIndex) {
      correctCount++;
    }
  });

  const scorePercentage = Math.round((correctCount / totalQuestionsCount) * 100);
  const isPassed = scorePercentage >= 50;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
      {/* Header Banner - Compact & Premium */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-5 sm:p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white transition mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to MCQs Prep</span>
            </Link>

            <h1 className="text-lg sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-govt-gold shrink-0" />
              <span>100 English Grammar & Composition MCQs</span>
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Parts of Speech, Synonyms, Antonyms, Error Detection & Reading Comprehension.
            </p>
          </div>

          {/* Test Status Indicator */}
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/15 text-center shrink-0 min-w-[140px]">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Attempt Status</span>
            <span className="text-sm font-extrabold text-govt-gold">{answeredCount} / {totalQuestionsCount} Answered</span>
          </div>
        </div>
      </div>

      {/* Submitted Results Breakdown Banner */}
      {isSubmitted && (
        <div className={`p-5 rounded-xl border shadow-sm text-center space-y-3 animate-fade-in ${
          isPassed ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
        }`}>
          <Award className="w-10 h-10 mx-auto fill-current" />
          <h2 className="text-lg font-black tracking-wide">
            {isPassed ? '🎉 TEST PASSED!' : '⚠️ TEST NOT PASSED — REVIEW ANSWERS'}
          </h2>

          <div className="flex justify-center items-center gap-6 text-xs font-bold pt-1">
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Final Score</p>
              <p className="text-xl font-black">{correctCount} / {totalQuestionsCount}</p>
            </div>
            <div className="border-r border-slate-300 h-7" />
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Percentage</p>
              <p className="text-xl font-black">{scorePercentage}%</p>
            </div>
          </div>

          <p className="text-xs font-medium text-slate-600">
            Scroll down below to inspect correct answers, options breakdown, and explanations for each question.
          </p>

          <button
            onClick={handleRetake}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake 100 MCQs Test</span>
          </button>
        </div>
      )}

      {/* Compact Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-2xs text-xs">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
          <Sparkles className="w-3.5 h-3.5 text-govt-emerald shrink-0" />
          <span>Page {currentPage} of {totalPages}</span>
          <span className="text-slate-400 font-normal text-[11px]">
            (Q{startIndex + 1} - Q{Math.min(startIndex + itemsPerPage, questions.length || 100)})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-6 h-6 rounded-md text-[11px] font-bold transition ${
                  pageNum === currentPage
                    ? 'bg-govt-emerald text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Compact Questions List (25 per page) */}
      {loading ? (
        <Loader />
      ) : questions.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center border border-slate-200 space-y-2">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">No questions loaded.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentQuestions.map((q, idx) => {
            const actualIndex = startIndex + idx + 1;
            const selectedOpt = userAnswers[q._id];
            const isLocked = selectedOpt !== undefined;
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div
                key={q._id}
                className={`bg-white rounded-xl border p-4 shadow-2xs space-y-3 transition ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-red-300 bg-red-50/30'
                    : isLocked
                    ? 'border-blue-300 bg-blue-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      {actualIndex}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {q.textEn}
                    </h3>
                  </div>

                  {/* Status Badges */}
                  {isSubmitted ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shrink-0 ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                    </span>
                  ) : isLocked ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 shrink-0">
                      <Lock className="w-3 h-3 text-blue-600" />
                      <span>Locked</span>
                    </span>
                  ) : null}
                </div>

                {/* Compact 2-Column Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.optionsEn.map((optText, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    const isRightOption = optIdx === q.correctIndex;

                    let optionStyle = 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300';

                    if (isSubmitted) {
                      // Show answers after submission
                      if (isRightOption) {
                        optionStyle = 'border-emerald-500 bg-emerald-100/90 text-emerald-950 font-bold shadow-2xs';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'border-red-500 bg-red-100/90 text-red-950 font-bold';
                      } else {
                        optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                      }
                    } else if (isLocked) {
                      // Selected & Locked (NO correct/incorrect revealed during test)
                      if (isSelected) {
                        optionStyle = 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-2xs ring-1 ring-blue-500';
                      } else {
                        optionStyle = 'border-slate-200 bg-slate-50/70 text-slate-400 opacity-60 cursor-not-allowed';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isLocked || isSubmitted}
                        onClick={() => handleOptionSelect(q._id, optIdx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center gap-2.5 ${optionStyle}`}
                      >
                        <div className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center text-[10px] font-bold ${
                          isSubmitted && isRightOption
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : isSubmitted && isSelected && !isCorrect
                            ? 'border-red-600 bg-red-600 text-white'
                            : isSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
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

      {/* Submit Test Button Banner */}
      {!isSubmitted && (
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div>
            <h4 className="text-xs font-bold text-slate-200">Finished answering questions?</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Click submit below to calculate your final percentage score and view full answer key.</p>
          </div>

          <button
            onClick={handleSubmitTest}
            className="w-full sm:w-auto bg-govt-emerald hover:bg-emerald-700 text-white text-xs font-extrabold px-6 py-2.5 rounded-lg transition shadow flex items-center justify-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Submit & Grade My Test</span>
          </button>
        </div>
      )}

      {/* Compact Bottom Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-xs font-medium">
        <div className="text-slate-700 font-bold text-xs">
          Page <span className="text-govt-emerald">{currentPage}</span> of {totalPages}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous Page</span>
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-7 h-7 rounded-md text-[11px] font-bold transition ${
                  pageNum === currentPage
                    ? 'bg-govt-emerald text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

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
    </div>
  );
}
