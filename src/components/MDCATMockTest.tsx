'use client';

import React, { useState, useEffect } from 'react';
import { MDCAT_QUESTIONS, MDCATQuestion } from '@/data/mdcatMockData';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileCheck,
  Stethoscope,
  X
} from 'lucide-react';

interface MDCATMockTestProps {
  onClose?: () => void;
}

const QUESTIONS_PER_PAGE = 25;
const TOTAL_PAGES = Math.ceil(MDCAT_QUESTIONS.length / QUESTIONS_PER_PAGE); // 8 pages

export default function MDCATMockTest({ onClose }: MDCATMockTestProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // 3-hour Timer (10800 seconds)
  const [timeLeft, setTimeLeft] = useState(10800);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (!timerActive || submitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, submitted]);

  const handleAutoSubmit = () => {
    setSubmitted(true);
    setShowResultsModal(true);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (qId: number, optIdx: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= TOTAL_PAGES) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimerActive(false);
    setShowResultsModal(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
    setShowResultsModal(false);
    setTimeLeft(10800);
    setTimerActive(true);
    setCurrentPage(1);
  };

  // Calculations
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round((answeredCount / MDCAT_QUESTIONS.length) * 100);

  let totalScore = 0;
  let bioCorrect = 0;
  let chemCorrect = 0;
  let phyCorrect = 0;
  let engCorrect = 0;

  MDCAT_QUESTIONS.forEach((q) => {
    if (userAnswers[q.id] === q.ans) {
      totalScore++;
      if (q.subject === 'bio') bioCorrect++;
      if (q.subject === 'chem') chemCorrect++;
      if (q.subject === 'phy') phyCorrect++;
      if (q.subject === 'eng') engCorrect++;
    }
  });

  const percentage = Math.round((totalScore / MDCAT_QUESTIONS.length) * 100);

  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = MDCAT_QUESTIONS.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6 space-y-6">

      {/* STICKY LIQUID HEADER */}
      <div className="sticky top-16 z-40 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 font-extrabold text-xl shadow-glow-gold">
            🩺
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                MDCAT Mock Test — SIBA Testing Service
              </h1>
              <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                200 MCQs
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Biology (80) • Chemistry (60) • Physics (40) • English (20)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer Display */}
          <div className={`px-4 py-2 rounded-2xl font-mono text-sm sm:text-base font-extrabold tracking-wider border shadow-md flex items-center gap-2 ${
            timeLeft < 900
              ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 animate-pulse'
              : 'bg-white/10 border-white/20 text-teal-300'
          }`}>
            <Clock className="w-4 h-4 text-teal-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
              title="Close test"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* PROGRESS & NAVIGATION STATUS BAR */}
      <div className="liquid-glass-card p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-teal-600" />
            <span>Progress: <strong className="text-slate-900">{answeredCount}</strong> / 200 Answered ({progressPercent}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200 text-[11px]">
              Page {currentPage} of {TOTAL_PAGES}
            </span>
          </div>
        </div>

        {/* Outer Progress Bar */}
        <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 8 PAGE DOTS NAVIGATION */}
        <div className="flex flex-wrap justify-center gap-1.5 pt-1">
          {Array.from({ length: TOTAL_PAGES }, (_, i) => {
            const pageNum = i + 1;
            const pStart = i * QUESTIONS_PER_PAGE + 1;
            const pEnd = Math.min((i + 1) * QUESTIONS_PER_PAGE, MDCAT_QUESTIONS.length);

            // Check how many answered on this page
            const pageQs = MDCAT_QUESTIONS.slice(pStart - 1, pEnd);
            const pageAnsweredCount = pageQs.filter(q => userAnswers[q.id] !== undefined).length;
            const isFullyAnswered = pageAnsweredCount === pageQs.length;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                  pageNum === currentPage
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : isFullyAnswered
                    ? 'bg-teal-50 text-teal-800 border-teal-300'
                    : pageAnsweredCount > 0
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-white/80 hover:bg-white text-slate-600 border-slate-200'
                }`}
              >
                <span>P{pageNum}</span>
                <span className="text-[10px] opacity-75">({pStart}-{pEnd})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* QUESTIONS LIST (25 PER PAGE) */}
      <div className="space-y-4">
        {currentQuestions.map((q) => {
          const userSelected = userAnswers[q.id];
          const isAnswered = userSelected !== undefined;
          const isCorrect = userSelected === q.ans;

          // Subject badge styling
          const subjectBadges: Record<string, { bg: string; text: string; border: string }> = {
            bio: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
            chem: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
            phy: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
            eng: { bg: 'bg-pink-50', text: 'text-pink-800', border: 'border-pink-200' },
          };
          const badgeStyle = subjectBadges[q.subject] || subjectBadges.bio;

          return (
            <div
              key={q.id}
              className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 space-y-3 bg-white/80 backdrop-blur-md shadow-sm page-break-inside-avoid ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : isAnswered
                    ? 'border-red-400 bg-red-50/30'
                    : 'border-slate-200'
                  : isAnswered
                  ? 'border-teal-400/80 bg-teal-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {q.id}
                  </span>
                  <div className="space-y-1 flex-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                      {q.subjectName}
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed pt-0.5">
                      {q.q}
                    </h3>
                  </div>
                </div>
              </div>

              {/* OPTIONS LIST */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.opts.map((optText, optIdx) => {
                  const isOptionSelected = userSelected === optIdx;
                  const isCorrectAnswer = optIdx === q.ans;

                  let btnStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200';

                  if (submitted) {
                    if (isCorrectAnswer) {
                      btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs';
                    } else if (isOptionSelected) {
                      btnStyle = 'bg-red-600 text-white border-red-600 font-bold';
                    }
                  } else if (isOptionSelected) {
                    btnStyle = 'bg-teal-700 text-white border-teal-700 font-bold shadow-xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleOptionSelect(q.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all duration-200 flex items-center gap-2.5 ${btnStyle}`}
                    >
                      <span className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center text-[10px] font-extrabold ${
                        isOptionSelected || (submitted && isCorrectAnswer)
                          ? 'bg-white text-slate-900 border-white'
                          : 'border-slate-300 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>

                      <span className="flex-1 font-medium">{optText}</span>

                      {submitted && isCorrectAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-auto" />
                      )}
                      {submitted && isOptionSelected && !isCorrectAnswer && (
                        <XCircle className="w-4 h-4 text-white shrink-0 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGE BOTTOM CONTROLS */}
      <div className="liquid-glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 flex items-center justify-center gap-1.5 transition shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Page</span>
        </button>

        <span className="text-slate-700 font-extrabold text-sm">
          Page {currentPage} of {TOTAL_PAGES}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === TOTAL_PAGES}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-900 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-30 flex items-center justify-center gap-1.5 transition shadow-xs"
        >
          <span>Next Page</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ACTION TOOLBAR */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>✓ Submit &amp; Calculate Score (200 MCQs)</span>
          </button>
        ) : (
          <button
            onClick={() => setShowResultsModal(true)}
            className="w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>View Detailed Results Modal</span>
          </button>
        )}

        <button
          onClick={handleReset}
          className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-6 py-3 rounded-2xl transition flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Test</span>
        </button>
      </div>

      {/* RESULTS MODAL */}
      {showResultsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 text-center animate-scale-in relative">
            <button
              onClick={() => setShowResultsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-teal-200 mb-2">
                🏆 Official Exam Result
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                MDCAT Mock Test Performance
              </h2>
            </div>

            {/* Score Box */}
            <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-6 rounded-2xl shadow-inner space-y-1">
              <div className="text-5xl font-black text-teal-300 tracking-tight">
                {totalScore} <span className="text-lg font-bold text-slate-300">/ 200</span>
              </div>
              <div className="text-sm font-bold text-amber-300">
                Overall Score: {percentage}%
              </div>
            </div>

            {/* Subject Breakdown Grid */}
            <div className="grid grid-cols-2 gap-2 text-left text-xs font-semibold">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between items-center">
                <span className="text-emerald-950 font-bold">🧬 Biology (80):</span>
                <strong className="text-emerald-700 font-extrabold text-sm">{bioCorrect} / 80</strong>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex justify-between items-center">
                <span className="text-blue-950 font-bold">🧪 Chemistry (60):</span>
                <strong className="text-blue-700 font-extrabold text-sm">{chemCorrect} / 60</strong>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center">
                <span className="text-amber-950 font-bold">⚡ Physics (40):</span>
                <strong className="text-amber-700 font-extrabold text-sm">{phyCorrect} / 40</strong>
              </div>
              <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 flex justify-between items-center">
                <span className="text-pink-950 font-bold">📖 English (20):</span>
                <strong className="text-pink-700 font-extrabold text-sm">{engCorrect} / 20</strong>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => setShowResultsModal(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition"
              >
                Review All Questions &amp; Answer Key →
              </button>
              <button
                onClick={handleReset}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition"
              >
                Retake Exam
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
