'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react';
import RichMath from '@/components/RichMath';
import AdSlot from '@/components/AdSlot';
import ShareButtons, { SectionShareBar } from '@/components/ShareButtons';
import {
  APTITUDE_PER_PAGE,
  AptitudeQuestion,
  AptitudeTopic,
} from '@/data/aptitudeTopics';
import { APTITUDE_THEME } from '@/lib/aptitudeTheme';

interface NavTopic {
  slug: string;
  title: string;
}

interface Props {
  topic: AptitudeTopic;
  questions: AptitudeQuestion[];
  initialPage?: number;
  prevTopic?: NavTopic | null;
  nextTopic?: NavTopic | null;
}

interface Progress {
  answers: Record<number, number>;
  revealed: Record<number, boolean>;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

function pageWindow(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((n) => keep.add(n));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => keep.add(n));
  const sorted = Array.from(keep).filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push('…');
    out.push(n);
  });
  return out;
}

export default function AptitudePractice({
  topic,
  questions,
  initialPage = 1,
  prevTopic,
  nextTopic,
}: Props) {
  const theme = APTITUDE_THEME[topic.group];
  const TopicIcon = theme.icon;

  const total = questions.length;
  const totalPages = Math.max(1, Math.ceil(total / APTITUDE_PER_PAGE));
  const safeInitial = Math.min(Math.max(1, initialPage), totalPages);

  const [page, setPage] = useState(safeInitial);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [openSolutions, setOpenSolutions] = useState<Record<number, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const storageKey = `apt-progress:${topic.slug}`;

  // restore saved progress for this topic
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: Progress = JSON.parse(saved);
        setAnswers(parsed.answers || {});
        setRevealed(parsed.revealed || {});
      }
    } catch {
      /* ignore corrupt storage */
    }
    setLoaded(true);
  }, [storageKey]);

  // persist progress
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ answers, revealed }));
    } catch {
      /* storage may be unavailable */
    }
  }, [answers, revealed, loaded, storageKey]);

  const goToPage = useCallback(
    (p: number) => {
      const next = Math.min(Math.max(1, p), totalPages);
      setPage(next);
      try {
        const url = next === 1 ? window.location.pathname : `${window.location.pathname}?page=${next}`;
        window.history.replaceState(null, '', url);
      } catch {
        /* no-op */
      }
      requestAnimationFrame(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },
    [totalPages]
  );

  const startIndex = (page - 1) * APTITUDE_PER_PAGE;
  const endIndex = Math.min(startIndex + APTITUDE_PER_PAGE, total);
  const pageQuestions = useMemo(() => questions.slice(startIndex, endIndex), [questions, startIndex, endIndex]);

  const answeredCount = Object.keys(answers).length;
  const correctCount = useMemo(
    () => questions.reduce((n, q, i) => (answers[i] === q.a ? n + 1 : n), 0),
    [questions, answers]
  );
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const progressPct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;
  const finished = total > 0 && answeredCount === total;

  const selectOption = (gi: number, oi: number) => {
    if (answers[gi] !== undefined || revealed[gi]) return;
    setAnswers((prev) => ({ ...prev, [gi]: oi }));
  };

  const toggleSolution = (gi: number) => {
    const willOpen = !openSolutions[gi];
    setOpenSolutions((prev) => ({ ...prev, [gi]: willOpen }));
    if (willOpen && answers[gi] === undefined) {
      // viewing the solution first reveals the answer and locks the question
      setRevealed((prev) => ({ ...prev, [gi]: true }));
    }
  };

  const resetTopic = () => {
    if (answeredCount > 0 || Object.keys(revealed).length > 0) {
      if (!window.confirm('Reset all your answers for this topic?')) return;
    }
    setAnswers({});
    setRevealed({});
    setOpenSolutions({});
    goToPage(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-8 space-y-5">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-500">
        <Link href="/quizzes" className="hover:text-emerald-700 transition">MCQ Practice</Link>
        <ChevronRight className="w-3 h-3 text-slate-300" strokeWidth={2.5} />
        <Link href="/quizzes/aptitude" className="hover:text-emerald-700 transition">Aptitude</Link>
        <ChevronRight className="w-3 h-3 text-slate-300" strokeWidth={2.5} />
        <span className="text-slate-800">{topic.title}</span>
      </nav>

      {/* Header card */}
      <header className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className={`h-1.5 ${theme.bar}`} />
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center shrink-0 ${theme.badge}`}>
              <TopicIcon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.25} />
            </div>
            <div className="min-w-0 space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                {topic.title} <span className="text-slate-400 font-bold">— Aptitude MCQs</span>
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                <span className={`px-2.5 py-1 rounded-full border ${theme.chip}`}>{total} Questions</span>
                <span className="px-2.5 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                  {APTITUDE_PER_PAGE} per page
                </span>
                <span className="px-2.5 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                  {totalPages} pages
                </span>
                <span className="px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                  Solutions on demand
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-2.5 text-center">
              <ListChecks className="w-4 h-4 mx-auto text-blue-600 mb-1" strokeWidth={2.25} />
              <p className="text-base sm:text-lg font-black text-slate-900 leading-none">
                {answeredCount}<span className="text-slate-400 text-xs font-bold"> / {total}</span>
              </p>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-1">Answered</p>
            </div>
            <div className="rounded-xl bg-emerald-50/60 border border-emerald-200/70 px-3 py-2.5 text-center">
              <CheckCircle2 className="w-4 h-4 mx-auto text-emerald-600 mb-1" strokeWidth={2.25} />
              <p className="text-base sm:text-lg font-black text-emerald-800 leading-none">{correctCount}</p>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-1">Correct</p>
            </div>
            <div className="rounded-xl bg-amber-50/60 border border-amber-200/70 px-3 py-2.5 text-center">
              <Target className="w-4 h-4 mx-auto text-amber-600 mb-1" strokeWidth={2.25} />
              <p className="text-base sm:text-lg font-black text-amber-800 leading-none">{accuracy}%</p>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-1">Accuracy</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>Topic progress</span>
              <button
                type="button"
                onClick={resetTopic}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 transition"
              >
                <RotateCcw className="w-3 h-3" strokeWidth={2.5} />
                Reset
              </button>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
              <div className={`h-full rounded-full transition-all duration-500 ${theme.bar}`} style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Share Bar in Header */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-500">
              Share {topic.title} Practice MCQs:
            </span>
            <ShareButtons
              url={`/quizzes/aptitude/${topic.slug}`}
              title={`${topic.title} — Aptitude MCQs (${total} Solved Questions)`}
              description={`Practice ${total} ${topic.title} aptitude MCQs (${APTITUDE_PER_PAGE} per page) with step-by-step solutions on GovtJobs.pk.`}
              compact
            />
          </div>
        </div>
      </header>

      {/* TOP page counting + pagination */}
      <div ref={topRef} className="scroll-mt-28" />
      <PaginationBar
        page={page}
        totalPages={totalPages}
        from={startIndex + 1}
        to={endIndex}
        total={total}
        onChange={goToPage}
        accentBar={theme.bar}
        position="top"
      />

      {/* Completion banner */}
      {finished && (
        <div className="bg-gradient-to-br from-white via-emerald-50/70 to-amber-50/50 border border-emerald-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <Trophy className="w-7 h-7 text-amber-600" strokeWidth={2.25} />
          </div>
          <div className="flex-1 space-y-0.5">
            <h2 className="text-base sm:text-lg font-black text-slate-900">Topic complete!</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              You scored <strong className="text-emerald-700">{correctCount}</strong> out of{' '}
              <strong>{total}</strong> ({accuracy}% accuracy) in {topic.title}.
            </p>
          </div>
          {nextTopic && (
            <Link
              href={`/quizzes/aptitude/${nextTopic.slug}`}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-xl transition shadow-xs"
            >
              Next: {nextTopic.title}
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          )}
        </div>
      )}

      {/* Questions */}
      {total === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm font-semibold text-slate-600">
          Questions for this topic could not be loaded. Please refresh the page.
        </div>
      ) : (
        <ol className="space-y-4" aria-label={`${topic.title} questions, page ${page}`}>
          {pageQuestions.map((q, idx) => {
            const gi = startIndex + idx;
            const selected = answers[gi];
            const isAnswered = selected !== undefined;
            const isRevealed = !!revealed[gi];
            const showResult = isAnswered || isRevealed;
            const isCorrect = isAnswered && selected === q.a;
            const solOpen = !!openSolutions[gi];

            const cardStyle = !showResult
              ? 'border-slate-200 hover:border-slate-300'
              : isAnswered
              ? isCorrect
                ? 'border-emerald-300 bg-emerald-50/30'
                : 'border-rose-300 bg-rose-50/30'
              : 'border-amber-200 bg-amber-50/20';

            return (
              <React.Fragment key={gi}>
                <li
                  className={`bg-white rounded-2xl border shadow-xs p-4 sm:p-5 space-y-4 transition-colors ${cardStyle}`}
                >
                  {/* Question */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-3">
                    <span
                      className={`min-w-[2.25rem] w-fit h-8 sm:h-9 px-2 rounded-xl border font-black text-xs tabular-nums flex items-center justify-center shrink-0 ${theme.badge}`}
                      aria-label={`Question ${gi + 1}`}
                    >
                      Q{gi + 1}
                    </span>
                    <RichMath
                      text={q.q}
                      className="flex-1 min-w-0 w-full mcq-question-text font-semibold text-slate-900 sm:pt-0.5"
                    />
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="group" aria-label="Answer options">
                    {q.o.map((opt, oi) => {
                      const isSel = selected === oi;
                      const isRight = oi === q.a;

                      let style =
                        'border-slate-200 bg-white text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/40 cursor-pointer';
                      let badge = 'border-slate-300 text-slate-500 bg-slate-50';

                      if (showResult) {
                        if (isRight) {
                          style = 'border-emerald-400 bg-emerald-50 text-emerald-950 cursor-default';
                          badge = 'border-emerald-500 bg-emerald-500 text-white';
                        } else if (isSel) {
                          style = 'border-rose-400 bg-rose-50 text-rose-950 cursor-default';
                          badge = 'border-rose-500 bg-rose-500 text-white';
                        } else {
                          style = 'border-slate-200 bg-slate-50/60 text-slate-500 cursor-default opacity-70';
                        }
                      }

                      return (
                        <button
                          key={oi}
                          type="button"
                          disabled={showResult}
                          onClick={() => selectOption(gi, oi)}
                          aria-pressed={isSel}
                          className={`w-full min-h-[2.75rem] text-left px-3 py-2.5 rounded-xl border text-[13px] sm:text-sm font-medium transition flex items-center gap-3 ${style}`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg border text-[11px] font-black flex items-center justify-center shrink-0 ${badge}`}
                          >
                            {LETTERS[oi]}
                          </span>
                          <RichMath text={opt} className="flex-1 min-w-0 break-words leading-snug" />
                          {showResult && isRight && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.5} />
                          )}
                          {showResult && isSel && !isRight && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" strokeWidth={2.5} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer: status + Solution toggle */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                    <p className="text-[11px] sm:text-xs font-bold">
                      {isAnswered ? (
                        isCorrect ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700">
                            <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} /> Correct answer
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-rose-700">
                            <XCircle className="w-4 h-4" strokeWidth={2.5} /> Incorrect — right answer is {LETTERS[q.a]}
                          </span>
                        )
                      ) : isRevealed ? (
                        <span className="text-amber-700">Solution viewed — right answer is {LETTERS[q.a]}</span>
                      ) : (
                        <span className="text-slate-400 font-semibold">Choose an option</span>
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={() => toggleSolution(gi)}
                      aria-expanded={solOpen}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-extrabold transition ${
                        solOpen
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      <Lightbulb className="w-4 h-4" strokeWidth={2.25} />
                      {solOpen ? 'Hide Solution' : 'Show Solution'}
                    </button>
                  </div>

                  {/* Solution — only rendered when the user clicks "Show Solution" */}
                  {solOpen && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-extrabold">
                        <span className="inline-flex items-center gap-1.5 text-amber-800">
                          <Lightbulb className="w-4 h-4" strokeWidth={2.25} /> Solution
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white border border-emerald-200 text-emerald-700">
                          Correct answer: {LETTERS[q.a]}
                        </span>
                      </div>
                      {q.s ? (
                        <RichMath
                          text={q.s}
                          className="text-[13px] sm:text-sm text-slate-700 leading-relaxed break-words"
                        />
                      ) : (
                        <p className="text-xs sm:text-sm text-slate-500">
                          A step-by-step solution is not available for this question. The correct option is{' '}
                          <strong>{LETTERS[q.a]}</strong>.
                        </p>
                      )}
                    </div>
                  )}
                </li>

                {/* one ad slot in the middle of each page (renders only when AdSense is configured) */}
                {idx === 4 && (
                  <li aria-hidden="true" className="list-none">
                    <AdSlot format="horizontal" />
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      )}

      {/* Bottom pagination */}
      {total > 0 && (
        <PaginationBar
          page={page}
          totalPages={totalPages}
          from={startIndex + 1}
          to={endIndex}
          total={total}
          onChange={goToPage}
          accentBar={theme.bar}
          position="bottom"
        />
      )}

      {/* Prev / next topic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {prevTopic ? (
          <Link
            href={`/quizzes/aptitude/${prevTopic.slug}`}
            className="group bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 flex items-center gap-3 transition shadow-xs"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 shrink-0" strokeWidth={2.25} />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Previous topic</p>
              <p className="text-sm font-extrabold text-slate-900 truncate">{prevTopic.title}</p>
            </div>
          </Link>
        ) : (
          <span />
        )}
        {nextTopic && (
          <Link
            href={`/quizzes/aptitude/${nextTopic.slug}`}
            className="group bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 flex items-center justify-end gap-3 text-right transition shadow-xs"
          >
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Next topic</p>
              <p className="text-sm font-extrabold text-slate-900 truncate">{nextTopic.title}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 shrink-0" strokeWidth={2.25} />
          </Link>
        )}
      </div>

      {/* Bottom Social Link Preview & Share Banner */}
      <SectionShareBar
        path={`/quizzes/aptitude/${topic.slug}`}
        title={`${topic.title} — Aptitude MCQs (${total} Solved Questions)`}
        description={`Practice ${total} ${topic.title} aptitude MCQs (${APTITUDE_PER_PAGE} per page) with step-by-step solutions for FPSC, PPSC, SPSC, NTS & CSS.`}
        badge={`${topic.title} Aptitude`}
      />
    </div>
  );
}

