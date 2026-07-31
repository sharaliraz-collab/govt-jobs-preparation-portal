'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Loader from '@/components/Loader';
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
  CheckCircle2
} from 'lucide-react';
import { IQuiz } from '@/lib/types';

interface SubjectCard {
  id: string;
  name: string;
  alias: string;
  icon: any;
  gradient: string;
  badgeBg: string;
  description: string;
}

const PREP_SUBJECTS: SubjectCard[] = [
  {
    id: 'english',
    name: 'English Grammar & Composition',
    alias: 'English',
    icon: BookOpen,
    gradient: 'from-blue-600 to-indigo-700',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    description: 'Synonyms, Antonyms, Prepositions, Sentence Correction, Analogy & Grammar Rules.'
  },
  {
    id: 'general-science',
    name: 'General Science & Ability',
    alias: 'Science',
    icon: Atom,
    gradient: 'from-emerald-600 to-teal-700',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Everyday Science, Analytical Reasoning, Logical Ability, Astronomy & Environmental Science.'
  },
  {
    id: 'pak-studies',
    name: 'Pakistan Studies',
    alias: 'Pakistan',
    icon: Landmark,
    gradient: 'from-green-700 to-emerald-800',
    badgeBg: 'bg-green-50 text-green-800 border-green-200',
    description: 'Pre-Partition History, 1947 Movement, Constitution, Geography & Pakistan Current Affairs.'
  },
  {
    id: 'islamic-studies',
    name: 'Islamic Studies',
    alias: 'Islamic',
    icon: BookMarked,
    gradient: 'from-amber-600 to-yellow-700',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Quranic Verses, Sunnah, Seerah, Islamic Battles (Ghazwaat) & Fundamental Pillars.'
  },
  {
    id: 'physics',
    name: 'Physics',
    alias: 'Physics',
    icon: Zap,
    gradient: 'from-cyan-600 to-blue-700',
    badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    description: 'Mechanics, Electricity, Magnetism, Optics, Quantum & Modern Applied Physics.'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    alias: 'Chemistry',
    icon: FlaskConical,
    gradient: 'from-rose-600 to-red-700',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    description: 'Organic Chemistry, Inorganic Compounds, Periodic Table & Chemical Reactions.'
  },
  {
    id: 'biology',
    name: 'Biology',
    alias: 'Biology',
    icon: Dna,
    gradient: 'from-teal-600 to-emerald-700',
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
    description: 'Human Physiology, Cell Biology, Genetics, Zoology, Botany & Microbiology.'
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    alias: 'Computer',
    icon: Monitor,
    gradient: 'from-purple-600 to-violet-700',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    description: 'MS Office, Computer Networks, Cybersecurity, Database Management & Software fundamentals.'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    alias: 'Math',
    icon: Calculator,
    gradient: 'from-orange-600 to-amber-700',
    badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
    description: 'Algebra, Basic Arithmetic, Geometry, Ratios, Percentages & Problem Solving.'
  }
];

export default function QuizzesPage() {
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
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

  const handleSubjectClick = (alias: string) => {
    if (selectedSubject.toLowerCase() === alias.toLowerCase()) {
      setSelectedSubject('');
    } else {
      setSelectedSubject(alias);
      // Smooth scroll to quizzes section
      const element = document.getElementById('quizzes-list-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    return (
      quiz.titleEn?.toLowerCase().includes(term) ||
      quiz.titleUr?.toLowerCase().includes(term) ||
      quiz.subject?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-govt-emerald-dark via-govt-emerald to-emerald-900 text-white rounded-2xl p-6 md:p-10 shadow-elevated relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-govt-gold border border-white/15">
            <CheckCircle2 className="w-4 h-4 text-govt-gold" />
            <span>FPSC, PPSC, SPSC, NTS & CSS Exam Prep</span>
          </div>

          <h1 className={`text-2xl md:text-4xl font-extrabold tracking-tight ${isUr ? 'font-urdu' : ''}`}>
            {t('quizzes.title')}
          </h1>

          <p className="text-xs md:text-base text-emerald-100/90 leading-relaxed">
            {t('quizzes.subtitle')}
          </p>
        </div>
      </div>

      {/* Subject Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-govt-charcoal flex items-center gap-2">
              <span>📚 Browse MCQs by Subject</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Click any subject card to filter matching past paper practice tests</p>
          </div>

          {selectedSubject && (
            <button
              onClick={() => setSelectedSubject('')}
              className="text-xs font-bold text-govt-emerald hover:underline flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
            >
              <span>Showing: {selectedSubject}</span>
              <span className="text-red-500 font-bold ml-1">× Reset</span>
            </button>
          )}
        </div>

        {/* 9 Subject Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PREP_SUBJECTS.map((subj) => {
            const Icon = subj.icon;
            const isSelected = selectedSubject.toLowerCase() === subj.alias.toLowerCase();

            return (
              <div
                key={subj.id}
                onClick={() => handleSubjectClick(subj.alias)}
                className={`cursor-pointer rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between group relative overflow-hidden ${
                  isSelected
                    ? 'border-govt-emerald ring-2 ring-govt-emerald/30 shadow-lg bg-emerald-50/40'
                    : 'border-slate-200 bg-white hover:border-govt-emerald/50 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${subj.gradient} text-white shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${subj.badgeBg}`}>
                      {subj.alias}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-govt-emerald transition-colors duration-200">
                    {subj.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {subj.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-govt-emerald group-hover:translate-x-0.5 transition-transform">
                  <span>{isSelected ? '✓ Subject Filter Active' : 'Attempt MCQs'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quizzes List Section */}
      <div className="space-y-6 pt-4 border-t border-slate-200" id="quizzes-list-section">
        {/* Search & Filter Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search quizzes by title or keyword..."
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
              <option value="">All 9 Subjects</option>
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
          <div className="bg-white p-12 rounded-2xl text-center border border-slate-200 shadow-xs space-y-3">
            <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Quizzes Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No active quiz tests match your current subject or search filter. Try clearing filters or select another subject card above.
            </p>
            {selectedSubject && (
              <button
                onClick={() => setSelectedSubject('')}
                className="inline-block text-xs bg-govt-emerald text-white font-bold px-4 py-2 rounded-lg shadow"
              >
                Show All Subject Quizzes
              </button>
            )}
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
                      <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-govt-emerald" />
                        {qCount} {t('quizzes.questionsCount')}
                      </span>
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
