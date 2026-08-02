'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Loader from '@/components/Loader';
import {
  Landmark, ArrowLeft, HelpCircle, CheckCircle2, XCircle, ChevronLeft, ChevronRight,
  Award, Lock, Send, RotateCcw, Sparkles, AlertCircle, BookMarked, Clock
} from 'lucide-react';
import { IQuestion } from '@/lib/types';

interface SectionDef {
  id: number;
  label: string;
  title: string;
  range: [number, number]; // 0-based indices into all 364 questions array
  available: boolean;
}

const SECTIONS: SectionDef[] = [
  { id: 1,  label: 'Section 1',  title: 'History, Evolution & Human Life',         range: [0, 24],   available: true },
  { id: 2,  label: 'Section 2',  title: 'Civilizations & Indus Valley Origins',    range: [25, 49],  available: true },
  { id: 3,  label: 'Section 3',  title: 'Indus Valley Art, Trade & Decline',      range: [50, 74],  available: true },
  { id: 4,  label: 'Section 4',  title: 'Government, Constitution & State Organs', range: [75, 99],  available: true },
  { id: 5,  label: 'Section 5',  title: 'Local Govt, Elections & Media Systems',   range: [100, 124], available: true },
  { id: 6,  label: 'Section 6',  title: 'Media Bias, Stereotypes & Propaganda',    range: [125, 149], available: true },
  { id: 7,  label: 'Section 7',  title: 'Geography & Features of South Asia',      range: [150, 174], available: true },
  { id: 8,  label: 'Section 8',  title: 'Demographics & Cultures of South Asia',   range: [175, 199], available: true },
  { id: 9,  label: 'Section 9',  title: 'Economics, Scarcity & Production Factors',range: [200, 224], available: true },
  { id: 10, label: 'Section 10', title: 'Trade-offs, Public Goods & Market Demand', range: [225, 249], available: true },
  { id: 11, label: 'Section 11', title: 'Ancient & Medieval Empires',             range: [250, 274], available: true },
  { id: 12, label: 'Section 12', title: 'Leadership & Asian Geography',             range: [275, 299], available: true },
  { id: 13, label: 'Section 13', title: 'Water Resources & Irrigation in Pakistan', range: [300, 324], available: true },
  { id: 14, label: 'Section 14', title: 'Islamic History & Ottoman Era',           range: [325, 347], available: true },
  { id: 15, label: 'Section 15', title: 'Modern Pakistan Governance & Global',     range: [348, 363], available: true },
];

const ITEMS_PER_PAGE = 20;
const SUBJECT = 'Pakistan Studies';

