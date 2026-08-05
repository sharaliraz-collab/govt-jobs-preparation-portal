'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Loader from '@/components/Loader';
import {
  Zap,
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
  Award
} from 'lucide-react';

interface PhysicsQuestion {
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
  'Measurements',
  'Kinematics',
  'Dynamics',
  'Work, Energy & Power',
  'Circular Motion',
  'Fluid Dynamics',
  'Oscillations',
  'Waves',
  'Thermodynamics',
  'Electrostatics',
  'Current Electricity',
  'Electromagnetism',
  'Electromagnetic Induction',
  'Alternating Current',
  'Physics of Solids',
  'Electronics',
  'Modern Physics',
  'Nuclear Physics',
  'Optics'
];

const QUESTIONS_PER_PAGE = 20;

export default function PhysicsQuizPage() {
  const { i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const [questions, setQuestions] = useState<PhysicsQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{ [qId: string]: boolean }>({});
  const [showSindhi, setShowSindhi] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/questions?subject=Physics&limit=1000');
      if (res.data && Array.isArray(res.data)) {
        setQuestions(res.data);
      }
    } catch (err) {
      console.error('Error fetching Physics MCQs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter by topic
  const filteredQuestions = selectedTopic === 'All Topics'
    ? questions
    : questions.filter(q => q.topic === selectedTopic || q.explanationEn?.includes(selectedTopic) || q.textEn.toLowerCase().includes(selectedTopic.toLowerCase()));

  const totalQuestions = filteredQuestions.length;
  const totalPages = Math.max(1, Math.ceil(totalQuestions / QUESTIONS_PER_PAGE));

  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = filteredQuestions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

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

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 space-y-6">

      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-blue-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-cyan-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Grades 9–12 &amp; Entry Tests (MDCAT • ECAT • NTS)
              </span>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                Sindh • Punjab • Federal Boards
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <Zap className="w-8 h-8 text-cyan-400 fill-current animate-pulse" />
              <span>1000 Physics MCQs Solved Bank</span>
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed max-w-3xl">
              Complete topic-wise solved Physics question bank covering Measurements, Kinematics, Dynamics, Thermodynamics, Electrostatics, Optics, Electronics, and Modern Physics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowSindhi(!showSindhi)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 no-print"
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
          <Filter className="w-4 h-4 text-cyan-700 shrink-0" />
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-72 bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-600"
          >
            {TOPICS.map(t => (
              <option key={t} value={t}>📂 {t}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between w-full md:w-auto gap-4 text-xs">
          <span className="font-bold text-slate-700">
            Total Questions: <span className="text-cyan-700 font-extrabold text-sm">{totalQuestions}</span>
          </span>

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
          <BookOpen className="w-4 h-4 text-cyan-700" />
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

          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            let pageNum = i + 1;
            if (totalPages > 7) {
              if (currentPage > 4) pageNum = currentPage - 3 + i;
              if (pageNum > totalPages) pageNum = totalPages - (6 - i);
            }
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-7 h-7 rounded-lg text-[11px] font-bold transition ${
                  pageNum === currentPage ? 'bg-cyan-700 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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
          <p className="text-sm font-bold text-slate-600">No MCQs found for this topic.</p>
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
                    <span className="w-8 h-8 rounded-lg bg-cyan-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {globalIndex + 1}
                    </span>
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                        {q.topic || 'Physics'}
                      </span>

                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed">
                        {q.textEn}
                      </h3>

                      {showSindhi && q.textUr && (
                        <p className="text-base font-sindhi font-lateefi text-right text-cyan-950 pt-1 font-bold" dir="rtl">
                          {q.textUr}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleReveal(q.id)}
                    className="text-[11px] font-bold text-cyan-700 hover:text-cyan-900 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-lg border border-cyan-200 transition shrink-0 flex items-center gap-1 no-print"
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
                        className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center gap-2.5 ${btnStyle}`}
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
                  <div className="p-3 bg-cyan-50/60 rounded-xl border border-cyan-200 text-xs text-cyan-950 space-y-1">
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
          className="px-4 py-2 rounded-xl border border-cyan-700 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-black flex items-center gap-1 transition shadow-xs"
        >
          <span>Next Page</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
