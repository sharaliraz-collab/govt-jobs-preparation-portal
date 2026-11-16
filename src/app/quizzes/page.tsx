'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Loader from '@/components/Loader';
import InterestingRandomQuiz from '@/components/InterestingRandomQuiz';
import { QuickShareButton, SectionShareBar } from '@/components/ShareButtons';
import {
  FileCheck,
  Clock,
  Award,
  PlayCircle,
  HelpCircle,
  BookOpen,
  Atom,
  Landmark,
  BookMarked,
  Zap,
  FlaskConical,
  Dna,
  Monitor,
  Calculator,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  Globe,
  Lightbulb,
  Shield,
  GraduationCap,
  Sparkles,
  Layers
} from 'lucide-react';
import { IQuiz } from '@/lib/types';

interface SubjectCard {
  id: string;
  name: string;
  alias: string;
  category: 'aptitude' | 'science' | 'humanities';
  countBadge: string;
  icon: any;
  badgeBg: string;
  description: string;
  subLinks: { label: string; href: string }[];
  footerLabel: string;
}

const PREP_SUBJECTS: SubjectCard[] = [
  {
    id: 'aptitude',
    name: 'Aptitude Test — Quantitative Reasoning',
    alias: 'Aptitude',
    category: 'aptitude',
    countBadge: '3,702 MCQs · 43 Topics',
    icon: Lightbulb,
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    description: '3,702 MCQs in 43 topics — Average, Percentage, Ratio, Time & Work, Trains, Algebra, Geometry & more with step-by-step solutions.',
    subLinks: [
      { label: 'Average', href: '/quizzes/aptitude/average' },
      { label: 'Percentage', href: '/quizzes/aptitude/percentage' },
      { label: 'Profit & Loss', href: '/quizzes/aptitude/profit-and-loss' },
      { label: 'Time & Work', href: '/quizzes/aptitude/time-and-work' },
      { label: 'Trains', href: '/quizzes/aptitude/problems-on-trains' },
      { label: 'Algebra', href: '/quizzes/aptitude/algebra' },
    ],
    footerLabel: '3,702 MCQs — 43 Topics (10 per page)'
  },
  {
    id: 'biology',
    name: 'Biology (Board & MDCAT)',
    alias: 'Biology',
    category: 'science',
    countBadge: '1,547 MCQs · 14 Chapters',
    icon: Dna,
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
    description: 'Human Physiology, Cell Biology, Biological Molecules, Enzymes, Genetics, Zoology, Botany & Ecology.',
    subLinks: [
      { label: 'Cell Biology', href: '/quizzes/biology' },
      { label: 'Enzymes', href: '/quizzes/biology' },
      { label: 'Bioenergetics', href: '/quizzes/biology' },
      { label: 'Genetics', href: '/quizzes/biology' },
    ],
    footerLabel: '1,547 MCQs — Sindh, Punjab & Federal Boards'
  },
  {
    id: 'physics',
    name: 'Physics (Board & Entry Tests)',
    alias: 'Physics',
    category: 'science',
    countBadge: '941 MCQs · 19 Topics',
    icon: Zap,
    badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    description: 'Mechanics, Kinematics, Dynamics, Electricity, Magnetism, Optics, Quantum & Nuclear Physics.',
    subLinks: [
      { label: 'Kinematics', href: '/quizzes/physics' },
      { label: 'Electrostatics', href: '/quizzes/physics' },
      { label: 'Optics', href: '/quizzes/physics' },
      { label: 'Modern Physics', href: '/quizzes/physics' },
    ],
    footerLabel: '941 MCQs — Sindh, Punjab & Federal Boards'
  },
  {
    id: 'world-info',
    name: 'World Info — Capitals, Currencies & Leaders',
    alias: 'World',
    category: 'humanities',
    countBadge: '420 MCQs · 5 Continents',
    icon: Globe,
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    description: '195 World Capitals · 195 World Currencies · 30 Current World Leaders — All organised by continent.',
    subLinks: [
      { label: 'World Capitals (195)', href: '/quizzes/world-info' },
      { label: 'Currencies (195)', href: '/quizzes/world-info' },
      { label: 'World Leaders (30)', href: '/quizzes/world-info' },
    ],
    footerLabel: '420 MCQs — Capitals, Currencies & Leaders'
  },
  {
    id: 'pak-studies',
    name: 'Pakistan Studies & Affairs',
    alias: 'Pakistan',
    category: 'humanities',
    countBadge: '364 MCQs · 15 Sections',
    icon: Landmark,
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Indus Valley Civilization, 1947 Movement, Constitution, Geography, Economy, Water Resources & Governance.',
    subLinks: [
      { label: 'Indus Valley', href: '/quizzes/pak-studies' },
      { label: 'Constitution', href: '/quizzes/pak-studies' },
      { label: 'Geography', href: '/quizzes/pak-studies' },
      { label: 'Economy', href: '/quizzes/pak-studies' },
    ],
    footerLabel: '364 MCQs — 15 Sections (20 per page)'
  },
  {
    id: 'islamic-studies',
    name: 'Islamic Studies (Islamiat)',
    alias: 'Islamic',
    category: 'humanities',
    countBadge: '1,711 MCQs · 9 Categories',
    icon: BookMarked,
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    description: '1,711 solved MCQs covering Quranic Verses, Hadith & Sunnah, Seerat-un-Nabi (ﷺ), Khulafa-e-Rashideen, Islamic History & Fiqh.',
    subLinks: [
      { label: 'Holy Quran', href: '/quizzes/islamic-studies' },
      { label: 'Hadith & Sunnah', href: '/quizzes/islamic-studies' },
      { label: 'Seerah (ﷺ)', href: '/quizzes/islamic-studies' },
      { label: 'Khulafa', href: '/quizzes/islamic-studies' },
    ],
    footerLabel: '1,711 MCQs — 9 Categories (PPSC & FPSC)'
  },
  {
    id: 'english',
    name: 'English Grammar & Composition',
    alias: 'English',
    category: 'humanities',
    countBadge: '100+ MCQs · 4 Sections',
    icon: BookOpen,
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    description: 'Parts of Speech, Synonyms, Antonyms, Error Detection, Prepositions, Sentence Correction & Comprehension.',
    subLinks: [
      { label: 'Parts of Speech', href: '/quizzes/english-grammar' },
      { label: 'Synonyms', href: '/quizzes/english-grammar' },
      { label: 'Antonyms', href: '/quizzes/english-grammar' },
      { label: 'Comprehension', href: '/quizzes/english-grammar' },
    ],
    footerLabel: 'Practice MCQs — 4 Sections Available'
  },
  {
    id: 'general-science',
    name: 'General Science & Ability',
    alias: 'Science',
    category: 'science',
    countBadge: '2,130+ Verified MCQs',
    icon: Atom,
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Everyday Science, Analytical Reasoning, Logical Ability, Astronomy & Environmental Science.',
    subLinks: [
      { label: 'Everyday Science', href: '/quizzes/subject/general-science' },
      { label: 'Astronomy', href: '/quizzes/subject/general-science' },
      { label: 'Environment', href: '/quizzes/subject/general-science' },
    ],
    footerLabel: 'Open General Science Practice'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    alias: 'Chemistry',
    category: 'science',
    countBadge: '1,518 MCQs',
    icon: FlaskConical,
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    description: '1,518 solved questions covering Organic Chemistry, Inorganic Compounds, Periodic Table, Electrochemistry & Chemical Reactions.',
    subLinks: [
      { label: 'Organic', href: '/quizzes/subject/chemistry' },
      { label: 'Inorganic', href: '/quizzes/subject/chemistry' },
      { label: 'Periodic Table', href: '/quizzes/subject/chemistry' },
    ],
    footerLabel: 'Open Chemistry Practice'
  },
  {
    id: 'computer-science',
    name: 'Computer Science & IT',
    alias: 'Computer',
    category: 'science',
    countBadge: 'Subject Bank',
    icon: Monitor,
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    description: 'MS Office Shortcuts, Computer Networks, Cybersecurity, Operating Systems & Database Management.',
    subLinks: [
      { label: 'MS Office', href: '/quizzes/subject/computer-science' },
      { label: 'Networking', href: '/quizzes/subject/computer-science' },
      { label: 'DBMS & OS', href: '/quizzes/subject/computer-science' },
    ],
    footerLabel: 'Open Computer Science Practice'
  },
  {
    id: 'mathematics',
    name: 'General Mathematics',
    alias: 'Math',
    category: 'aptitude',
    countBadge: 'Subject Bank',
    icon: Calculator,
    badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
    description: 'Algebra, Basic Arithmetic, Geometry, Ratios, Percentages & Problem Solving.',
    subLinks: [
      { label: 'Arithmetic', href: '/quizzes/subject/mathematics' },
      { label: 'Algebra', href: '/quizzes/subject/mathematics' },
      { label: 'Geometry', href: '/quizzes/subject/mathematics' },
    ],
    footerLabel: 'Open Mathematics Practice'
  }
];

