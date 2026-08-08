'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowUp, Briefcase, BookOpen, FileCheck, Newspaper, FileText, Shield, Mail } from 'lucide-react';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-govt-charcoal text-gray-300 mt-16 text-sm relative" role="contentinfo">
      {/* Gradient top border */}
      <div className="h-1 bg-gradient-to-r from-govt-emerald via-govt-gold to-govt-emerald" />

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Portal Branding */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-govt-emerald to-emerald-800 flex items-center justify-center text-white font-extrabold text-xs border-2 border-govt-gold/50 shadow-glow-gold">
              GJ
            </div>
            <div>
              <h3 className={`font-extrabold text-white text-base ${isUr ? 'font-urdu' : ''}`}>
                {t('nav.title')}
              </h3>
              <p className="text-[10px] text-gray-500 font-medium tracking-wide">Est. 2024 · Trusted Portal</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Authentic portal providing federal & provincial government job notifications, downloadable entry-test solved materials, and timed MCQ quizzes.
          </p>

          {/* Newsletter Mini Form */}
          <div className="pt-2">
            <p className="text-[11px] font-bold text-gray-300 mb-2 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-govt-gold" />
              Get Job Alerts
            </p>
            <div className="flex gap-1.5">
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email for job alerts"
                className="flex-1 px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-govt-gold transition"
              />
              <button
                aria-label="Subscribe to alerts"
                className="px-3 py-2 bg-govt-gold hover:bg-yellow-500 text-govt-charcoal font-extrabold text-xs rounded-lg transition-all duration-200 shadow-glow-gold"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-govt-gold" />
            Quick Portals
          </h4>
          <ul className="space-y-2.5 text-xs">
            {[
              { href: '/jobs', icon: Briefcase, label: 'Jobs' },
              { href: '/materials', icon: BookOpen, label: 'Past Papers' },
              { href: '/quizzes', icon: FileCheck, label: 'MCQ Practice Tests' },
              { href: '/mock-tests', icon: Newspaper, label: 'Mock Tests' },
              { href: '/forms', icon: FileText, label: 'Challan & Application Forms' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 text-gray-400 hover:text-govt-gold transition-colors duration-200 group"
                >
                  <link.icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-govt-gold transition-colors" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Exam Boards & Agencies */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-govt-emerald" />
            Recruitment Commissions
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-400">
            {[
              'Federal Public Service Commission (FPSC)',
              'Punjab Public Service Commission (PPSC)',
              'Sindh Public Service Commission (SPSC)',
              'KP Public Service Commission (KPPSC)',
              'National Testing Service (NTS / ETEA)',
            ].map((name) => (
              <li key={name} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                {name}
              </li>
            ))}
          </ul>
        </div>

        {/* Official Disclaimer */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-govt-red" />
            Official Notice
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            All job advertisements and test materials displayed are collected from official government gazettes, gazetted newspapers, and recruitment commissions for public service.
          </p>
          <div className="mt-4 pt-3 border-t border-gray-800/60">
            <Link
              href="/admin/login"
              className="text-[11px] text-gray-500 hover:text-govt-gold transition-colors duration-200 flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Authorized Admin Access
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-black/40 py-4 border-t border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} GovtJobs.pk — Government Jobs & Test Prep Portal. All rights reserved.
          </p>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-govt-gold transition-all duration-200 group"
          >
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