function PaginationBar({
  page,
  totalPages,
  from,
  to,
  total,
  onChange,
  accentBar,
  position,
}: {
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  onChange: (p: number) => void;
  accentBar: string;
  position: 'top' | 'bottom';
}) {
  const pages = pageWindow(page, totalPages);

  return (
    <div
      className="bg-white border border-slate-200/90 rounded-2xl shadow-xs px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      aria-label={`${position === 'top' ? 'Top' : 'Bottom'} pagination`}
    >
      {/* Page counter */}
      <div className="flex items-center gap-3">
        <div className={`${accentBar} text-white rounded-xl px-3 py-1.5 text-center leading-none shadow-xs`}>
          <span className="block text-[9px] font-bold uppercase tracking-wider opacity-90">Page</span>
          <span className="block text-base font-black mt-0.5">
            {page}<span className="opacity-80 text-xs font-bold"> / {totalPages}</span>
          </span>
        </div>
        <div className="text-xs">
          <p className="font-extrabold text-slate-900">
            Questions {from}–{to}
          </p>
          <p className="text-slate-500 font-medium">of {total} total</p>
        </div>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="h-9 px-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 text-xs font-bold flex items-center gap-1 transition"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="w-6 text-center text-slate-400 font-bold">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`w-9 h-9 rounded-xl text-xs font-extrabold transition ${
                p === page
                  ? `${accentBar} text-white shadow-xs`
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="h-9 px-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 text-xs font-bold flex items-center gap-1 transition"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
