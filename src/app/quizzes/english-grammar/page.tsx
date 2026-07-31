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
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { IQuestion } from '@/lib/types';

export default function EnglishGrammarMCQsPage() {
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: string]: number }>({});
  const [showResults, setShowResults] = useState<{ [questionId: string]: boolean }>({});

  const itemsPerPage = 25;

  useEffect(() => {
    fetchEnglishQuestions();
  }, []);

  const fetchEnglishQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/questions?subject=English Grammar & Composition');
      if (res.data && res.data.length > 0) {
        setQuestions(res.data);
      }
    } catch (err) {
      console.error('Error fetching English questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(questions.length / itemsPerPage) || 4;

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
    setShowResults(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentQuestions = questions.slice(startIndex, startIndex + itemsPerPage);

  // Score calculation for current page and overall
  const answeredCount = Object.keys(userAnswers).length;
  let correctCount = 0;
  questions.forEach(q => {
    if (userAnswers[q._id] === q.correctIndex) {
      correctCount++;
    }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-2xl p-6 md:p-8 shadow-elevated relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-200 hover:text-white transition mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to MCQs Prep</span>
            </Link>

            <h1 className="text-xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-yellow-300 shrink-0" />
              <span>100 English Grammar & Composition MCQs</span>
            </h1>

            <p className="text-xs md:text-sm text-blue-100/90 leading-relaxed max-w-2xl">
              Parts of Speech, Synonyms, Antonyms, Error Detection & Reading Comprehension formatted for FPSC, PPSC, NTS & CSS screening tests.
            </p>
          </div>

          {/* Live Progress Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center shrink-0 min-w-[160px] space-y-1">
            <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">Your Performance</span>
            <span className="text-2xl font-black text-yellow-300">{correctCount} / {questions.length || 100}</span>
            <span className="text-[10px] text-blue-100 block">({answeredCount} Questions Attempted)</span>
          </div>
        </div>
      </div>

      {/* Pagination Status & Controls (Top) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-xs font-medium">
        <div className="flex items-center gap-2 text-slate-700 font-bold">
          <Sparkles className="w-4 h-4 text-govt-emerald" />
          <span>Showing Page {currentPage} of {totalPages}</span>
          <span className="text-slate-400 font-normal">
            (Questions {startIndex + 1} to {Math.min(startIndex + itemsPerPage, questions.length || 100)})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 font-bold flex items-center gap-1 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Page</span>
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                  pageNum === currentPage
                    ? 'bg-govt-emerald text-white shadow-xs'
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
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 font-bold flex items-center gap-1 transition"
          >
            <span>Next Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Questions List (25 per page) */}
      {loading ? (
        <Loader />
      ) : questions.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center border border-slate-200">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500 font-semibold">No questions found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentQuestions.map((q, idx) => {
            const actualIndex = startIndex + idx + 1;
            const selectedOpt = userAnswers[q._id];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div
                key={q._id}
                className={`bg-white rounded-2xl border p-5 md:p-6 shadow-xs space-y-4 transition ${
                  isAnswered
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-red-300 bg-red-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {actualIndex}
                    </span>
                    <h3 className="text-sm md:text-base font-bold text-slate-900 leading-relaxed">
                      {q.textEn}
                    </h3>
                  </div>

                  {isAnswered && (
                    <div className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 shrink-0 ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                    </div>
                  )}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.optionsEn.map((optText, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    const isRightOption = optIdx === q.correctIndex;

                    let btnStyle = 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50';

                    if (isAnswered) {
                      if (isRightOption) {
                        btnStyle = 'border-emerald-500 bg-emerald-100/80 text-emerald-900 font-bold shadow-xs';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'border-red-500 bg-red-100/80 text-red-900 font-bold';
                      } else {
                        btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleOptionSelect(q._id, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition flex items-center gap-3 ${btnStyle}`}
                      >
                        <div className={`w-6 h-6 rounded-full border shrink-0 flex items-center justify-center text-xs font-bold ${
                          isAnswered && isRightOption
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : isAnswered && isSelected && !isCorrect
                            ? 'border-red-600 bg-red-600 text-white'
                            : 'border-slate-300 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="font-medium">{optText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Status & Controls (Bottom) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-xs font-medium mt-8">
        <div className="text-slate-700 font-bold">
          Page <span className="text-govt-emerald">{currentPage}</span> of {totalPages} — (Questions {startIndex + 1} to {Math.min(startIndex + itemsPerPage, questions.length || 100)})
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 font-bold flex items-center gap-1 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Page</span>
          </button>

          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                  pageNum === currentPage
                    ? 'bg-govt-emerald text-white shadow'
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
            className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 font-bold flex items-center gap-1 transition"
          >
            <span>Next Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
