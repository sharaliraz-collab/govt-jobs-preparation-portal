'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpenCheck, ChevronRight, Layers, Lightbulb, ListChecks, Search, X } from 'lucide-react';
import {
  APTITUDE_GROUPS,
  APTITUDE_PER_PAGE,
  APTITUDE_TOPICS,
  APTITUDE_TOTAL_QUESTIONS,
  AptitudeGroupId,
} from '@/data/aptitudeTopics';
import { APTITUDE_THEME } from '@/lib/aptitudeTheme';
import { QuickShareButton, SectionShareBar } from '@/components/ShareButtons';

export default function AptitudeHub() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<AptitudeGroupId | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return APTITUDE_TOPICS.filter(
      (t) => (group === 'all' || t.group === group) && (!q || t.title.toLowerCase().includes(q))
    );
  }, [query, group]);

  const stats = [
    { icon: ListChecks, label: 'MCQs', value: APTITUDE_TOTAL_QUESTIONS.toLocaleString(), tone: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { icon: Layers, label: 'Topics', value: String(APTITUDE_TOPICS.length), tone: 'bg-blue-50 text-blue-600 border-blue-200' },
    { icon: BookOpenCheck, label: 'Per page', value: String(APTITUDE_PER_PAGE), tone: 'bg-purple-50 text-purple-600 border-purple-200' },
    { icon: Lightbulb, label: 'Solutions', value: 'On click', tone: 'bg-amber-50 text-amber-600 border-amber-200' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-8 space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-500">
        <Link href="/quizzes" className="hover:text-emerald-700 transition">MCQ Practice</Link>
        <ChevronRight className="w-3 h-3 text-slate-300" strokeWidth={2.5} />
        <span className="text-slate-800">Aptitude</span>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/50 to-amber-50/40 border border-slate-200/90 rounded-2xl shadow-sm p-5 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-2 bg-white border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold shadow-xs">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" strokeWidth={2.5} />
            FPSC · PPSC · SPSC · NTS · CSS · PMS
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Aptitude Test MCQs
          </h1>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Practice {APTITUDE_TOTAL_QUESTIONS.toLocaleString()} quantitative aptitude questions across{' '}
            {APTITUDE_TOPICS.length} topics. Attempt {APTITUDE_PER_PAGE} questions per page, see instant feedback and open
            the step-by-step solution only when you need it.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-2xl px-3.5 py-3 shadow-xs">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${s.tone}`}>
                <s.icon className="w-5 h-5" strokeWidth={2.25} />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-black text-slate-900 leading-tight">{s.value}</p>
                <p className="text-[11px] font-semibold text-slate-500 truncate">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Media Share & Preview Bar */}
      <SectionShareBar
        path="/quizzes/aptitude"
        title={`Aptitude Test MCQs — ${APTITUDE_TOTAL_QUESTIONS.toLocaleString()} Questions Across 43 Topics`}
        description="Free quantitative reasoning practice with 10 questions per page and step-by-step math solutions for FPSC, PPSC, SPSC, NTS & CSS."
        badge="Aptitude Test Bank"
      />

      {/* Search + group filters */}
      <section className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-4 sm:p-5 space-y-4" aria-label="Find a topic">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={2.5} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a topic — e.g. Percentage, Trains, Algebra…"
            aria-label="Search aptitude topics"
            className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setGroup('all')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
              group === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Topics ({APTITUDE_TOPICS.length})
          </button>
          {APTITUDE_GROUPS.map((g) => {
            const theme = APTITUDE_THEME[g.id];
            const Icon = theme.icon;
            const active = group === g.id;
            const n = APTITUDE_TOPICS.filter((t) => t.group === g.id).length;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroup(g.id)}
                title={g.blurb}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                  active ? `${theme.chip} ring-2 ring-offset-1 ring-slate-200` : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? '' : theme.text}`} strokeWidth={2.5} />
                {g.label} ({n})
              </button>
            );
          })}
        </div>
      </section>

      {/* Topic grid with per-item social share */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-2">
          <Search className="w-9 h-9 text-slate-300 mx-auto" strokeWidth={2} />
          <p className="text-sm font-bold text-slate-700">No topics match “{query}”.</p>
          <button
            type="button"
            onClick={() => { setQuery(''); setGroup('all'); }}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => {
            const theme = APTITUDE_THEME[t.group];
            const Icon = theme.icon;
            const pages = Math.ceil(t.count / APTITUDE_PER_PAGE);
            const groupLabel = APTITUDE_GROUPS.find((g) => g.id === t.group)?.label || 'Aptitude';
            return (
              <div
                key={t.slug}
                className={`group bg-white border border-slate-200/90 ${theme.hover} rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4`}
              >
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/quizzes/aptitude/${t.slug}`} className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${theme.badge}`}>
                      <Icon className="w-6 h-6" strokeWidth={2.25} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                        {t.title}
                      </h2>
                      <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1">
                        {t.count} MCQs · {pages} {pages === 1 ? 'page' : 'pages'}
                      </p>
                    </div>
                  </Link>
                  <QuickShareButton
                    path={`/quizzes/aptitude/${t.slug}`}
                    title={`${t.title} — Aptitude MCQs (${t.count} Solved Questions)`}
                    description={`Practice ${t.count} ${t.title} aptitude MCQs (${APTITUDE_PER_PAGE} per page) with step-by-step solutions on GovtJobs.pk.`}
                    badge={groupLabel}
                  />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.chip}`}>
                    {groupLabel}
                  </span>
                  <Link
                    href={`/quizzes/aptitude/${t.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 group-hover:translate-x-0.5 transition-transform"
                  >
                    Start practice <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
