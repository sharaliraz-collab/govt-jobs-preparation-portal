'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowUp, Briefcase, BookOpen, FileCheck, Newspaper, FileText, Shield, Mail, Building2 } from 'lucide-react';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 mt-16 text-sm relative overflow-hidden" role="contentinfo">
      {/* Soft Pastel Top Accent */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-teal-400 opacity-80" />

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Portal Branding */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-xs shadow-xs">
              GJ
            </div>
            <div>
              <h3 className={`font-extrabold text-slate-900 text-base ${isUr ? 'font-urdu' : ''}`}>
                {t('nav.title')}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">Est. 2024 · Trusted Portal</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Authentic portal providing federal &amp; provincial government job notifications, downloadable entry-test solved materials, and timed MCQ quizzes.
          </p>

          {/* Newsletter Mini Form */}
          <div className="pt-2">
            <p className="text-[11px] font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.25} />
              Get Job Alerts
            </p>
            <div className="flex gap-1.5">
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email for job alerts"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition"
              />
              <button
                aria-label="Subscribe to alerts"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-xs"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-slate-900 font-extrabold text-sm mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-emerald-500" />
            Quick Portals
          </h4>
          <ul className="space-y-2.5 text-xs">
            {[
              { href: '/jobs', icon: Briefcase, label: 'Jobs', color: 'text-emerald-600' },
              { href: '/materials', icon: BookOpen, label: 'Past Papers', color: 'text-blue-600' },
              { href: '/quizzes', icon: FileCheck, label: 'MCQ Practice Tests', color: 'text-amber-600' },
              { href: '/mock-tests', icon: Newspaper, label: 'Mock Tests', color: 'text-purple-600' },
              { href: '/forms', icon: FileText, label: 'Challan & Application Forms', color: 'text-teal-600' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2.5 text-slate-600 hover:text-emerald-700 font-medium transition-colors duration-200 group"
                >
                  <link.icon className={`w-4 h-4 ${link.color} shrink-0`} strokeWidth={2.25} />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Exam Boards & Agencies */}
        <div>
          <h4 className="text-slate-900 font-extrabold text-sm mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-amber-500" />
            Recruitment Commissions
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {[
              'Federal Public Service Commission (FPSC)',
              'Punjab Public Service Commission (PPSC)',
              'Sindh Public Service Commission (SPSC)',
              'KP Public Service Commission (KPPSC)',
              'National Testing Service (NTS / ETEA)',
            ].map((name) => (
              <li key={name} className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={2.25} />
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Official Disclaimer */}
        <div>
          <h4 className="text-slate-900 font-extrabold text-sm mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-blue-500" />
            Official Notice
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            All job advertisements and test materials displayed are collected from official government gazettes, gazetted newspapers, and recruitment commissions for public service.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-200/80">
            <Link
              href="/admin/login"
              className="text-[11px] text-slate-500 hover:text-emerald-700 font-semibold transition-colors duration-200 flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.25} />
              Authorized Admin Access
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-slate-50 py-4 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} GovtJobs.pk — Government Jobs &amp; Test Prep Portal. All rights reserved.
          </p>

          {/* Legal & Policy Links (Required for AdSense & User Trust) */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-medium text-slate-600">
            <Link href="/about" className="hover:text-emerald-700 transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-emerald-700 transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-emerald-700 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-emerald-700 transition-colors">Terms</Link>
            <Link href="/disclaimer" className="hover:text-emerald-700 transition-colors">Disclaimer</Link>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-all duration-200 group"
          >
            <ArrowUp className="w-3.5 h-3.5 text-emerald-600 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.25} />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
