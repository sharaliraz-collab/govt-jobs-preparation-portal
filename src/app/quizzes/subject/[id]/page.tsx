'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Loader from '@/components/Loader';
import {
  ArrowLeft, BookOpen, HelpCircle, CheckCircle2, XCircle,
  ChevronLeft, ChevronRight, Award, Lock, Send, RotateCcw,
  Sparkles, AlertCircle, Clock, Atom, Landmark, BookMarked,
  Zap, FlaskConical, Dna, Monitor, Calculator
} from 'lucide-react';
import { IQuestion } from '@/lib/types';

const SUBJECT_META: Record<string, { name: string; icon: any; subject: string; gradient: string }> = {
  'general-science': {
    name: 'General Science & Ability',
    icon: Atom,
    subject: 'General Science',
    gradient: 'from-emerald-600 to-teal-700',
  },
  'pak-studies': {
    name: 'Pakistan Studies',
    icon: Landmark,
    subject: 'Pakistan Studies',
    gradient: 'from-green-700 to-emerald-800',
  },
  'islamic-studies': {
    name: 'Islamic Studies',
    icon: BookMarked,
    subject: 'Islamic Studies',
    gradient: 'from-amber-600 to-yellow-700',
  },
  'physics': {
    name: 'Physics',
    icon: Zap,
    subject: 'Physics',
    gradient: 'from-cyan-600 to-blue-700',
  },
  'chemistry': {
    name: 'Chemistry',
    icon: FlaskConical,
    subject: 'Chemistry',
    gradient: 'from-rose-600 to-red-700',
  },
  'biology': {
    name: 'Biology',
    icon: Dna,
    subject: 'Biology',
    gradient: 'from-teal-600 to-emerald-700',
  },
  'computer-science': {
    name: 'Computer Science',
    icon: Monitor,
    subject: 'Computer Science',
    gradient: 'from-purple-600 to-violet-700',
  },
  'mathematics': {
    name: 'Mathematics',
    icon: Calculator,
    subject: 'Mathematics',
    gradient: 'from-orange-600 to-amber-700',
  },
};

const ITEMS_PER_PAGE = 20;