export default function QuizzesPage() {
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'aptitude' | 'science' | 'humanities'>('all');
  const [subjectSearch, setSubjectSearch] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchQuizzes();
  }, [selectedSubject]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const url = selectedSubject ? `/api/quizzes?subject=${encodeURIComponent(selectedSubject)}` : '/api/quizzes';
      const res = await axios.get(url);
      setQuizzes(res.data);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const visibleSubjects = PREP_SUBJECTS.filter((subj) => {
    const matchesTab = activeTab === 'all' || subj.category === activeTab;
    const term = subjectSearch.trim().toLowerCase();
    const matchesSearch =
      !term ||
      subj.name.toLowerCase().includes(term) ||
      subj.description.toLowerCase().includes(term) ||
      subj.subLinks.some((s) => s.label.toLowerCase().includes(term));
    return matchesTab && matchesSearch;
  });

  const filteredQuizzes = quizzes.filter((quiz) => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    return (
      quiz.titleEn?.toLowerCase().includes(term) ||
      quiz.titleUr?.toLowerCase().includes(term) ||
      quiz.subject?.toLowerCase().includes(term)
    );
  });

  const getSubjectHref = (id: string) => {
    if (id === 'aptitude') return '/quizzes/aptitude';
    if (id === 'english') return '/quizzes/english-grammar';
    if (id === 'world-info') return '/quizzes/world-info';
    if (id === 'pak-studies') return '/quizzes/pak-studies';
    if (id === 'physics') return '/quizzes/physics';
    if (id === 'biology') return '/quizzes/biology';
    if (id === 'islamic-studies' || id === 'islamic') return '/quizzes/islamic-studies';
    return `/quizzes/subject/${id}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header Banner — Soft White & Pastel */}
      <div className="bg-gradient-to-br from-white via-emerald-50/50 to-amber-50/40 text-slate-900 border border-slate-200/90 rounded-3xl p-6 md:p-10 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-50 px-3.5 py-1 rounded-full text-xs font-extrabold text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={2.25} />
              <span>12,700+ Solved MCQs · FPSC, PPSC, SPSC, STS &amp; MDCAT Prep</span>
            </div>

            <h1 className={`text-2xl md:text-4xl font-black tracking-tight text-slate-900 ${isUr ? 'font-urdu' : ''}`}>
              {t('quizzes.title')}
            </h1>

            <p className="text-xs md:text-base text-slate-600 leading-relaxed">
              Choose from 11 core subjects, 43 quantitative aptitude chapters, and full-length timed mock exams with instant grading and step-by-step explanations.
            </p>
          </div>

          {/* Quick Stats Box */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-white/90 border border-slate-200/90 rounded-2xl p-3.5 text-center shadow-2xs">
              <div className="text-xl font-black text-emerald-700">12,700+</div>
              <div className="text-[11px] font-bold text-slate-500">Solved MCQs</div>
            </div>
            <div className="bg-white/90 border border-slate-200/90 rounded-2xl p-3.5 text-center shadow-2xs">
              <div className="text-xl font-black text-amber-600">43 Topics</div>
              <div className="text-[11px] font-bold text-slate-500">Aptitude Bank</div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Link Preview & Share Bar */}
      <SectionShareBar
        path="/quizzes"
        title="Free MCQ Practice Tests — 11 Subjects & 43 Aptitude Topics (12,700+ Solved MCQs)"
        description="Practice topic-wise MCQs for FPSC, PPSC, SPSC, STS, MDCAT & CSS with step-by-step solutions and instant grading."
        badge="MCQs Prep Hub"
      />

      {/* Interactive Daily Challenge & Random Test Generator */}
      <InterestingRandomQuiz variant="compact" />

      {/* Subject Filter & Instant Search Bar */}
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'All 11 Subjects' },
              { id: 'aptitude', label: 'Aptitude & Math' },
              { id: 'science', label: 'Science & STEM' },
              { id: 'humanities', label: 'GK, English & Arts' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Subject or Sub-Topic */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" strokeWidth={2.25} />
            <input
              type="text"
              placeholder="Filter subjects or sub-topics..."
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* 11 Subject Grid Cards with Sub-Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleSubjects.map((subj) => {
            const Icon = subj.icon;
            const href = getSubjectHref(subj.id);

            return (
              <div
                key={subj.id}
                className="rounded-2xl border border-slate-200 bg-white hover:border-emerald-400 hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`p-3 rounded-xl border ${subj.badgeBg} shadow-xs group-hover:scale-105 transition-transform duration-200`}>
                      <Icon className="w-6 h-6" strokeWidth={2.25} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${subj.badgeBg}`}>
                        {subj.countBadge}
                      </span>
                      <QuickShareButton
                        path={href}
                        title={`${subj.name} — ${subj.countBadge}`}
                        description={subj.description}
                        badge={subj.alias}
                      />
                    </div>
                  </div>

                  <div>
                    <Link
                      href={href}
                      className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors duration-200 block"
                    >
                      {subj.name}
                    </Link>

                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {subj.description}
                    </p>
                  </div>

                  {/* Direct Sub-Section Pills */}
                  <div className="pt-1 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Sub-Sections:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {subj.subLinks.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="text-[11px] font-semibold bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/80 hover:border-emerald-200 px-2.5 py-0.5 rounded-lg transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href={href}
                  className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-emerald-700 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>{subj.footerLabel}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timed Custom Quizzes List Section */}
      <div className="space-y-6 pt-4 border-t border-slate-200" id="quizzes-list-section">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search custom timed quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-govt-emerald"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full sm:w-auto text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:border-govt-emerald font-medium"
            >
              <option value="">All 11 Subjects</option>
              {PREP_SUBJECTS.map((sub) => (
                <option key={sub.id} value={sub.alias}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quizzes Display Grid */}
        {loading ? (
          <Loader />
        ) : filteredQuizzes.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center border border-slate-200 shadow-xs space-y-3">
            <FileCheck className="w-10 h-10 text-emerald-600 mx-auto" strokeWidth={2.25} />
            <h3 className="text-base font-extrabold text-slate-800">Select Any Subject Card Above to Begin</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All 7,600+ topic-wise MCQs are organized inside the 11 interactive subject cards above. Click any subject or sub-section tag to start practicing immediately.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => {
              const title = isUr && quiz.titleUr ? quiz.titleUr : quiz.titleEn;
              const qCount = quiz.questions?.length || 0;

              return (
                <div
                  key={quiz._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        {quiz.subject}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-govt-emerald" />
                          {qCount} {t('quizzes.questionsCount')}
                        </span>
                        <QuickShareButton
                          path={`/quizzes/${quiz._id}`}
                          title={`${title} — ${quiz.subject} Practice Quiz`}
                          description={`Attempt ${qCount} questions in ${quiz.timeLimitMinutes} minutes on GovtJobs.pk.`}
                          badge={quiz.subject}
                        />
                      </div>
                    </div>

                    <h3 className={`text-base font-bold text-slate-900 group-hover:text-govt-emerald transition-colors ${isUr ? 'font-urdu' : ''}`}>
                      {title}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {t('quizzes.timeLimit')}:
                      </span>
                      <span className="font-bold text-slate-900">{quiz.timeLimitMinutes} {t('quizzes.minutes')}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Award className="w-3.5 h-3.5 text-slate-400" />
                        {t('quizzes.passPercentage')}:
                      </span>
                      <span className="font-bold text-govt-emerald">{quiz.passPercentage}%</span>
                    </div>

                    <Link
                      href={`/quizzes/${quiz._id}`}
                      className="w-full bg-govt-emerald hover:bg-govt-emerald-dark text-white font-bold text-xs py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 shadow-xs hover:shadow"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{t('quizzes.startQuiz')}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
