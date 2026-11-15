'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import JobCard from '@/components/JobCard';
import NewsCard from '@/components/NewsCard';
import AdSlot from '@/components/AdSlot';
import Loader, { SkeletonCard } from '@/components/Loader';
import {
  Search,
  Briefcase,
  BookOpen,
  FileCheck,
  Newspaper,
  FileText,
  Users,
  TrendingUp,
  ChevronRight,
  Star,
  Zap,
  Award,
  Shield,
} from 'lucide-react';
import { IJob, INews } from '@/lib/types';

export default function Home() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [news, setNews] = useState<INews[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const isUr = i18n.language === 'ur';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, newsRes] = await Promise.all([
          axios.get('/api/jobs?limit=6'),
          axios.get('/api/news?limit=4')
        ]);
        setJobs(jobsRes.data);
        setNews(newsRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const quickLinks = [
    { href: '/jobs', icon: Briefcase, labelKey: 'nav.jobs', desc: 'Federal & Provincial', iconBg: 'bg-emerald-50 border-emerald-200/80 text-emerald-600' },
    { href: '/materials', icon: BookOpen, labelKey: 'nav.materials', desc: 'Past Papers & Notes', iconBg: 'bg-blue-50 border-blue-200/80 text-blue-600' },
    { href: '/quizzes', icon: FileCheck, labelKey: 'nav.quizzes', desc: 'Timed MCQs Test', iconBg: 'bg-amber-50 border-amber-200/80 text-amber-600' },
    { href: '/news', icon: Newspaper, labelKey: 'nav.news', desc: 'Notifications & Results', iconBg: 'bg-purple-50 border-purple-200/80 text-purple-600' },
  ];

  const stats = [
    { label: 'Active Jobs', value: '500+', icon: Briefcase, iconBg: 'bg-emerald-50 border-emerald-200/80 text-emerald-600' },
    { label: 'MCQ Questions', value: '1,000+', icon: Zap, iconBg: 'bg-amber-50 border-amber-200/80 text-amber-600' },
    { label: 'Past Papers', value: '50+', icon: FileText, iconBg: 'bg-blue-50 border-blue-200/80 text-blue-600' },
    { label: 'Aspirants', value: '10,000+', icon: Users, iconBg: 'bg-purple-50 border-purple-200/80 text-purple-600' },
  ];

  const commissions = [
    'FPSC', 'PPSC', 'SPSC', 'KPPSC', 'NTS', 'ETEA'
  ];

  return (
    <div className="space-y-0 pb-0">
      {/* ───── Hero Section (Soft White & Pastel) ───── */}
      <section
        className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/90 to-emerald-50/40 text-slate-900 border-b border-slate-200/80"
        aria-label="Hero banner"
      >
        {/* Soft ambient pastel blobs */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-100/70 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-10 sm:py-16 md:py-20 text-center space-y-6 sm:space-y-7">
          {/* Soft Badge Tagline */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200/90 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-xs animate-fade-in">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" strokeWidth={2.25} />
            <span className="text-slate-700">Pakistan&apos;s #1 Government Jobs &amp; Test Prep Portal</span>
          </div>

          <h1 className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 animate-slide-up px-1 ${isUr ? 'font-urdu leading-relaxed' : ''}`}>
            {t('home.heroTitle')}
          </h1>

          <p className="text-xs sm:text-sm md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed animate-slide-up px-2" style={{ animationDelay: '100ms' }}>
            {t('home.heroSubtitle')}
          </p>

          {/* Soft White Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 bg-white rounded-2xl shadow-lg p-2 border border-slate-200/90 animate-scale-in"
            style={{ animationDelay: '200ms' }}
            id="hero-search-form"
          >
            <div className="flex items-center flex-1 bg-slate-50/70 sm:bg-transparent rounded-xl px-3">
              <Search className="w-5 h-5 text-emerald-600 shrink-0" strokeWidth={2.25} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('home.searchJobs')}
                className="w-full px-3 py-3 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                id="hero-search-input"
                aria-label="Search government jobs"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-7 py-3 rounded-xl text-sm transition-all duration-200 shadow-sm whitespace-nowrap"
              id="hero-search-btn"
            >
              {t('common.search')}
            </button>
          </form>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-5 md:gap-6 pt-2 sm:pt-4 animate-fade-in" style={{ animationDelay: '350ms' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 bg-white border border-slate-200/80 px-4 py-3 rounded-2xl shadow-xs">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                  <stat.icon className="w-5 h-5" strokeWidth={2.25} />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 leading-tight">{stat.value}</div>
                  <div className="text-[11px] text-slate-500 font-semibold truncate">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Trust Bar ───── */}
      <section className="bg-white border-b border-slate-200/80 py-3.5" aria-label="Trusted commissions">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-8">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" strokeWidth={2.25} />
            Data from official commissions
          </span>
          <div className="flex items-center gap-3 md:gap-5 flex-wrap justify-center">
            {commissions.map((name) => (
              <span key={name} className="text-xs font-extrabold text-slate-700 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg hover:border-emerald-300 hover:text-emerald-700 transition-colors duration-200 cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Main Content ───── */}
      <div className="max-w-7xl mx-auto px-4 space-y-16 py-12">

        {/* Quick Resource Cards — Soft White & Crisp Icons */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children" aria-label="Quick navigation">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white hover:bg-slate-50/60 border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col items-center text-center"
                id={`quick-link-${link.href.replace('/', '')}`}
              >
                <div className={`w-14 h-14 rounded-2xl border ${link.iconBg} flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className="w-6 h-6" strokeWidth={2.25} />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">{t(link.labelKey)}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{link.desc}</p>
              </Link>
            );
          })}
        </section>

        {/* ───── Featured Job Postings ───── */}
        <section aria-label="Featured jobs">
          <div className="flex items-center justify-between border-b border-govt-border pb-4 mb-6">
            <div>
              <h2 className={`text-xl md:text-2xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                {t('home.featuredJobs')}
              </h2>
              <p className="text-xs text-govt-muted mt-0.5">Latest verified government career opportunities</p>
            </div>
            <Link
              href="/jobs"
              className="text-xs font-bold text-govt-emerald hover:text-govt-emerald-dark flex items-center gap-1 transition-colors group"
              id="view-all-jobs"
            >
              {t('home.viewAll')}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="card-premium p-10 text-center space-y-2">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-govt-muted">{t('home.noJobs')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {jobs.slice(0, 6).map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </section>

        {/* CLS-Safe Sponsored Ad Slot */}
        <AdSlot format="horizontal" />

        {/* ───── Latest News ───── */}
        <section aria-label="Latest news" className="section-alt -mx-4 px-4 py-12 rounded-2xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between border-b border-govt-border pb-4 mb-6">
              <div>
                <h2 className={`text-xl md:text-2xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                  {t('home.latestNews')}
                </h2>
                <p className="text-xs text-govt-muted mt-0.5">Exam schedules, syllabus updates, & policy news</p>
              </div>
              <Link
                href="/news"
                className="text-xs font-bold text-govt-emerald hover:text-govt-emerald-dark flex items-center gap-1 transition-colors group"
                id="view-all-news"
              >
                {t('home.viewAll')}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : news.length === 0 ? (
              <div className="card-premium p-10 text-center space-y-2">
                <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-govt-muted">{t('news.noNews')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
                {news.slice(0, 4).map((item) => (
                  <NewsCard key={item._id} news={item} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ───── CTA Section (Soft White & Pastel Mint) ───── */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/70 to-amber-50/50 text-slate-900 border border-emerald-200/80 rounded-2xl p-8 md:p-12 shadow-sm"
          aria-label="Call to action"
        >
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2.5 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">Start Preparing Today</h2>
              <p className="text-sm text-slate-600 max-w-lg leading-relaxed">
                Access thousands of MCQs, download solved past papers, and track your progress with timed practice tests — completely free.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/quizzes"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-all duration-200 shadow-xs flex items-center gap-2 whitespace-nowrap"
                id="cta-start-quiz"
              >
                <Zap className="w-4 h-4" strokeWidth={2.25} />
                Take a Quiz
              </Link>
              <Link
                href="/materials"
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200 flex items-center gap-2 whitespace-nowrap shadow-xs"
                id="cta-past-papers"
              >
                <BookOpen className="w-4 h-4 text-blue-600" strokeWidth={2.25} />
                Past Papers
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
