import React from 'react';
import Link from 'next/link';
import { FileQuestion, Briefcase, FileCheck, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="liquid-glass-card max-w-lg w-full p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8 text-emerald-600" />
        </div>

        <div className="space-y-2">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            404 — Page Not Found
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            This page or job posting has moved
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The link you followed may have expired or been updated. Explore the latest verified government jobs and online MCQ practice tests below.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            <Briefcase className="w-4 h-4" />
            Latest Jobs
          </Link>
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            <FileCheck className="w-4 h-4" />
            Practice MCQs
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition"
          >
            <Home className="w-4 h-4" />
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
