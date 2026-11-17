'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 mt-16 text-sm" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* Portal Branding */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className={`font-semibold text-slate-900 text-[16px] tracking-tight ${isUr ? 'font-urdu' : ''}`}>
            {t('nav.title')}
          </h3>
          <p className="text-[13px] text-slate-500 leading-relaxed max-w-sm">
            Federal and provincial government job listings, downloadable past papers, and subject-wise
            MCQ question banks for competitive examinations across Pakistan.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="pt-2 flex items-center gap-2 max-w-sm"
          >
            <input
              type="email"
              placeholder="Email address for job alerts"
              aria-label="Email for job alerts"
              className="flex-1 min-w-0 h-9 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition"
            />
            <button
              type="submit"
              aria-label="Subscribe to alerts"
              className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-[13px] rounded-md transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-3">
            Sections
          </h4>
          <ul className="space-y-2 text-[13px]">
            {[
              { href: '/quizzes', label: 'MCQ Subjects' },
              { href: '/quizzes/aptitude', label: 'Aptitude Test' },
              { href: '/mock-tests', label: 'Mock Exams' },
              { href: '/jobs', label: 'Government Jobs' },
              { href: '/materials', label: 'Past Papers' },
              { href: '/forms', label: 'Challan & Forms' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Exam Boards */}
        <div className="lg:col-span-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-3">
            Exam Boards
          </h4>
          <ul className="space-y-2 text-[13px] text-slate-600">
            {[
              'Federal Public Service Commission (FPSC)',
              'Punjab Public Service Commission (PPSC)',
              'Sindh Public Service Commission (SPSC)',
              'KP Public Service Commission (KPPSC)',
              'National Testing Service (NTS / STS)',
            ].map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>

        {/* Notice */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Information Note
          </h4>
          <p className="text-[13px] text-slate-500 leading-relaxed">
            Job notices and study materials are compiled from official government gazettes, national
            newspapers, and public testing agencies for candidate reference.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="text-[12px] text-slate-500 hover:text-slate-900 underline underline-offset-4 transition-colors"
            >
              Admin sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-200 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-500">
          <p>
            © {new Date().getFullYear()} GovtJobs.pk. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <Link href="/about" className="hover:text-slate-900 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="/disclaimer" className="hover:text-slate-900 transition-colors">Disclaimer</Link>
            <button
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
