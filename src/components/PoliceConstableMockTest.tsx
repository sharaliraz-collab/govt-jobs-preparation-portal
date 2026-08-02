'use client';

import React, { useState, useEffect } from 'react';
import {
  POLICE_CONSTABLE_QUESTIONS,
  POLICE_CONSTABLE_SECTIONS,
  MockQuestion
} from '@/data/policeConstableMockData';
import {
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileText
} from 'lucide-react';

const QUESTIONS_PER_PAGE = 20;
const TOTAL_QUESTIONS = POLICE_CONSTABLE_QUESTIONS.length;
const TOTAL_PAGES = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE);

export default function PoliceConstableMockTest({ onClose }: { onClose?: () => void }) {
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<{ [qIndex: number]: number }>({});

  // Timer
  const [selectedTimer, setSelectedTimer] = useState<number>(4800); // 80 mins
  const [secondsLeft, setSecondsLeft] = useState<number>(4800);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, secondsLeft]);

  const handleStartExam = () => {
    setUserAnswers({});
    setCurrentPage(1);
    setExamSubmitted(false);
    setExamStarted(true);

    if (selectedTimer > 0) {
      setSecondsLeft(selectedTimer);
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOptionSelect = (globalIndex: number, optIdx: number) => {
    if (examSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [globalIndex]: optIdx }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= TOTAL_PAGES) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitTest = () => {
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < TOTAL_QUESTIONS && secondsLeft > 0) {
      if (!confirm(`You have answered ${answeredCount} of ${TOTAL_QUESTIONS} questions. Are you sure you want to submit?`)) {
        return;
      }
    }
    setTimerActive(false);
    setExamSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setExamStarted(false);
    setExamSubmitted(false);
    setUserAnswers({});
    setCurrentPage(1);
    setTimerActive(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate Scores
  let correctCount = 0;
  POLICE_CONSTABLE_QUESTIONS.forEach((q, idx) => {
    if (userAnswers[idx] === q.a) correctCount++;
  });
  const scorePercentage = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
  const isPassed = scorePercentage >= 50;

  // Section Scores
  const sectionStats = POLICE_CONSTABLE_SECTIONS.map(sec => {
    const secQuestions = POLICE_CONSTABLE_QUESTIONS.filter(q => q.section === sec.name);
    let secCorrect = 0;
    secQuestions.forEach(q => {
      const gIdx = POLICE_CONSTABLE_QUESTIONS.findIndex(item => item.id === q.id);
      if (userAnswers[gIdx] === q.a) secCorrect++;
    });
    const secPct = secQuestions.length > 0 ? Math.round((secCorrect / secQuestions.length) * 100) : 0;
    return {
      ...sec,
      correct: secCorrect,
      total: secQuestions.length,
      percentage: secPct
    };
  });

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Current page questions
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = POLICE_CONSTABLE_QUESTIONS.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

  return (
    <div className="bg-slate-900/90 min-h-screen text-slate-100 font-sans py-6 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-indigo-950 rounded-2xl p-6 border border-emerald-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-xs shadow-md">
                  STS
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                  Sindh Police Written Test — BPS-07
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Police Constable Mock Written Test
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                SIBA Testing Services (STS) Aligned Matriculation Standard Model Paper · 100 Questions (20 Qs per page)
              </p>
            </div>

            {examStarted && !examSubmitted && selectedTimer > 0 && (
              <div className={`px-4 py-2.5 rounded-xl border text-center font-mono shrink-0 shadow-lg ${
                secondsLeft <= 300 ? 'bg-red-950/90 border-red-500 text-red-300 animate-pulse' : 'bg-slate-950/80 border-amber-400/40 text-amber-300'
              }`}>
                <span className="text-[10px] uppercase font-bold tracking-wider block text-slate-400">Time Left</span>
                <span className="text-xl font-black">{formatTimer(secondsLeft)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 1. START SCREEN */}
        {!examStarted && (
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-lg font-extrabold text-amber-300 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span>Test Pattern &amp; Weightage Criteria</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                As per published SIBA Testing Services (STS) distribution for Police Constable (BPS-07) recruitment:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {POLICE_CONSTABLE_SECTIONS.map((sec) => (
                <div key={sec.name} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 block uppercase tracking-wider">{sec.weight}% Weightage</span>
                  <p className="text-xs font-extrabold text-white">{sec.name}</p>
                  <p className="text-[11px] text-slate-400">{sec.count} Questions</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 block">Select Examination Timer</label>
                  <select
                    value={selectedTimer}
                    onChange={(e) => setSelectedTimer(Number(e.target.value))}
                    className="bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
                  >
                    <option value={4800}>80 Minutes (Official STS Time)</option>
                    <option value={3600}>60 Minutes (Fast Track)</option>
                    <option value={7200}>120 Minutes (Extended)</option>
                    <option value={0}>No Timer (Untimed Practice Mode)</option>
                  </select>
                </div>

                <button
                  onClick={handleStartExam}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-8 py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Police Constable Mock Test →</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic text-center">
              Notice: 20 Questions per page (5 Pages total). You can navigate between pages before submitting.
            </p>
          </div>
        )}

        {/* 2. EXAM QUESTION SCREEN (20 Qs per page) */}
        {examStarted && !examSubmitted && (
          <div className="space-y-6">
            {/* Top Pagination & Progress Bar */}
            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <BookOpen className="w-4 h-4" />
                <span>Page {currentPage} of {TOTAL_PAGES}</span>
                <span className="text-slate-400 font-normal text-[11px]">
                  (Questions {startIndex + 1} – {Math.min(startIndex + QUESTIONS_PER_PAGE, TOTAL_QUESTIONS)})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-bold">
                  Answered: <span className="text-amber-300">{Object.keys(userAnswers).length}</span> / {TOTAL_QUESTIONS}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-950 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev Page</span>
                </button>
                {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-bold transition ${
                      p === currentPage ? 'bg-amber-400 text-slate-950 shadow' : 'bg-slate-900 hover:bg-slate-950 text-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === TOTAL_PAGES}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-950 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition"
                >
                  <span>Next Page</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 20 Questions List on Current Page */}
            <div className="space-y-4">
              {currentQuestions.map((q, idx) => {
                const globalIndex = startIndex + idx;
                const selectedOpt = userAnswers[globalIndex];
                const isAnswered = selectedOpt !== undefined;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border transition shadow-sm space-y-3 ${
                      isAnswered ? 'bg-slate-800/90 border-amber-400/40' : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          {globalIndex + 1}
                        </span>
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                            {q.section}
                          </span>
                          <h3
                            className={`text-sm sm:text-base font-bold text-white leading-relaxed ${q.dir === 'rtl' ? 'font-sindhi text-right leading-loose pt-1 text-emerald-200' : ''}`}
                            dir={q.dir || 'ltr'}
                          >
                            {q.q}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.opts.map((optText, optIdx) => {
                        const isSelected = selectedOpt === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleOptionSelect(globalIndex, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center gap-2.5 ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md'
                                : 'bg-slate-900/80 hover:bg-slate-900 text-slate-200 border-slate-700'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center text-[10px] font-extrabold ${
                              isSelected ? 'bg-slate-950 text-amber-300 border-slate-900' : 'border-slate-600 text-slate-400'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className={`flex-1 ${q.dir === 'rtl' ? 'font-sindhi text-right font-bold text-sm' : ''}`} dir={q.dir || 'ltr'}>
                              {optText}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Navigation & Submit Bar */}
            <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-950 disabled:opacity-30 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Page</span>
                </button>
                {currentPage < TOTAL_PAGES ? (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2.5 rounded-xl border border-amber-400/40 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition shadow"
                  >
                    <span>Next Page (Page {currentPage + 1})</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : null}
              </div>

              <button
                onClick={handleSubmitTest}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-8 py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit &amp; Grade Mock Paper</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. RESULTS SCREEN */}
        {examSubmitted && (
          <div className="space-y-6">
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-xl text-center space-y-6">
              <div className="w-32 h-32 mx-auto rounded-full bg-slate-900 border-4 border-amber-400 flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl font-black text-amber-300">{scorePercentage}%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall Score</span>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {correctCount} / {TOTAL_QUESTIONS} Correct Answers
                </h2>
                <p className="text-xs text-slate-300">
                  Police Constable (BPS-07) Mock Written Test Result
                </p>
                <div className="pt-2">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    isPassed ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' : 'bg-red-500/20 border border-red-500/40 text-red-300'
                  }`}>
                    {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    <span>{isPassed ? 'PASSED (≥ 50% Required)' : 'BELOW PASSING (50% Required)'}</span>
                  </span>
                </div>
              </div>

              {/* Section-Wise Breakdown Bars */}
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700 text-left space-y-4">
                <h3 className="text-xs font-extrabold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Section-Wise Performance Breakdown
                </h3>

                <div className="space-y-3">
                  {sectionStats.map(sec => (
                    <div key={sec.name} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200">
                          {sec.name} <span className="text-[10px] text-slate-400 font-normal">({sec.weight}% weight)</span>
                        </span>
                        <span className="font-black text-amber-300">{sec.correct} / {sec.total} ({sec.percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full transition-all duration-500 ${
                            sec.percentage >= 50 ? 'bg-emerald-400' : 'bg-amber-500'
                          }`}
                          style={{ width: `${sec.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRetake}
                  className="bg-slate-900 hover:bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Test</span>
                </button>
              </div>
            </div>

            {/* Answer Review Section */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-xl space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-700 pb-3">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Complete 100-Question Answer Key &amp; Review</span>
              </h3>

              <div className="space-y-3">
                {POLICE_CONSTABLE_QUESTIONS.map((q, idx) => {
                  const userAns = userAnswers[idx];
                  const isCorrect = userAns === q.a;
                  const isSkipped = userAns === undefined;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border text-xs space-y-2 ${
                        isCorrect
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                          : isSkipped
                          ? 'bg-amber-950/20 border-amber-500/30 text-amber-100'
                          : 'bg-red-950/30 border-red-500/40 text-red-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          <span className="font-extrabold text-amber-300 shrink-0">{idx + 1}.</span>
                          <p className={`font-bold leading-relaxed ${q.dir === 'rtl' ? 'font-sindhi text-right leading-loose text-emerald-200 flex-1' : 'flex-1'}`} dir={q.dir || 'ltr'}>
                            {q.q}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">[{q.section}]</span>
                      </div>

                      <div className="pl-5 space-y-1">
                        {isSkipped ? (
                          <p className="text-amber-300 italic">
                            Skipped — Correct Answer: <span className="font-bold">{String.fromCharCode(65 + q.a)}. {q.opts[q.a]}</span>
                          </p>
                        ) : isCorrect ? (
                          <p className="text-emerald-300 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Your Answer: {String.fromCharCode(65 + userAns)}. {q.opts[userAns]} (Correct)</span>
                          </p>
                        ) : (
                          <>
                            <p className="text-red-300 flex items-center gap-1 font-semibold">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Your Answer: {String.fromCharCode(65 + userAns)}. {q.opts[userAns]}</span>
                            </p>
                            <p className="text-emerald-300 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Correct Answer: {String.fromCharCode(65 + q.a)}. {q.opts[q.a]}</span>
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