export default function SubjectPracticePage() {
  const params = useParams();
  const subjectId = typeof params?.id === 'string' ? params.id : '';
  const meta = SUBJECT_META[subjectId];

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<{ [id: string]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (meta) fetchQuestions();
  }, [subjectId]);

  const fetchQuestions = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await axios.get(`/api/questions?subject=${encodeURIComponent(meta!.subject)}`);
      const data: IQuestion[] = Array.isArray(res.data) ? res.data : [];
      data.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setQuestions(data);
    } catch (err) {
      setFetchError('Failed to load questions. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(questions.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const answeredCount = Object.keys(userAnswers).length;
  let correctCount = 0;
  questions.forEach(q => {
    if (userAnswers[q._id] === q.correctIndex) correctCount++;
  });
  const scorePercentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const isPassed = scorePercentage >= 50;

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    if (isSubmitted || userAnswers[questionId] !== undefined) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    if (answeredCount === 0) {
      if (!confirm('You have not answered any questions yet. Submit anyway?')) return;
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

  if (!meta) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h1 className="text-xl font-black text-slate-800">Subject Not Found</h1>
        <p className="text-xs text-slate-500">The subject <code className="bg-slate-100 px-1 rounded">{subjectId}</code> does not exist.</p>
        <Link href="/quizzes" className="inline-flex items-center gap-1.5 text-xs font-bold text-govt-emerald hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Quizzes
        </Link>
      </div>
    );
  }

  const Icon = meta.icon;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-5">
      {/* Header */}
      <div className={`bg-gradient-to-r ${meta.gradient} text-white rounded-xl p-5 sm:p-6 shadow-md relative overflow-hidden`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 bg-white blur-3xl" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-white/70 hover:text-white transition mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to MCQ Subjects</span>
            </Link>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Icon className="w-6 h-6 text-white/90 shrink-0" />
              <span>{meta.name} MCQs</span>
            </h1>
            <p className="text-xs text-white/70">
              {loading ? 'Loading...' : `${questions.length} Questions — ${ITEMS_PER_PAGE} per page — ${totalPages} pages`}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/15 text-center shrink-0">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">Progress</span>
            <span className="text-sm font-extrabold text-white">
              {answeredCount} / {questions.length} Answered
            </span>
          </div>
        </div>
      </div>

      {/* Error */}
      {fetchError && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-center gap-3 text-xs text-red-800">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="font-bold">{fetchError}</p>
          <button onClick={fetchQuestions} className="ml-auto bg-red-100 hover:bg-red-200 border border-red-300 font-bold px-3 py-1.5 rounded-lg transition text-[11px]">
            Retry
          </button>
        </div>
      )}

      {/* Score Banner */}
      {isSubmitted && (
        <div className={`p-5 rounded-xl border shadow-sm text-center space-y-3 ${
          isPassed ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
        }`}>
          <Award className="w-10 h-10 mx-auto" />
          <h2 className="text-lg font-black">{isPassed ? '🎉 TEST PASSED!' : '⚠️ REVIEW ANSWERS'}</h2>
          <div className="flex justify-center items-center gap-8 text-xs font-bold">
            <div>
              <p className="text-[11px] text-slate-500">Correct</p>
              <p className="text-2xl font-black">{correctCount} / {questions.length}</p>
            </div>
            <div className="border-r border-slate-300 h-8" />
            <div>
              <p className="text-[11px] text-slate-500">Score</p>
              <p className="text-2xl font-black">{scorePercentage}%</p>
            </div>
          </div>
          <button onClick={handleRetake} className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition">
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Test
          </button>
        </div>
      )}

      {/* Pagination Top */}
      {!loading && questions.length > 0 && (
        <PaginationBar currentPage={currentPage} totalPages={totalPages} startIndex={startIndex} total={questions.length} perPage={ITEMS_PER_PAGE} onChange={handlePageChange} />
      )}

      {/* Questions */}
      {loading ? (
        <Loader />
      ) : questions.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center border border-slate-200 space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No questions yet for {meta.name}</p>
          <p className="text-xs text-slate-400">Questions for this subject are coming soon. Please check back later.</p>
          <Link href="/quizzes" className="inline-flex items-center gap-1.5 text-xs font-bold text-govt-emerald bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-100 transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            Browse Other Subjects
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {currentQuestions.map((q, idx) => {
            const displayNumber = startIndex + idx + 1;
            const selectedOpt = userAnswers[q._id];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div
                key={q._id}
                className={`bg-white rounded-xl border p-4 shadow-sm space-y-3 transition ${
                  isSubmitted
                    ? isCorrect ? 'border-emerald-300 bg-emerald-50/40'
                      : selectedOpt !== undefined ? 'border-red-300 bg-red-50/30'
                      : 'border-amber-200 bg-amber-50/20'
                    : isAnswered ? 'border-blue-300 bg-blue-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meta.gradient} text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm leading-none`}
                    >
                      {displayNumber}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug pt-1">{q.textEn}</h3>
                  </div>
                  {isSubmitted ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shrink-0 ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : selectedOpt !== undefined ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isCorrect ? <><CheckCircle2 className="w-3 h-3" /><span>Correct</span></> : selectedOpt !== undefined ? <><XCircle className="w-3 h-3" /><span>Wrong</span></> : <span>Skipped</span>}
                    </span>
                  ) : isAnswered ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 shrink-0">
                      <Lock className="w-3 h-3" /><span>Locked</span>
                    </span>
                  ) : null}
                </div>

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
                      style = isSelected ? 'border-blue-600 bg-blue-50 text-blue-950 font-semibold ring-1 ring-blue-500 cursor-default'
                        : 'border-slate-200 bg-slate-50/70 text-slate-400 opacity-60 cursor-not-allowed';
                    }
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isAnswered || isSubmitted}
                        onClick={() => handleOptionSelect(q._id, optIdx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center gap-2.5 ${style}`}
                      >
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

                {isSubmitted && q.explanationEn && (
                  <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900">💡 Explanation: </span>{q.explanationEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Submit Button */}
      {!isSubmitted && !loading && questions.length > 0 && (
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div>
            <h4 className="text-xs font-bold text-slate-200">Ready to check your score?</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{answeredCount} of {questions.length} answered</p>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-govt-emerald hover:bg-govt-emerald-dark text-white text-xs font-extrabold px-6 py-2.5 rounded-lg transition shadow flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Submit & See Score
          </button>
        </div>
      )}

      {/* Pagination Bottom */}
      {!loading && questions.length > 0 && (
        <PaginationBar currentPage={currentPage} totalPages={totalPages} startIndex={startIndex} total={questions.length} perPage={ITEMS_PER_PAGE} onChange={handlePageChange} />
      )}
    </div>
  );
}

function PaginationBar({ currentPage, totalPages, startIndex, total, perPage, onChange }: {
  currentPage: number; totalPages: number; startIndex: number; total: number; perPage: number; onChange: (p: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm text-xs">
      <div className="flex items-center gap-2 text-slate-800 font-bold">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
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
            className={`w-8 h-8 rounded-lg text-[11px] font-bold transition ${p === currentPage ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
            {p}
          </button>
        ))}
        <button onClick={() => onChange(currentPage + 1)} disabled={currentPage === totalPages}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition">
          <span>Next</span><ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
