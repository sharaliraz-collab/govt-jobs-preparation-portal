'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';
import rawMcqs from '@/data/physics-pdf-mcqs.json';
import {
  cleanQuestionStem,
  getTopicFromExplanation,
  getCleanExplanation,
  getWindowedPages,
  getDynamicOptionGridClass,
} from '@/lib/mcqDisplay';

interface PhysicsQuestion {
  id: string;
  subject?: string;
  textEn: string;
  textUr?: string;
  optionsEn: string[];
  optionsUr?: string[];
  correctIndex: number;
  explanationEn?: string;
  topic?: string;
}

const ITEMS_PER_PAGE = 20;

export default function PhysicsPage() {
  const [mcqs, setMcqs] = useState<PhysicsQuestion[]>(rawMcqs as PhysicsQuestion[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    axios
      .get('/api/questions?subject=Physics', { timeout: 8000 })
      .then((res) => {
        if (isMounted && Array.isArray(res.data) && res.data.length > mcqs.length) {
          setMcqs(
            res.data.map((q: any) => ({
              id: q.id || q._id,
              subject: q.subject,
              textEn: q.textEn,
              textUr: q.textUr,
              optionsEn: q.optionsEn,
              optionsUr: q.optionsUr,
              correctIndex: q.correctIndex,
              explanationEn: q.explanationEn,
              topic: q.topic,
            }))
          );
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const topics = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const q of mcqs) {
      const t = getTopicFromExplanation(q.explanationEn, q.topic || 'General Physics');
      counts[t] = (counts[t] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [mcqs]);

  const filteredMcqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return mcqs.filter((q) => {
      if (selectedTopic !== 'ALL') {
        const t = getTopicFromExplanation(q.explanationEn, q.topic || 'General Physics');
        if (t !== selectedTopic) return false;
      }
      if (!query) return true;
      return (
        q.textEn.toLowerCase().includes(query) ||
        q.optionsEn.some((opt) => opt.toLowerCase().includes(query))
      );
    });
  }, [mcqs, searchQuery, selectedTopic]);

  const totalPages = Math.max(1, Math.ceil(filteredMcqs.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTopic]);

  const currentMcqs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMcqs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMcqs, currentPage]);

  const handleOptionSelect = (qId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optionIndex,
    }));
  };

  const toggleExplanation = (qId: string) => {
    setShowExplanation((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).reduce((acc, [qId, ansIdx]) => {
    const found = mcqs.find((m) => m.id === qId);
    return found && found.correctIndex === ansIdx ? acc + 1 : acc;
  }, 0);

  const windowedPages = getWindowedPages(currentPage, totalPages);

  return (
    <div className="text-slate-900 pb-12 font-sans selection:bg-slate-900 selection:text-white">
      {/* Editorial Header */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 sm:p-6 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/quizzes" className="hover:text-slate-900 transition-colors">
              Subjects
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Physics</span>
          </div>

          <Link
            href="/quizzes/random-test?subject=Physics&count=10"
            className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 hover:border-slate-400 text-[11px] font-medium text-slate-800 transition-colors"
          >
            10-Q Quick Test →
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1.5">
              Subject Archive · Mechanics, Optics &amp; Electromagnetism
            </p>
            <h1 className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-slate-950">
              Physics MCQs
            </h1>
            <p className="mt-1.5 text-slate-600 text-xs sm:text-[13px] leading-relaxed">
              Verified multiple-choice questions covering Classical Mechanics, Thermodynamics,
              Waves, Optics, Electricity &amp; Magnetism, and Modern Physics for competitive tests.
            </p>
          </div>

          <div className="grid grid-cols-3 border border-slate-200 divide-x divide-slate-200 bg-slate-50/60 rounded-md shrink-0">
            <div className="px-3.5 py-2">
              <div className="text-sm sm:text-base font-semibold text-slate-950 tabular-nums">
                {mcqs.length.toLocaleString()}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-medium mt-0.5">
                Questions
              </div>
            </div>
            <div className="px-3.5 py-2">
              <div className="text-sm sm:text-base font-semibold text-slate-950 tabular-nums">
                {answeredCount}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-medium mt-0.5">
                Attempted
              </div>
            </div>
            <div className="px-3.5 py-2">
              <div className="text-sm sm:text-base font-semibold text-emerald-700 tabular-nums">
                {correctCount}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-medium mt-0.5">
                Correct
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Topic Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 sm:p-4 mb-5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search physics questions (e.g., Velocity, Ohm, Wavelength, Quantum, Force)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs sm:text-[13px] rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-500 hover:text-slate-900 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-[11px] text-slate-500 shrink-0">
            <span>
              Showing{' '}
              <strong className="text-slate-900 font-semibold">
                {filteredMcqs.length.toLocaleString()}
              </strong>{' '}
              items
            </span>
            <span className="text-slate-300">|</span>
            <span>
              Page <strong className="text-slate-900 font-semibold">{currentPage}</strong> of{' '}
              <strong className="text-slate-900 font-semibold">{totalPages}</strong>
            </span>
          </div>
        </div>

        {topics.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedTopic('ALL')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap border transition-colors ${
                selectedTopic === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              All Topics ({mcqs.length})
            </button>
            {topics.slice(0, 12).map(([topic, count]) => (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap border transition-colors ${
                  selectedTopic === topic
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {topic} ({count})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MCQ List */}
      {currentMcqs.length === 0 ? (
        <div className="bg-white rounded-lg p-10 text-center border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            No matching questions found
          </h3>
          <p className="text-slate-500 text-xs mb-4">
            No questions matched your filter or search query.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedTopic('ALL');
            }}
            className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md hover:bg-slate-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {currentMcqs.map((q, idx) => {
            const globalNumber = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
            const userSelected = selectedAnswers[q.id];
            const isAnswered = userSelected !== undefined;
            const isRevealed = !!showExplanation[q.id];
            const topicLabel = getTopicFromExplanation(
              q.explanationEn,
              q.topic || 'General Physics'
            );
            const cleanExplanation = getCleanExplanation(q.explanationEn);
            const stemText = cleanQuestionStem(q.textEn);
            const optionGridClass = getDynamicOptionGridClass(q.optionsEn);

            return (
              <article
                key={q.id}
                className="bg-white rounded-lg border border-slate-200/90 p-4 sm:p-5 transition-colors hover:border-slate-300"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded tabular-nums">
                        Q.{globalNumber}
                      </span>
                      {topicLabel && (
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded">
                          {topicLabel}
                        </span>
                      )}
                    </div>

                    {isAnswered && (
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                          userSelected === q.correctIndex
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {userSelected === q.correctIndex ? 'Correct' : 'Incorrect'}
                      </span>
                    )}
                  </div>

                  <h2 className="text-[14px] sm:text-[15px] font-medium text-slate-900 leading-relaxed">
                    {stemText}
                  </h2>

                  <div className={`${optionGridClass} pt-0.5`}>
                    {q.optionsEn.map((optText, optIdx) => {
                      const isOptionSelected = userSelected === optIdx;
                      const isCorrectAnswer = optIdx === q.correctIndex;

                      let btnStyle =
                        'border-slate-200/90 bg-slate-50/40 text-slate-800 hover:bg-slate-100/70 hover:border-slate-300';
                      let badgeStyle =
                        'bg-white text-slate-600 border border-slate-200/90';

                      if (isAnswered || isRevealed) {
                        if (isCorrectAnswer) {
                          btnStyle =
                            'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-medium';
                          badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                        } else if (isOptionSelected) {
                          btnStyle =
                            'border-rose-500 bg-rose-50/80 text-rose-950 font-medium';
                          badgeStyle = 'bg-rose-600 text-white border-rose-600';
                        } else {
                          btnStyle =
                            'border-slate-200/60 bg-slate-50/20 text-slate-400 opacity-75';
                          badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleOptionSelect(q.id, optIdx)}
                          className={`text-left px-2.5 py-1.5 rounded-md border text-[12.5px] sm:text-[13px] leading-snug transition-colors flex items-center gap-2 ${btnStyle}`}
                        >
                          <span
                            className={`w-4 h-4 rounded text-[10px] font-semibold flex items-center justify-center shrink-0 tabular-nums ${badgeStyle}`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 min-w-0 break-words">{optText}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleExplanation(q.id)}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
                      >
                        {isRevealed ? 'Hide Answer & Note' : 'View Answer'}
                      </button>

                      {(isAnswered || isRevealed) && (
                        <span className="text-[11px] text-slate-600">
                          Correct Option:{' '}
                          <strong className="text-slate-900 font-semibold">
                            {String.fromCharCode(65 + q.correctIndex)}
                          </strong>
                        </span>
                      )}
                    </div>

                    {isRevealed && (
                      <div className="bg-slate-50 border border-slate-200/80 rounded-md p-2.5 text-xs text-slate-700 leading-relaxed">
                        <p className="font-medium text-slate-900">
                          Correct Answer: ({String.fromCharCode(65 + q.correctIndex)}){' '}
                          {q.optionsEn[q.correctIndex]}
                        </p>
                        {cleanExplanation && (
                          <p className="mt-1 text-slate-600">{cleanExplanation}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:border-slate-400 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Previous
          </button>

          {windowedPages.map((p, idx) =>
            p === 'ellipsis' ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-1.5 py-1.5 text-xs text-slate-400 select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => handlePageChange(p)}
                className={`min-w-[32px] px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors tabular-nums ${
                  currentPage === p
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:border-slate-400 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
