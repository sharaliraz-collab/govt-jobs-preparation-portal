'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  SALU_QUESTIONS,
  SALU_SECTIONS,
  SALUMockQuestion
} from '@/data/saluMockData';
import {
  GraduationCap,
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
  Printer,
  Globe,
  BookMarked,
  Dna,
  Zap,
  Bookmark,
  Flag,
  Share2,
  AlertTriangle,
  Layers,
  BarChart3,
  Check,
  X
} from 'lucide-react';

interface SaluMockTestProps {
  onClose?: () => void;
}

export default function SaluMockTest({ onClose }: SaluMockTestProps) {
  // Exam State
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<{ [qId: number]: boolean }>({});
  const [viewMode, setViewMode] = useState<'single' | 'full'>('single');

  // Timer State (60 Minutes = 3600 seconds)
  const TOTAL_TIME = 3600;
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL_TIME);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Review Filters
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'wrong' | 'unanswered'>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const totalQuestions = SALU_QUESTIONS.length;

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && !isPaused && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            setTimerActive(false);
            setExamSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, isPaused, secondsLeft]);

  // Start Exam
  const handleStartExam = () => {
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentIndex(0);
    setExamSubmitted(false);
    setSecondsLeft(TOTAL_TIME);
    setTimerActive(true);
    setIsPaused(false);
    setExamStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Option Select
  const handleSelectOption = (qId: number, optIndex: number) => {
    if (examSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optIndex
    }));
  };

  // Clear Option
  const handleClearOption = (qId: number) => {
    if (examSubmitted) return;
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  // Toggle Flag
  const handleToggleFlag = (qId: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Jump to specific Question
  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    if (viewMode === 'full') setViewMode('single');
  };

  // Submit test confirmation
  const handleOpenSubmitModal = () => {
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    setTimerActive(false);
    setExamSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retake test
  const handleRetake = () => {
    setExamStarted(false);
    setExamSubmitted(false);
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentIndex(0);
    setSecondsLeft(TOTAL_TIME);
    setTimerActive(false);
    setIsPaused(false);
    setShowSubmitModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Calculate Scores
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  const scoreStats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    SALU_QUESTIONS.forEach((q) => {
      const chosen = userAnswers[q.id];
      if (chosen === undefined) {
        unanswered++;
      } else if (chosen === q.answer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const percentage = Math.round((correct / totalQuestions) * 100);
    const isPassed = percentage >= 50;
    const timeSpentSeconds = TOTAL_TIME - secondsLeft;

    return {
      correct,
      wrong,
      unanswered,
      percentage,
      isPassed,
      timeSpentSeconds
    };
  }, [userAnswers, secondsLeft, totalQuestions, examSubmitted]);

  // Section Breakdown Stats
  const sectionStats = useMemo(() => {
    return SALU_SECTIONS.map((sec) => {
      const secQuestions = SALU_QUESTIONS.filter((q) => q.category === sec.category);
      let correct = 0;
      let wrong = 0;
      let unans = 0;

      secQuestions.forEach((q) => {
        const chosen = userAnswers[q.id];
        if (chosen === undefined) unans++;
        else if (chosen === q.answer) correct++;
        else wrong++;
      });

      const pct = secQuestions.length > 0 ? Math.round((correct / secQuestions.length) * 100) : 0;

      return {
        ...sec,
        total: secQuestions.length,
        correct,
        wrong,
        unanswered: unans,
        percentage: pct
      };
    });
  }, [userAnswers, examSubmitted]);

  // Filtered review questions
  const filteredReviewQuestions = useMemo(() => {
    if (!examSubmitted) return [];
    return SALU_QUESTIONS.filter((q) => {
      const chosen = userAnswers[q.id];
      if (reviewFilter === 'all') return true;
      if (reviewFilter === 'correct') return chosen === q.answer;
      if (reviewFilter === 'wrong') return chosen !== undefined && chosen !== q.answer;
      if (reviewFilter === 'unanswered') return chosen === undefined;
      return true;
    });
  }, [examSubmitted, reviewFilter, userAnswers]);

  // Format Timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = SALU_QUESTIONS[currentIndex];
  const isTimerWarning = secondsLeft <= 300 && secondsLeft > 0; // last 5 minutes

  // Get Icon for Section
  const getSectionIcon = (cat: string) => {
    switch (cat) {
      case 'English':
        return <BookOpen className="w-4 h-4" />;
      case 'General Knowledge':
        return <Globe className="w-4 h-4" />;
      case 'Islamic Studies':
        return <BookMarked className="w-4 h-4" />;
      case 'Science / Biology':
        return <Dna className="w-4 h-4" />;
      case 'Science / Physics':
        return <Zap className="w-4 h-4" />;
      default:
        return <GraduationCap className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans py-4 sm:py-6 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── HEADER BANNER ── */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Shah Abdul Latif University
                </span>
                <span className="bg-white/10 text-sky-200 text-[11px] font-bold px-3 py-1 rounded-full border border-white/15">
                  Khairpur Mirs, Sindh
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold px-3 py-1 rounded-full">
                  Official Entry Test Model
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                <span>📘 SALU Entry Test Practice Paper</span>
              </h1>

              <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
                Full-length 50 MCQs model paper for SALU Khairpur Bachelor & Master entry admissions. Aligned with test format covering English, General Knowledge, Islamic Studies, Biology, and Physics.
              </p>

              <div className="flex items-center gap-4 text-xs font-semibold text-sky-200/90 pt-1 flex-wrap">
                <span className="flex items-center gap-1 text-amber-300">
                  <Award className="w-4 h-4" /> 50 Total Marks (1 Mark each)
                </span>
                <span className="flex items-center gap-1 text-sky-300">
                  <Clock className="w-4 h-4" /> 60 Minutes Duration
                </span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" /> No Negative Marking
                </span>
              </div>
            </div>

            {/* Quick Action / Return Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="self-start md:self-center text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-1.5 shadow"
              >
                ← Back to Tests
              </button>
            )}
          </div>
        </div>

        {/* ── STATE 1: START SCREEN (INTRO & SYLLABUS BREAKDOWN) ── */}
        {!examStarted && !examSubmitted && (
          <div className="space-y-6">
            {/* Subject Distribution Cards */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-sky-700" />
                    <span>Syllabus &amp; Section-Wise Distribution</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Shah Abdul Latif University Entry Test contains 50 MCQs distributed across 5 core domains:
                  </p>
                </div>
                <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                  50 MCQs = 50 Marks
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SALU_SECTIONS.map((sec, idx) => (
                  <div
                    key={sec.name}
                    className="p-4 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white hover:border-sky-300 hover:shadow-md transition space-y-2 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Section 0{idx + 1}</span>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${sec.badgeBg}`}>
                        {sec.weightPercentage}% Weight
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
                          {getSectionIcon(sec.category)}
                        </span>
                        <span>{sec.name}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {sec.category === 'English' && 'Synonyms, Antonyms, Grammar, Plurals, Prepositions, Active/Passive'}
                        {sec.category === 'General Knowledge' && 'Pakistan History, Geography, Capitals, Oceans, Currencies, World Facts'}
                        {sec.category === 'Islamic Studies' && 'Quranic Verses, Pillars of Islam, Prophets, Angels, Calendar Months'}
                        {sec.category === 'Science / Biology' && 'Cell Organelles, Blood Groups, Human Organs, Vitamins, Anatomy'}
                        {sec.category === 'Science / Physics' && 'SI Units, Light, Work, Electricity, Optics, Physics Laws & Waves'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-900">
                      <span>{sec.questionCount} Questions</span>
                      <span>{sec.questionCount} Marks</span>
                    </div>
                  </div>
                ))}

                {/* Test Summary Box */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/50 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-sky-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Test Rules &amp; Tips</span>
                    </h3>
                    <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                      <li>Total time allowed: <strong>60 Minutes</strong>.</li>
                      <li>Select the single most correct answer.</li>
                      <li>You can change your answer anytime before submitting.</li>
                      <li>Use the 1-50 dot navigator to jump between questions.</li>
                    </ul>
                  </div>

                  <div className="text-[11px] font-bold text-sky-800 bg-white p-2 rounded-xl border border-sky-200 text-center">
                    Passing Criteria: Minimum 50% (25/50 Marks)
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleStartExam}
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 hover:from-sky-800 hover:to-indigo-900 text-white font-extrabold text-base shadow-lg shadow-sky-900/20 hover:shadow-xl transition transform active:scale-95 flex items-center justify-center gap-3 group"
                >
                  <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition transform" />
                  <span>Start 50-MCQ Mock Test Now</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STATE 2: LIVE TEST MODE (EXAM IN PROGRESS) ── */}
        {examStarted && !examSubmitted && (
          <div className="space-y-6">

            {/* Sticky Exam Control Bar */}
            <div className="sticky top-3 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-lg flex flex-wrap items-center justify-between gap-4">
              {/* Question Progress Counter */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question</span>
                <span className="text-base sm:text-lg font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                  {currentIndex + 1} <span className="text-slate-400 font-medium text-xs">/ {totalQuestions}</span>
                </span>
                <span className="hidden sm:inline-block text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  {answeredCount} Answered
                </span>
                {unansweredCount > 0 && (
                  <span className="hidden sm:inline-block text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    {unansweredCount} Left
                  </span>
                )}
              </div>

              {/* Live Countdown Timer */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-base sm:text-lg font-black transition-all ${
                    isTimerWarning
                      ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-500/30'
                      : 'bg-slate-900 text-white shadow'
                  }`}
                >
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>{formatTime(secondsLeft)}</span>
                </div>

                {/* View Mode Toggle */}
                <button
                  onClick={() => setViewMode(viewMode === 'single' ? 'full' : 'single')}
                  className="hidden md:inline-flex items-center gap-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2.5 rounded-xl border border-slate-200 transition"
                  title="Toggle between single question and all questions view"
                >
                  <Layers className="w-3.5 h-3.5 text-sky-700" />
                  <span>{viewMode === 'single' ? 'Full Paper View' : 'Single Card View'}</span>
                </button>

                {/* Finish & Submit Button */}
                <button
                  onClick={handleOpenSubmitModal}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold px-4 sm:px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Test</span>
                </button>
              </div>

              {/* Progress Bar (0 to 100%) */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-600 to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Category Quick Jumper Tabs */}
            <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-2 pr-1 shrink-0">
                Sections:
              </span>
              {SALU_SECTIONS.map((sec) => {
                const firstQIndex = SALU_QUESTIONS.findIndex((q) => q.category === sec.category);
                const isCurrentSec = currentQ.category === sec.category;
                const secQCount = SALU_QUESTIONS.filter((q) => q.category === sec.category).length;
                const secAnsCount = SALU_QUESTIONS.filter(
                  (q) => q.category === sec.category && userAnswers[q.id] !== undefined
                ).length;

                return (
                  <button
                    key={sec.name}
                    onClick={() => {
                      if (firstQIndex !== -1) handleJumpToQuestion(firstQIndex);
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 shrink-0 ${
                      isCurrentSec
                        ? 'bg-sky-900 text-white border-sky-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{getSectionIcon(sec.category)}</span>
                    <span>{sec.category}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isCurrentSec ? 'bg-white/20 text-sky-100' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {secAnsCount}/{secQCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* VIEW MODE A: SINGLE QUESTION INTERACTIVE CARD */}
            {viewMode === 'single' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 transition-all duration-300">
                {/* Question Header & Category Badge */}
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-sky-900 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-sm">
                      Q{currentQ.id}
                    </span>
                    <span className="bg-sky-50 text-sky-800 border border-sky-200 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                      {getSectionIcon(currentQ.category)}
                      {currentQ.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Mark for Review Button */}
                    <button
                      onClick={() => handleToggleFlag(currentQ.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                        flaggedQuestions[currentQ.id]
                          ? 'bg-amber-500 text-white border-amber-600 shadow'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{flaggedQuestions[currentQ.id] ? 'Flagged for Review' : 'Mark for Review'}</span>
                    </button>

                    {/* Clear selection if answered */}
                    {userAnswers[currentQ.id] !== undefined && (
                      <button
                        onClick={() => handleClearOption(currentQ.id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition"
                      >
                        Clear Choice
                      </button>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                    {currentQ.text}
                  </h2>
                </div>

                {/* 4 Interactive Option Buttons */}
                <div className="space-y-3 pt-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQ.id] === optIdx;
                    const letters = ['A', 'B', 'C', 'D'];

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(currentQ.id, optIdx)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group ${
                          isSelected
                            ? 'bg-sky-50 border-sky-600 shadow-md ring-2 ring-sky-600/20'
                            : 'bg-slate-50/70 hover:bg-sky-50/40 border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${
                            isSelected
                              ? 'bg-sky-700 text-white shadow-sm'
                              : 'bg-white text-slate-700 border border-slate-200 group-hover:border-sky-400 group-hover:text-sky-700'
                          }`}
                        >
                          {letters[optIdx]}
                        </span>

                        <span
                          className={`text-sm sm:text-base font-semibold transition-colors flex-1 ${
                            isSelected ? 'text-sky-950 font-bold' : 'text-slate-800'
                          }`}
                        >
                          {opt}
                        </span>

                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-sky-700 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons: Previous / Next */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5 shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="text-xs font-semibold text-slate-500">
                    Question {currentIndex + 1} of {totalQuestions}
                  </div>

                  {currentIndex < totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                      className="px-6 py-2.5 rounded-xl bg-sky-900 hover:bg-sky-950 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleOpenSubmitModal}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      <span>Finish &amp; Submit</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* VIEW MODE B: FULL PAPER VIEW (ALL 50 QUESTIONS) */}
            {viewMode === 'full' && (
              <div className="space-y-4">
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-sky-900">
                    📄 Viewing All 50 Questions in continuous layout
                  </span>
                  <button
                    onClick={() => setViewMode('single')}
                    className="text-xs font-bold bg-white text-sky-800 px-3 py-1.5 rounded-xl border border-sky-300 shadow-sm"
                  >
                    Switch back to Single Card
                  </button>
                </div>

                <div className="space-y-4">
                  {SALU_QUESTIONS.map((q, idx) => {
                    const chosen = userAnswers[q.id];
                    const isFlagged = flaggedQuestions[q.id];
                    const letters = ['A', 'B', 'C', 'D'];

                    return (
                      <div
                        key={q.id}
                        id={`question-full-${q.id}`}
                        className={`bg-white rounded-2xl p-5 border-2 transition shadow-sm space-y-4 ${
                          chosen !== undefined
                            ? 'border-sky-300 bg-sky-50/10'
                            : isFlagged
                            ? 'border-amber-300 bg-amber-50/20'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                              Q{q.id}
                            </span>
                            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                              {q.category}
                            </span>
                          </div>

                          <button
                            onClick={() => handleToggleFlag(q.id)}
                            className={`text-xs font-bold px-2 py-1 rounded-lg border flex items-center gap-1 ${
                              isFlagged
                                ? 'bg-amber-500 text-white border-amber-600'
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                            }`}
                          >
                            <Flag className="w-3 h-3" />
                            <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
                          </button>
                        </div>

                        <p className="text-sm sm:text-base font-bold text-slate-900">{q.text}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = chosen === optIdx;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectOption(q.id, optIdx)}
                                className={`text-left p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition ${
                                  isSelected
                                    ? 'bg-sky-100 border-sky-600 text-sky-950 font-bold shadow-sm'
                                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                                }`}
                              >
                                <span
                                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                                    isSelected ? 'bg-sky-700 text-white' : 'bg-white border border-slate-300'
                                  }`}
                                >
                                  {letters[optIdx]}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 1-50 INTERACTIVE DOT NAVIGATION JUMPER GRID */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-sky-700" />
                  <span>Question Navigator (1 to 50)</span>
                </h3>

                {/* Legend */}
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-sky-700 inline-block" /> Current
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Answered ({answeredCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Flagged ({flaggedCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300 inline-block" /> Left ({unansweredCount})
                  </span>
                </div>
              </div>

              {/* 50 Circles Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {SALU_QUESTIONS.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions[q.id];

                  let btnStyle = 'bg-white text-slate-700 border-slate-200 hover:border-sky-400 hover:bg-sky-50';

                  if (isCurrent) {
                    btnStyle = 'bg-sky-900 text-white border-sky-900 font-black shadow-md ring-2 ring-sky-400';
                  } else if (isFlagged) {
                    btnStyle = 'bg-amber-500 text-white border-amber-600 font-bold';
                  } else if (isAnswered) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`h-10 rounded-xl border text-xs flex items-center justify-center transition-all ${btnStyle}`}
                      title={`Q${q.id}: ${q.category}`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── STATE 3: RESULT & PERFORMANCE DASHBOARD ── */}
        {examSubmitted && (
          <div className="space-y-6 animate-in fade-in duration-500">

            {/* Scorecard Hero Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg text-center relative overflow-hidden space-y-6">
              <div className="space-y-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    scoreStats.isPassed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  {scoreStats.isPassed ? '🎉 Test Passed (Qualified)' : '⚠️ Needs Improvement'}
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  SALU Entry Test Result Summary
                </h2>
                <p className="text-xs text-slate-500">
                  Shah Abdul Latif University Khairpur Practice Entry Exam Assessment
                </p>
              </div>

              {/* Big Score Display */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-6xl sm:text-7xl font-black text-sky-950 tracking-tight">
                  {scoreStats.correct}
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-slate-400 self-end mb-2">
                  / {totalQuestions}
                </span>
              </div>

              <div className="text-sm font-extrabold text-slate-700">
                Score Percentage:{' '}
                <span
                  className={`text-lg font-black ${
                    scoreStats.isPassed ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {scoreStats.percentage}%
                </span>
              </div>

              {/* 4 Key Metrics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="text-2xl font-black text-emerald-700">{scoreStats.correct}</div>
                  <div className="text-xs font-bold text-emerald-900 mt-0.5 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                  <div className="text-2xl font-black text-rose-700">{scoreStats.wrong}</div>
                  <div className="text-xs font-bold text-rose-900 mt-0.5 flex items-center justify-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Wrong
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                  <div className="text-2xl font-black text-amber-700">{scoreStats.unanswered}</div>
                  <div className="text-xs font-bold text-amber-900 mt-0.5 flex items-center justify-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" /> Skipped
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center">
                  <div className="text-2xl font-black text-slate-800">{formatTime(scoreStats.timeSpentSeconds)}</div>
                  <div className="text-xs font-bold text-slate-700 mt-0.5 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Time Taken
                  </div>
                </div>
              </div>

              {/* Actions: Retake / Print / Share */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3 no-print">
                <button
                  onClick={handleRetake}
                  className="px-6 py-3 rounded-2xl bg-sky-900 hover:bg-sky-950 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center gap-2 active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Test</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center gap-2 active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Solved Paper / PDF</span>
                </button>
              </div>
            </div>

            {/* SECTION-WISE PERFORMANCE BREAKDOWN */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-sky-700" />
                  <span>Category-Wise Performance Analysis</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed section breakdown across the 5 subjects tested:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sectionStats.map((sec) => (
                  <div
                    key={sec.name}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        {getSectionIcon(sec.category)}
                        {sec.category}
                      </span>
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-md ${
                          sec.percentage >= 60
                            ? 'bg-emerald-100 text-emerald-800'
                            : sec.percentage >= 40
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sec.percentage}%
                      </span>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          sec.percentage >= 60
                            ? 'bg-emerald-500'
                            : sec.percentage >= 40
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${sec.percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 font-semibold pt-1 border-t border-slate-200/60">
                      <span>
                        Score: <strong className="text-slate-900">{sec.correct}</strong> / {sec.total}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {sec.wrong} Wrong · {sec.unanswered} Skipped
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SOLVED ANSWER KEY & DETAILED EXPLANATIONS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Solved Paper &amp; Detailed Answer Key</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review each question with your answer, the official correct choice, and reasoning.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl flex-wrap no-print">
                  {(['all', 'correct', 'wrong', 'unanswered'] as const).map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setReviewFilter(filterType)}
                      className={`text-xs font-extrabold px-3 py-1.5 rounded-lg capitalize transition ${
                        reviewFilter === filterType
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {filterType === 'all' && `All (${totalQuestions})`}
                      {filterType === 'correct' && `✔ Correct (${scoreStats.correct})`}
                      {filterType === 'wrong' && `✘ Wrong (${scoreStats.wrong})`}
                      {filterType === 'unanswered' && `— Skipped (${scoreStats.unanswered})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Review List */}
              <div className="space-y-4">
                {filteredReviewQuestions.map((q) => {
                  const chosen = userAnswers[q.id];
                  const isCorrect = chosen === q.answer;
                  const isUnanswered = chosen === undefined;
                  const letters = ['A', 'B', 'C', 'D'];

                  return (
                    <div
                      key={q.id}
                      className={`rounded-2xl p-5 border-2 space-y-4 transition ${
                        isCorrect
                          ? 'bg-emerald-50/20 border-emerald-200'
                          : isUnanswered
                          ? 'bg-amber-50/20 border-amber-200'
                          : 'bg-rose-50/20 border-rose-200'
                      }`}
                    >
                      {/* Item Top Bar */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center ${
                              isCorrect ? 'bg-emerald-600' : isUnanswered ? 'bg-amber-600' : 'bg-rose-600'
                            }`}
                          >
                            Q{q.id}
                          </span>
                          <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md">
                            {q.category}
                          </span>
                        </div>

                        <span
                          className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : isUnanswered
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {isCorrect ? '✔ Correct Answer' : isUnanswered ? '— Unanswered / Skipped' : '✘ Incorrect Choice'}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                        {q.text}
                      </h4>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt, optIdx) => {
                          const isThisCorrect = optIdx === q.answer;
                          const isThisChosen = chosen === optIdx;

                          let cardStyle = 'bg-white border-slate-200 text-slate-700';

                          if (isThisCorrect) {
                            cardStyle = 'bg-emerald-100/70 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500';
                          } else if (isThisChosen && !isCorrect) {
                            cardStyle = 'bg-rose-100/70 border-rose-500 text-rose-950 font-bold ring-1 ring-rose-500';
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 ${cardStyle}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                                    isThisCorrect
                                      ? 'bg-emerald-600 text-white'
                                      : isThisChosen
                                      ? 'bg-rose-600 text-white'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {letters[optIdx]}
                                </span>
                                <span>{opt}</span>
                              </div>

                              {isThisCorrect && (
                                <span className="text-[11px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md shrink-0">
                                  Correct Key
                                </span>
                              )}
                              {isThisChosen && !isCorrect && (
                                <span className="text-[11px] font-black text-rose-700 bg-white px-2 py-0.5 rounded-md shrink-0">
                                  Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      {q.explanation && (
                        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-1">
                          <strong className="text-slate-900 font-extrabold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Explanation / Context:
                          </strong>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── SUBMIT CONFIRMATION MODAL ── */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Ready to Submit Your Test?
                </h3>
                <p className="text-xs text-slate-500">
                  Please review your test completion status before finalizing:
                </p>
              </div>

              {/* Progress Summary in Modal */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs font-semibold">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Total Questions:</span>
                  <strong className="text-slate-900">{totalQuestions}</strong>
                </div>
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Answered Questions:</span>
                  <strong className="text-emerald-800">{answeredCount}</strong>
                </div>
                {unansweredCount > 0 && (
                  <div className="flex items-center justify-between text-rose-600 font-bold bg-rose-50 p-2 rounded-xl border border-rose-200">
                    <span>⚠️ Unanswered Questions:</span>
                    <span>{unansweredCount} Left</span>
                  </div>
                )}
                {flaggedCount > 0 && (
                  <div className="flex items-center justify-between text-amber-700">
                    <span>Flagged for Review:</span>
                    <strong>{flaggedCount}</strong>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200">
                  <span>Time Remaining:</span>
                  <strong className="font-mono text-slate-900">{formatTime(secondsLeft)}</strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition"
                >
                  Continue Test
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Yes, Submit Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
