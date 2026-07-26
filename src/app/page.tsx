'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import JobCard from '@/components/JobCard';
import NewsCard from '@/components/NewsCard';
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
    { href: '/jobs', icon: Briefcase, labelKey: 'nav.jobs', desc: 'Federal & Provincial', color: 'from-emerald-500 to-emerald-700', bgLight: 'bg-emerald-50', textColor: 'text-emerald-700' },
    { href: '/materials', icon: BookOpen, labelKey: 'nav.materials', desc: 'Past Papers & Notes', color: 'from-blue-500 to-blue-700', bgLight: 'bg-blue-50', textColor: 'text-blue-700' },
    { href: '/quizzes', icon: FileCheck, labelKey: 'nav.quizzes', desc: 'Timed MCQs Test', color: 'from-amber-500 to-amber-700', bgLight: 'bg-amber-50', textColor: 'text-amber-700' },
    { href: '/news', icon: Newspaper, labelKey: 'nav.news', desc: 'Notifications & Results', color: 'from-purple-500 to-purple-700', bgLight: 'bg-purple-50', textColor: 'text-purple-700' },
  ];

  const stats = [
    { label: 'Active Jobs', value: '500+', icon: Briefcase },
    { label: 'MCQ Questions', value: '1,000+', icon: Zap },
    { label: 'Past Papers', value: '50+', icon: FileText },
    { label: 'Aspirants', value: '10,000+', icon: Users },
  ];

  const commissions = [
    'FPSC', 'PPSC', 'SPSC', 'KPPSC', 'NTS', 'ETEA'
  ];

  return (
    <div className="space-y-0 pb-0">
      {/* ───── Hero Section ───── */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-govt-emerald-dark via-govt-emerald to-emerald-800 text-white"
        aria-label="Hero banner"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Floating gradient orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-govt-gold/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center space-y-8">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold animate-fade-in">
            <Star className="w-3.5 h-3.5 text-govt-gold fill-govt-gold" />
            <span>Pakistan&apos;s #1 Government Jobs & Test Prep Portal</span>
          </div>

          <h1 className={`text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis animate-slide-up ${isUr ? 'font-urdu' : ''}`}>
            {t('home.heroTitle')}
          </h1>

          <p className="text-sm md:text-lg text-emerald-100/80 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
            {t('home.heroSubtitle')}
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center bg-white rounded-2xl shadow-elevated p-1.5 border-2 border-govt-gold/40 animate-scale-in"
            style={{ animationDelay: '200ms' }}
            id="hero-search-form"
          >
            <div className="pl-4 text-gray-400">
              <Search className="w-5 h-5 text-govt-emerald" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('home.searchJobs')}
              className="w-full px-3 py-3 text-sm text-govt-charcoal bg-transparent focus:outline-none"
              id="hero-search-input"
              aria-label="Search government jobs"
            />
            <button
              type="submit"
              className="bg-govt-emerald hover:bg-govt-emerald-dark text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-all duration-200 shadow-sm hover:shadow-glow-emerald whitespace-nowrap"
              id="hero-search-btn"
            >
              {t('common.search')}
            </button>
          </form>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 pt-4 animate-fade-in" style={{ animationDelay: '350ms' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5 stat-glow px-3 py-2 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-govt-gold" />
                </div>
                <div className="text-left">
                  <div className="text-lg md:text-xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-[10px] text-emerald-200/70 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Trust Bar ───── */}
      <section className="bg-white border-b border-govt-border py-4" aria-label="Trusted commissions">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8">
          <span className="text-[10px] text-govt-muted font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Data from official commissions
          </span>
          <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
            {commissions.map((name) => (
              <span key={name} className="text-xs font-extrabold text-slate-400 hover:text-govt-emerald transition-colors duration-200 cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Main Content ───── */}
      <div className="max-w-7xl mx-auto px-4 space-y-16 py-12">

        {/* Quick Resource Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children" aria-label="Quick navigation">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="card-premium p-5 group flex flex-col items-center text-center"
                id={`quick-link-${link.href.replace('/', '')}`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${link.color} text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-govt-charcoal">{t(link.labelKey)}</h3>
                <p className="text-[11px] text-govt-muted mt-0.5">{link.desc}</p>
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

        {/* ───── CTA Section ───── */}
        <section
          className="relative overflow-hidden bg-gradient-to-r from-govt-emerald-dark via-govt-emerald to-emerald-800 text-white rounded-2xl p-8 md:p-12 shadow-elevated"
          aria-label="Call to action"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-govt-gold/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-extrabold">Start Preparing Today</h2>
              <p className="text-sm text-emerald-100/80 max-w-lg">
                Access thousands of MCQs, download solved past papers, and track your progress with timed practice tests — completely free.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/quizzes"
                className="bg-govt-gold hover:bg-yellow-500 text-govt-emerald-dark font-extrabold px-6 py-3 rounded-xl text-sm transition-all duration-200 shadow-glow-gold flex items-center gap-2 whitespace-nowrap"
                id="cta-start-quiz"
              >
                <Zap className="w-4 h-4" />
                Take a Quiz
              </Link>
              <Link
                href="/materials"
                className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/15 font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200 whitespace-nowrap"
                id="cta-past-papers"
              >
                Past Papers
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