export default function PakStudiesMCQsPage() {
  const [activeSection, setActiveSection] = useState<SectionDef>(SECTIONS[0]);
  const [allQuestions, setAllQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const fetchAllQuestions = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await axios.get(`/api/questions?subject=${encodeURIComponent(SUBJECT)}`);
      const data: IQuestion[] = Array.isArray(res.data) ? res.data : [];
      // Sort by createdAt ascending so index matches exact order seeded
      data.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setAllQuestions(data);
    } catch (err) {
      console.error('Error fetching Pakistan Studies questions:', err);
      setFetchError('Failed to load questions. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (sec: SectionDef) => {
    if (!sec.available || sec.id === activeSection.id) return;
    setActiveSection(sec);
    setUserAnswers({});
    setIsSubmitted(false);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sectionQuestions: IQuestion[] = activeSection.available
    ? allQuestions.slice(activeSection.range[0], activeSection.range[1] + 1)
    : [];

  const totalPages = Math.max(1, Math.ceil(sectionQuestions.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentQuestions = sectionQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const answeredCount = Object.keys(userAnswers).length;
  const sectionTotal = sectionQuestions.length;

  let correctCount = 0;
  sectionQuestions.forEach(q => {
    if (userAnswers[q._id] === q.correctIndex) correctCount++;
  });
  const scorePercentage = sectionTotal > 0 ? Math.round((correctCount / sectionTotal) * 100) : 0;
  const isPassed = scorePercentage >= 50;

  const handleOptionSelect = (qId: string, optIdx: number) => {
    if (isSubmitted || userAnswers[qId] !== undefined) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitTest = () => {
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

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-950 text-white rounded-xl p-5 sm:p-6 shadow-md border border-emerald-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-15 bg-emerald-400 blur-3xl" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-200 hover:text-white transition mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to MCQ Subjects</span>
            </Link>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Landmark className="w-6 h-6 text-yellow-400 shrink-0" />
              <span>Pakistan Studies MCQs (پاکستان اسٹڈیز)</span>
            </h1>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              {activeSection.label}: <span className="text-yellow-300 font-semibold">{activeSection.title}</span>
              &nbsp;·&nbsp; {sectionTotal} Questions &nbsp;·&nbsp; {ITEMS_PER_PAGE} per page
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/15 text-center shrink-0 min-w-[150px]">
            <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">Attempt Status</span>
            <span className="text-sm font-extrabold text-yellow-300">
              {answeredCount} / {sectionTotal} Answered
            </span>
          </div>
        </div>
      </div>

      {/* Section Tabs Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 pt-3 pb-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <BookMarked className="w-3 h-3 text-emerald-600" />
            Select Pakistan Studies Section
          </p>
        </div>
        <div className="flex overflow-x-auto gap-1 px-4 pb-0" style={{ scrollbarWidth: 'none' }}>
          {SECTIONS.map((sec) => {
            const isActive = sec.id === activeSection.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleSectionChange(sec)}
                title={`${sec.label}: ${sec.title}`}
                className={`
                  relative shrink-0 px-3.5 py-2.5 text-[11px] font-bold rounded-t-lg border-b-2 transition-all duration-200 whitespace-nowrap
                  ${isActive
                    ? 'border-b-2 border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                  }
                `}
              >
                <span className="flex items-center gap-1.5">
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />}
                  {sec.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
        <div className="h-px bg-slate-100 mt-0" />
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 text-[11px]">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            {activeSection.label}: <span className="text-emerald-800 font-bold ml-1">{activeSection.title}</span>
            &nbsp;|&nbsp; {sectionTotal} Questions &nbsp;|&nbsp; {totalPages} {totalPages === 1 ? 'page' : 'pages'}
          </span>
          <span className="text-slate-400 font-medium hidden sm:flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Total 364 MCQs (15 Sections)
          </span>
        </div>
      </div>

      {/* Error */}
      {fetchError && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-center gap-3 text-xs text-red-800">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="font-bold">Error loading questions</p>
            <p className="text-red-600">{fetchError}</p>
          </div>
          <button
            onClick={fetchAllQuestions}
            className="bg-red-100 hover:bg-red-200 border border-red-300 text-red-800 font-bold px-3 py-1.5 rounded-lg text-[11px] transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Score Result Banner */}
      {isSubmitted && (
        <div className={`p-5 rounded-xl border shadow-sm text-center space-y-3 ${
          isPassed ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
        }`}>
          <Award className="w-10 h-10 mx-auto" />
          <h2 className="text-lg font-black">
            {isPassed ? '🎉 SECTION PASSED!' : '⚠️ REVIEW YOUR ANSWERS'}
          </h2>
          <div className="flex justify-center items-center gap-8 text-xs font-bold pt-1">
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Correct</p>
              <p className="text-2xl font-black">{correctCount} / {sectionTotal}</p>
            </div>
            <div className="border-r border-slate-300 h-8" />
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Score</p>
              <p className="text-2xl font-black">{scorePercentage}%</p>
            </div>
            <div className="border-r border-slate-300 h-8" />
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Attempted</p>
              <p className="text-2xl font-black">{answeredCount}</p>
            </div>
          </div>
          <button
            onClick={handleRetake}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake {activeSection.label}</span>
          </button>
        </div>
      )}

      {/* Top Pagination Bar */}
      {!loading && sectionQuestions.length > 0 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          total={sectionQuestions.length}
          perPage={ITEMS_PER_PAGE}
          onChange={handlePageChange}
        />
      )}

      {/* Questions List */}
      {loading ? (
        <Loader />
      ) : allQuestions.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center border border-slate-200 space-y-2">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm text-slate-700 font-bold">No Pakistan Studies questions found.</p>
          <p className="text-xs text-slate-400">
            Please run <code className="bg-slate-100 px-1 rounded">node seed_pak_studies.js</code> to populate these questions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentQuestions.map((q, idx) => {
            const globalIndex = startIndex + idx;
            const displayNumber = globalIndex + 1 + startIndex;
            const selectedOpt = userAnswers[q._id];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div
                key={q._id}
                className={`bg-white rounded-xl border p-4 shadow-sm space-y-3 transition ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : selectedOpt !== undefined
                      ? 'border-red-300 bg-red-50/30'
                      : 'border-amber-200 bg-amber-50/20'
                    : isAnswered
                    ? 'border-blue-300 bg-blue-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm leading-none">
                      {displayNumber}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug pt-1">
                      {q.textEn}
                    </h3>
                  </div>

                  {isSubmitted ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shrink-0 ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : selectedOpt !== undefined ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isCorrect ? <><CheckCircle2 className="w-3 h-3" /><span>Correct</span></> : selectedOpt !== undefined ? <><XCircle className="w-3 h-3" /><span>Wrong</span></> : <span>Skipped</span>}
                    </span>
                  ) : isAnswered ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 shrink-0">
                      <Lock className="w-3 h-3 text-blue-600" />
                      <span>Locked</span>
                    </span>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.optionsEn.map((optText, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    const isRightOption = optIdx === q.correctIndex;

                    let optionStyle = 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer';

                    if (isSubmitted) {
                      if (isRightOption) {
                        optionStyle = 'border-emerald-500 bg-emerald-100/90 text-emerald-950 font-semibold shadow-sm cursor-default';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'border-red-500 bg-red-100/90 text-red-950 font-semibold cursor-default';
                      } else {
                        optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 cursor-default';
                      }
                    } else if (isAnswered) {
                      if (isSelected) {
                        optionStyle = 'border-blue-600 bg-blue-50 text-blue-950 font-semibold shadow-sm ring-1 ring-blue-500 cursor-default';
                      } else {
                        optionStyle = 'border-slate-200 bg-slate-50/70 text-slate-400 opacity-60 cursor-not-allowed';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isAnswered || isSubmitted}
                        onClick={() => handleOptionSelect(q._id, optIdx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center gap-2.5 ${optionStyle}`}
                      >
                        <div className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center text-[10px] font-bold ${
                          isSubmitted && isRightOption
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : isSubmitted && isSelected && !isCorrect
                            ? 'border-red-600 bg-red-600 text-white'
                            : isSelected
                            ? 'border-emerald-700 bg-emerald-700 text-white'
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

      {/* Submit Test Button */}
      {!isSubmitted && !loading && sectionQuestions.length > 0 && (
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div>
            <h4 className="text-xs font-bold text-slate-200">Finished answering {activeSection.label}?</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {answeredCount} of {sectionTotal} answered &nbsp;·&nbsp; Click submit to calculate your score.
            </p>
          </div>
          <button
            onClick={handleSubmitTest}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-6 py-2.5 rounded-lg transition shadow flex items-center justify-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Submit &amp; Grade My Test</span>
          </button>
        </div>
      )}

      {/* Bottom Pagination */}
      {!loading && sectionQuestions.length > 0 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          total={sectionQuestions.length}
          perPage={ITEMS_PER_PAGE}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
}

function PaginationBar({
  currentPage, totalPages, startIndex, total, perPage, onChange
}: {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  total: number;
  perPage: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm text-xs">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Page {currentPage} of {totalPages}</span>
        <span className="text-slate-400 font-normal text-[11px]">
          (Q{startIndex + 1}–Q{Math.min(startIndex + perPage, total)})
        </span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-lg text-[11px] font-bold transition ${
              p === currentPage
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
