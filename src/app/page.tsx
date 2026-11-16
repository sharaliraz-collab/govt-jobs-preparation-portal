'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import JobCard from '@/components/JobCard';
import NewsCard from '@/components/NewsCard';
import AdSlot from '@/components/AdSlot';
import { SkeletonCard } from '@/components/Loader';
import { QuickShareButton, SectionShareBar } from '@/components/ShareButtons';
import { APTITUDE_GROUPS, APTITUDE_TOPICS, AptitudeGroupId } from '@/data/aptitudeTopics';
import {
  Search,
  Briefcase,
  BookOpen,
  FileCheck,
  Newspaper,
  FileText,
  Users,
  ChevronRight,
  Star,
  Zap,
  Award,
  Shield,
  Lightbulb,
  Dna,
  Atom,
  Landmark,
  BookMarked,
  FlaskConical,
  Monitor,
  Calculator,
  Globe,
  Clock,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { IJob, INews } from '@/lib/types';

interface HomeSubjectCard {
  id: string;
  name: string;
  badge: string;
  category: 'aptitude' | 'science' | 'humanities';
  href: string;
  icon: any;
  iconStyle: string;
  badgeStyle: string;
  desc: string;
  features: string[];
  subLinks: { label: string; href: string }[];
}

const ADVANCED_MCQ_SUBJECTS: HomeSubjectCard[] = [
  {
    id: 'aptitude',
    name: 'Quantitative Aptitude & Reasoning',
    badge: '3,702 MCQs · 43 Topics',
    category: 'aptitude',
    href: '/quizzes/aptitude',
    icon: Lightbulb,
    iconStyle: 'bg-amber-50 border-amber-200 text-amber-600',
    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
    desc: 'Complete quantitative test bank with 10 questions per page, top page counter, and click-to-reveal LaTeX step-by-step solutions.',
    features: ['10 Qs / Page', 'Step-by-Step Formulas', '43 Chapters'],
    subLinks: [
      { label: 'Average', href: '/quizzes/aptitude/average' },
      { label: 'Percentage', href: '/quizzes/aptitude/percentage' },
      { label: 'Profit & Loss', href: '/quizzes/aptitude/profit-and-loss' },
      { label: 'Time & Work', href: '/quizzes/aptitude/time-and-work' },
      { label: 'Trains', href: '/quizzes/aptitude/problems-on-trains' },
      { label: 'Algebra', href: '/quizzes/aptitude/algebra' },
    ]
  },
  {
    id: 'biology',
    name: 'Biology (Board & MDCAT Prep)',
    badge: '1,000 MCQs · 14 Chapters',
    category: 'science',
    href: '/quizzes/biology',
    icon: Dna,
    iconStyle: 'bg-teal-50 border-teal-200 text-teal-600',
    badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200',
    desc: 'Sindh, Punjab & Federal Board aligned MCQs covering Cell Biology, Enzymes, Bioenergetics, Genetics & Human Physiology.',
    features: ['Chapter Filter', 'Instant Grading', 'English & Sindhi'],
    subLinks: [
      { label: 'Cell Biology', href: '/quizzes/biology' },
      { label: 'Biological Molecules', href: '/quizzes/biology' },
      { label: 'Enzymes', href: '/quizzes/biology' },
      { label: 'Genetics & Biotech', href: '/quizzes/biology' },
      { label: 'Human Physiology', href: '/quizzes/biology' },
    ]
  },
  {
    id: 'physics',
    name: 'Physics (Board & Entry Tests)',
    badge: '941 MCQs · 19 Topics',
    category: 'science',
    href: '/quizzes/physics',
    icon: Zap,
    iconStyle: 'bg-cyan-50 border-cyan-200 text-cyan-600',
    badgeStyle: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    desc: 'Comprehensive Physics bank covering Kinematics, Dynamics, Thermodynamics, Electrostatics, Optics & Nuclear Physics.',
    features: ['19 Topic Filters', 'Detailed Explanations', 'Bilingual'],
    subLinks: [
      { label: 'Kinematics', href: '/quizzes/physics' },
      { label: 'Work & Energy', href: '/quizzes/physics' },
      { label: 'Electrostatics', href: '/quizzes/physics' },
      { label: 'Modern Physics', href: '/quizzes/physics' },
      { label: 'Optics', href: '/quizzes/physics' },
    ]
  },
  {
    id: 'world-info',
    name: 'World GK — Capitals, Currencies & Leaders',
    badge: '420 MCQs · 5 Continents',
    category: 'humanities',
    href: '/quizzes/world-info',
    icon: Globe,
    iconStyle: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    badgeStyle: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    desc: '195 World Capitals, 195 Currencies, and 30 Current World Leaders organized continent-by-continent for FPSC & PPSC.',
    features: ['Continent Tabs', 'Capitals & Currencies', 'World Leaders'],
    subLinks: [
      { label: 'Asia (47)', href: '/quizzes/world-info' },
      { label: 'Europe (45)', href: '/quizzes/world-info' },
      { label: 'Africa (54)', href: '/quizzes/world-info' },
      { label: 'Americas (35)', href: '/quizzes/world-info' },
      { label: 'World Leaders (30)', href: '/quizzes/world-info' },
    ]
  },
  {
    id: 'pak-studies',
    name: 'Pakistan Studies & Affairs',
    badge: '364 MCQs · 15 Sections',
    category: 'humanities',
    href: '/quizzes/pak-studies',
    icon: Landmark,
    iconStyle: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    desc: 'Indus Valley Civilization, Constitutional History, Geography of South Asia, Water Resources & Modern Governance.',
    features: ['15 Structured Sections', '20 Qs / Page', 'En & Sindhi Mode'],
    subLinks: [
      { label: 'Indus Valley', href: '/quizzes/pak-studies' },
      { label: 'Constitution & State', href: '/quizzes/pak-studies' },
      { label: 'Geography', href: '/quizzes/pak-studies' },
      { label: 'Economy & Trade', href: '/quizzes/pak-studies' },
      { label: 'Water & Irrigation', href: '/quizzes/pak-studies' },
    ]
  },
  {
    id: 'islamic-studies',
    name: 'Islamic Studies (Islamiat)',
    badge: '160+ MCQs · 9 Categories',
    category: 'humanities',
    href: '/quizzes/islamic-studies',
    icon: BookMarked,
    iconStyle: 'bg-amber-50 border-amber-200 text-amber-600',
    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
    desc: 'Aqaid, Pillars of Islam, Holy Quran, Hadith & Sunnah, Seerat-un-Nabi (ﷺ), Khulafa-e-Rashideen & Islamic History.',
    features: ['9 Topic Categories', 'Instant Answer Reveal', 'Shuffle Mode'],
    subLinks: [
      { label: 'The Holy Quran', href: '/quizzes/islamic-studies' },
      { label: 'Hadith & Sunnah', href: '/quizzes/islamic-studies' },
      { label: 'Seerat-un-Nabi (ﷺ)', href: '/quizzes/islamic-studies' },
      { label: 'Khulafa-e-Rashideen', href: '/quizzes/islamic-studies' },
      { label: 'Pillars of Islam', href: '/quizzes/islamic-studies' },
    ]
  },
  {
    id: 'english',
    name: 'English Grammar & Composition',
    badge: '100+ MCQs · 4 Active Sections',
    category: 'humanities',
    href: '/quizzes/english-grammar',
    icon: BookOpen,
    iconStyle: 'bg-blue-50 border-blue-200 text-blue-600',
    badgeStyle: 'bg-blue-50 text-blue-800 border-blue-200',
    desc: 'Parts of Speech, Synonyms, Antonyms, Error Detection, Sentence Correction & Reading Comprehension for FPSC/PPSC/STS.',
    features: ['Section-Wise Practice', 'Score Breakdown', 'Grammar Rules'],
    subLinks: [
      { label: 'Parts of Speech', href: '/quizzes/english-grammar' },
      { label: 'Synonyms', href: '/quizzes/english-grammar' },
      { label: 'Antonyms & Errors', href: '/quizzes/english-grammar' },
      { label: 'Reading Comprehension', href: '/quizzes/english-grammar' },
    ]
  },
  {
    id: 'general-science',
    name: 'General Science & Ability',
    badge: 'CSS & FPSC Aligned',
    category: 'science',
    href: '/quizzes/subject/general-science',
    icon: Atom,
    iconStyle: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    desc: 'Everyday Science, Astronomy, Solar System, Human Vitamins & Diseases, Analytical & Logical Reasoning.',
    features: ['Everyday Science', 'Analytical Ability', 'Timed Quizzes'],
    subLinks: [
      { label: 'Everyday Science', href: '/quizzes/subject/general-science' },
      { label: 'Solar System', href: '/quizzes/subject/general-science' },
      { label: 'Environmental Science', href: '/quizzes/subject/general-science' },
    ]
  },
  {
    id: 'computer-science',
    name: 'Computer Science, Chemistry & Math',
    badge: 'STEM Practice Banks',
    category: 'science',
    href: '/quizzes/subject/computer-science',
    icon: Monitor,
    iconStyle: 'bg-purple-50 border-purple-200 text-purple-600',
    badgeStyle: 'bg-purple-50 text-purple-800 border-purple-200',
    desc: 'MS Office shortcuts, Computer Networks, Operating Systems, Organic/Inorganic Chemistry & Core Mathematics.',
    features: ['IT & MS Office', 'Chemistry Bank', 'General Math'],
    subLinks: [
      { label: 'Computer Science', href: '/quizzes/subject/computer-science' },
      { label: 'Chemistry MCQs', href: '/quizzes/subject/chemistry' },
      { label: 'Mathematics MCQs', href: '/quizzes/subject/mathematics' },
    ]
  }
];

const FEATURED_MOCK_EXAMS = [
  {
    title: 'MDCAT Full Mock Exam (SIBA Pattern)',
    badge: '200 MCQs · 180 Mins',
    org: 'Medical Entry Test',
    desc: 'Biology (80), Chemistry (60), Physics (40) & English (20) with 3-hour countdown timer and subject breakdown.',
    href: '/mock-papers/mdcat',
    icon: Award,
    accent: 'border-teal-200 bg-gradient-to-br from-white to-teal-50/50',
    iconStyle: 'bg-teal-50 border-teal-200 text-teal-600'
  },
  {
    title: 'Sindh Police Constable (BPS-07)',
    badge: '100 MCQs · 80 Mins',
    org: 'STS SIBA Pattern',
    desc: 'Reasoning (30%), Maths (20%), GK/IQ (20%), Sindhi (20%) & English (10%) full-length recruitment test.',
    href: '/mock-papers/police-constable',
    icon: Shield,
    accent: 'border-indigo-200 bg-gradient-to-br from-white to-indigo-50/50',
    iconStyle: 'bg-indigo-50 border-indigo-200 text-indigo-600'
  },
  {
    title: 'Ministry of Defence (MOD) Exam',
    badge: '100 MCQs · 90 Mins',
    org: 'Federal Screening',
    desc: 'English, Pakistan Studies, Islamiat, Current Affairs, Everyday Science & Quantitative Math (25 Qs/page).',
    href: '/mock-papers/ministry-of-defence',
    icon: Shield,
    accent: 'border-emerald-200 bg-gradient-to-br from-white to-emerald-50/50',
    iconStyle: 'bg-emerald-50 border-emerald-200 text-emerald-600'
  },
  {
    title: 'SALU Khairpur Entry Test',
    badge: '50 MCQs · 60 Mins',
    org: 'University Admission',
    desc: 'English (10), General Knowledge (10), Islamic Studies (10), Biology (10) & Physics (10) solved model paper.',
    href: '/mock-papers/salu-entry-test',
    icon: GraduationCap,
    accent: 'border-amber-200 bg-gradient-to-br from-white to-amber-50/50',
    iconStyle: 'bg-amber-50 border-amber-200 text-amber-600'
  }
];

export default function Home() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [news, setNews] = useState<INews[]>([]);
  const [search, setSearch] = useState('');
  const [searchMode, setSearchMode] = useState<'mcqs' | 'jobs'>('mcqs');
  const [activeCategory, setActiveCategory] = useState<'all' | 'aptitude' | 'science' | 'humanities'>('all');
  const [activeAptGroup, setActiveAptGroup] = useState<AptitudeGroupId>('arithmetic');
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

  /* Live matching MCQ topics when user types in MCQ search mode */
  const mcqSuggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || searchMode !== 'mcqs') return [];

    const subjectMatches = ADVANCED_MCQ_SUBJECTS
      .filter((s) => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q))
      .map((s) => ({ label: s.name, badge: s.badge, href: s.href }));

    const topicMatches = APTITUDE_TOPICS
      .filter((t) => t.title.toLowerCase().includes(q))
      .slice(0, 6)
      .map((t) => ({ label: `Aptitude: ${t.title}`, badge: `${t.count} MCQs`, href: `/quizzes/aptitude/${t.slug}` }));

    return [...subjectMatches, ...topicMatches].slice(0, 7);
  }, [search, searchMode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) {
      router.push(searchMode === 'mcqs' ? '/quizzes' : '/jobs');
      return;
    }
    if (searchMode === 'mcqs') {
      if (mcqSuggestions.length > 0) {
        router.push(mcqSuggestions[0].href);
      } else {
        router.push(`/quizzes/aptitude`);
      }
    } else {
      router.push(`/jobs?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const filteredSubjects = activeCategory === 'all'
    ? ADVANCED_MCQ_SUBJECTS
    : ADVANCED_MCQ_SUBJECTS.filter((s) => s.category === activeCategory);

  const groupTopics = useMemo(
    () => APTITUDE_TOPICS.filter((t) => t.group === activeAptGroup),
    [activeAptGroup]
  );

  const stats = [
    { label: 'Solved MCQs Bank', value: '7,600+', icon: Zap, iconBg: 'bg-amber-50 border-amber-200/80 text-amber-600' },
    { label: 'Aptitude Chapters', value: '43 Topics', icon: Lightbulb, iconBg: 'bg-emerald-50 border-emerald-200/80 text-emerald-600' },
    { label: 'Timed Mock Papers', value: '11+ Subjects', icon: Award, iconBg: 'bg-blue-50 border-blue-200/80 text-blue-600' },
    { label: 'Active Govt Jobs', value: '500+', icon: Briefcase, iconBg: 'bg-purple-50 border-purple-200/80 text-purple-600' },
  ];

  const commissions = [
    'FPSC', 'PPSC', 'SPSC', 'KPPSC', 'NTS', 'STS SIBA', 'MDCAT', 'CSS / PMS'
  ];

  return (
    <div className="space-y-0 pb-0">
      {/* ───── 1. Hero Section — Advanced MCQs & Career Command Center ───── */}
      <section
        className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/35 to-amber-50/25 text-slate-900 border-b border-slate-200/80"
        aria-label="Hero banner"
      >
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-100/70 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-9 sm:py-14 text-center space-y-5">
          {/* Top Tagline Pill */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200/90 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" strokeWidth={2.25} />
            <span className="text-slate-700">
              Pakistan&apos;s Most Advanced MCQs Preparation &amp; Official Career Portal
            </span>
          </div>

          <h1 className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 px-1 ${isUr ? 'font-urdu leading-relaxed' : ''}`}>
            Master <span className="text-emerald-700">7,600+ Solved MCQs</span> &amp; Track Every Govt Job
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
            Practice topic-wise Quantitative Aptitude (43 chapters with step-by-step formulas), Biology, Physics, English, Pak Studies, Islamic Studies &amp; full-length timed mock exams.
          </p>

          {/* Dual-Mode Search Bar (MCQs & Topics vs Govt Jobs) */}
          <div className="max-w-2xl mx-auto space-y-2 relative">
            <div className="inline-flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSearchMode('mcqs')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                  searchMode === 'mcqs'
                    ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" strokeWidth={2.25} />
                <span>Search MCQs &amp; 43 Topics</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('jobs')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                  searchMode === 'jobs'
                    ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.25} />
                <span>Search Govt Jobs</span>
              </button>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 bg-white rounded-2xl shadow-lg p-2 border border-slate-200/90"
              id="hero-search-form"
            >
              <div className="flex items-center flex-1 bg-slate-50/70 sm:bg-transparent rounded-xl px-3">
                <Search className="w-5 h-5 text-emerald-600 shrink-0" strokeWidth={2.25} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    searchMode === 'mcqs'
                      ? 'Search any MCQ topic (e.g. Average, Trains, Algebra, Biology, Synonyms, Capitals)...'
                      : t('home.searchJobs')
                  }
                  className="w-full px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                  id="hero-search-input"
                  aria-label="Search portal"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-sm whitespace-nowrap"
                id="hero-search-btn"
              >
                {searchMode === 'mcqs' ? 'Find MCQs →' : t('common.search')}
              </button>
            </form>

            {/* Instant Search Dropdown for MCQs */}
            {mcqSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-30 text-left">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Matching MCQ Practice Topics
                </div>
                {mcqSuggestions.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-50 text-xs font-bold text-slate-800 hover:text-emerald-800 transition-colors"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Popular Direct MCQ Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-500 mr-1">Hot Tracks:</span>
            {[
              { label: '💡 Aptitude Test', href: '/quizzes/aptitude' },
              { label: '🧬 Biology', href: '/quizzes/biology' },
              { label: '⚡ Physics', href: '/quizzes/physics' },
              { label: '🌍 World GK', href: '/quizzes/world-info' },
              { label: '🇵🇰 Pak Studies', href: '/quizzes/pak-studies' },
              { label: '📘 English Grammar', href: '/quizzes/english-grammar' },
              { label: '🩺 MDCAT Mock', href: '/mock-papers/mdcat' },
            ].map((pill) => (
              <Link
                key={pill.href}
                href={pill.href}
                className="text-xs font-bold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/90 hover:border-emerald-300 px-3 py-1 rounded-full shadow-2xs transition-all"
              >
                {pill.label}
              </Link>
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-4 pt-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 bg-white border border-slate-200/80 px-4 py-2.5 rounded-2xl shadow-xs">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                  <stat.icon className="w-5 h-5" strokeWidth={2.25} />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">{stat.value}</div>
                  <div className="text-[11px] text-slate-500 font-semibold truncate">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 2. Trust & Exam Boards Bar ───── */}
      <section className="bg-white border-b border-slate-200/80 py-3" aria-label="Trusted commissions">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" strokeWidth={2.25} />
            Syllabus Aligned With Official Exam Boards:
          </span>
          <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center">
            {commissions.map((name) => (
              <span key={name} className="text-xs font-extrabold text-slate-700 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 3. Main Portal Content ───── */}
      <div className="max-w-7xl mx-auto px-4 space-y-14 py-10">

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION A: ADVANCED MCQs PREPARATION COMMAND CENTER
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6" aria-label="Advanced MCQs Preparation Hub">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.25} />
                <span>Interactive Subject &amp; Sub-Topic Explorer</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                Advanced MCQs Preparation Bank
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Choose a subject below or click any sub-section tag to jump directly into topic-wise practice.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'All Subjects (11)' },
                { id: 'aptitude', label: 'Aptitude (43 Topics)' },
                { id: 'science', label: 'Science & STEM' },
                { id: 'humanities', label: 'GK, English & Arts' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                    activeCategory === tab.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Cards Grid with Direct Sub-Section Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSubjects.map((subj) => {
              const Icon = subj.icon;
              return (
                <div
                  key={subj.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group"
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Icon + Count Badge + Share */}
                    <div className="flex items-center justify-between gap-2">
                      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${subj.iconStyle} group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5" strokeWidth={2.25} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${subj.badgeStyle}`}>
                          {subj.badge}
                        </span>
                        <QuickShareButton
                          path={subj.href}
                          title={`${subj.name} — ${subj.badge}`}
                          description={subj.desc}
                          badge={subj.badge}
                        />
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <Link
                        href={subj.href}
                        className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors block"
                      >
                        {subj.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {subj.desc}
                      </p>
                    </div>

                    {/* Direct Sub-Section Chips */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Direct Sub-Sections:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {subj.subLinks.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="text-[11px] font-semibold bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/80 hover:border-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {subj.features.slice(0, 2).map((feat) => (
                        <span key={feat} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {feat}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={subj.href}
                      className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0"
                    >
                      <span>Start Prep</span>
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.25} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION B: QUANTITATIVE APTITUDE 43-TOPIC INTERACTIVE EXPLORER
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="bg-gradient-to-br from-white via-amber-50/35 to-emerald-50/30 border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-xs space-y-5"
          aria-label="Quantitative Aptitude 43 Topics Explorer"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-amber-800 bg-amber-100/80 border border-amber-200 px-3 py-0.5 rounded-full">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" strokeWidth={2.25} />
                <span>3,702 Solved Quantitative MCQs · 10 Per Page · Click-to-View Solutions</span>
              </div>
              <h2 className="text-lg md:text-2xl font-black text-slate-900">
                Aptitude Test — Browse All 43 Chapters by Category
              </h2>
            </div>

            <Link
              href="/quizzes/aptitude"
              className="self-start lg:self-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <span>Open Full Aptitude Hub (43 Topics)</span>
              <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
            </Link>
          </div>

          {/* 5 Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {APTITUDE_GROUPS.map((grp) => {
              const active = activeAptGroup === grp.id;
              const count = APTITUDE_TOPICS.filter((t) => t.group === grp.id).length;
              return (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => setActiveAptGroup(grp.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 border flex items-center gap-2 ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{grp.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Topics Grid for Active Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {groupTopics.map((topic) => (
              <div
                key={topic.slug}
                className="bg-white hover:bg-emerald-50/70 border border-slate-200/90 hover:border-emerald-300 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 transition-all group shadow-2xs"
              >
                <Link
                  href={`/quizzes/aptitude/${topic.slug}`}
                  className="flex items-center gap-2.5 min-w-0 flex-1"
                >
                  <span className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-extrabold flex items-center justify-center shrink-0">
                    {topic.id}
                  </span>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 truncate">
                    {topic.title}
                  </span>
                </Link>
                <div className="flex items-center gap-1.5 shrink-0">
                  <QuickShareButton
                    path={`/quizzes/aptitude/${topic.slug}`}
                    title={`${topic.title} — Aptitude MCQs (${topic.count} Questions)`}
                    description={`Practice ${topic.count} ${topic.title} aptitude MCQs with step-by-step solutions on GovtJobs.pk.`}
                    badge="Aptitude"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION C: FULL-LENGTH TIMED MOCK EXAMS
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-5" aria-label="Full-length timed mock exams">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                Full-Length Timed Mock Exams
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate real exam conditions with countdown timers, instant grading, and complete answer keys
              </p>
            </div>
            <Link
              href="/mock-tests"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
            >
              <span>All Mock Papers</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_MOCK_EXAMS.map((exam) => {
              const Icon = exam.icon;
              return (
                <div
                  key={exam.href}
                  className={`rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${exam.accent}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${exam.iconStyle}`}>
                        <Icon className="w-5 h-5" strokeWidth={2.25} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                          {exam.org}
                        </span>
                        <QuickShareButton
                          path={exam.href}
                          title={`${exam.title} — ${exam.badge}`}
                          description={exam.desc}
                          badge={exam.org}
                        />
                      </div>
                    </div>

                    <Link href={exam.href} className="block">
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {exam.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {exam.desc}
                      </p>
                    </Link>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.25} />
                      {exam.badge}
                    </span>
                    <Link
                      href={exam.href}
                      className="text-xs font-extrabold text-emerald-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
                    >
                      Start <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <SectionShareBar
            path="/"
            title="GovtJobs.pk — 7,600+ Solved MCQs, 43 Aptitude Topics & Official Govt Jobs"
            description="Practice free topic-wise MCQs for FPSC, PPSC, SPSC, STS, MDCAT & NTS with step-by-step solutions and official job alerts."
            badge="Official Portal Preview"
          />
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION D: FEATURED GOVERNMENT JOBS
        ═══════════════════════════════════════════════════════════════════ */}
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
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
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

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION E: LATEST ANNOUNCEMENTS & NOTIFICATIONS
        ═══════════════════════════════════════════════════════════════════ */}
        <section aria-label="Latest news" className="section-alt -mx-4 px-4 py-12 rounded-2xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between border-b border-govt-border pb-4 mb-6">
              <div>
                <h2 className={`text-xl md:text-2xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                  {t('home.latestNews')}
                </h2>
                <p className="text-xs text-govt-muted mt-0.5">Exam schedules, syllabus updates, &amp; policy news</p>
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
                {[1, 2].map((i) => <SkeletonCard key={i} />)}
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

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION F: CTA BANNER
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/70 to-amber-50/50 text-slate-900 border border-emerald-200/80 rounded-2xl p-8 md:p-12 shadow-sm"
          aria-label="Call to action"
        >
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2.5 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">Ready to Ace Your Next Exam?</h2>
              <p className="text-sm text-slate-600 max-w-lg leading-relaxed">
                Practice 7,600+ solved MCQs across 11 subjects and 43 quantitative aptitude topics — with step-by-step solutions and zero fees.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/quizzes/aptitude"
                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-all duration-200 shadow-xs flex items-center gap-2 whitespace-nowrap"
              >
                <Lightbulb className="w-4 h-4" strokeWidth={2.25} />
                Aptitude Test (3,702 MCQs)
              </Link>
              <Link
                href="/quizzes"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-all duration-200 shadow-xs flex items-center gap-2 whitespace-nowrap"
                id="cta-start-quiz"
              >
                <Zap className="w-4 h-4" strokeWidth={2.25} />
                All 11 MCQ Subjects
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
