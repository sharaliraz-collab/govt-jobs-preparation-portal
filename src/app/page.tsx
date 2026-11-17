'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AdSlot from '@/components/AdSlot';
import { APTITUDE_GROUPS, APTITUDE_TOPICS, AptitudeGroupId } from '@/data/aptitudeTopics';
import { IJob, INews } from '@/lib/types';

/* ────────────────────────────────────────────────────────────────────────────
   Content
   ──────────────────────────────────────────────────────────────────────────── */

interface SubjectBank {
  id: string;
  name: string;
  group: 'Aptitude' | 'Science' | 'Humanities' | 'Language';
  count: string;
  href: string;
  desc: string;
  topics: string[];
}

const SUBJECT_BANKS: SubjectBank[] = [
  {
    id: 'aptitude',
    name: 'Quantitative Aptitude',
    group: 'Aptitude',
    count: '3,702 questions',
    href: '/quizzes/aptitude',
    desc: '43 chapters with worked, step-by-step solutions for every question.',
    topics: ['Average', 'Percentage', 'Profit & Loss', 'Time & Work', 'Trains', 'Algebra'],
  },
  {
    id: 'general-science',
    name: 'General Science',
    group: 'Science',
    count: '2,130 questions',
    href: '/quizzes/subject/general-science',
    desc: 'Everyday science for FPSC, PPSC and CSS screening tests.',
    topics: ['Human body', 'Space', 'Inventions', 'Environment'],
  },
  {
    id: 'islamic-studies',
    name: 'Islamic Studies',
    group: 'Humanities',
    count: '1,711 questions',
    href: '/quizzes/islamic-studies',
    desc: 'Quran, Hadith, Seerah, Khulafa-e-Rashideen and Islamic history.',
    topics: ['Holy Quran', 'Hadith', 'Seerah', 'Pillars of Islam'],
  },
  {
    id: 'biology',
    name: 'Biology',
    group: 'Science',
    count: '1,547 questions',
    href: '/quizzes/biology',
    desc: 'Board and MDCAT aligned, organised chapter by chapter.',
    topics: ['Cell biology', 'Enzymes', 'Genetics', 'Physiology'],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    group: 'Science',
    count: '1,518 questions',
    href: '/quizzes/subject/chemistry',
    desc: 'Physical, organic and inorganic chemistry for entry tests.',
    topics: ['Atomic structure', 'Periodic table', 'Organic', 'Reactions'],
  },
  {
    id: 'physics',
    name: 'Physics',
    group: 'Science',
    count: '941 questions',
    href: '/quizzes/physics',
    desc: 'Mechanics to modern physics, filterable across 19 topics.',
    topics: ['Kinematics', 'Electrostatics', 'Optics', 'Modern physics'],
  },
  {
    id: 'world-info',
    name: 'World General Knowledge',
    group: 'Humanities',
    count: '420 questions',
    href: '/quizzes/world-info',
    desc: 'Capitals, currencies and current world leaders by continent.',
    topics: ['Asia', 'Europe', 'Africa', 'Americas', 'Leaders'],
  },
  {
    id: 'english',
    name: 'English Grammar & Composition',
    group: 'Language',
    count: '400 questions',
    href: '/quizzes/english-grammar',
    desc: 'Grammar, vocabulary and comprehension in four sections.',
    topics: ['Parts of speech', 'Synonyms', 'Antonyms', 'Comprehension'],
  },
  {
    id: 'pak-studies',
    name: 'Pakistan Studies',
    group: 'Humanities',
    count: '364 questions',
    href: '/quizzes/pak-studies',
    desc: 'History, constitution, geography and economy of Pakistan.',
    topics: ['Indus Valley', 'Constitution', 'Geography', 'Economy'],
  },
];

const MOCK_EXAMS = [
  {
    org: 'Medical entry test',
    title: 'MDCAT Full Mock (SIBA pattern)',
    meta: '200 MCQs · 180 min',
    desc: 'Biology, Chemistry, Physics and English with a full-length countdown and subject breakdown.',
    href: '/mock-papers/mdcat',
  },
  {
    org: 'STS SIBA pattern',
    title: 'Sindh Police Constable (BPS-07)',
    meta: '100 MCQs · 80 min',
    desc: 'Reasoning, mathematics, GK, Sindhi and English, weighted as in the real paper.',
    href: '/mock-papers/police-constable',
  },
  {
    org: 'Federal screening',
    title: 'Ministry of Defence Exam',
    meta: '100 MCQs · 90 min',
    desc: 'English, Pakistan Studies, Islamiat, current affairs, everyday science and maths.',
    href: '/mock-papers/ministry-of-defence',
  },
  {
    org: 'University admission',
    title: 'SALU Khairpur Entry Test',
    meta: '50 MCQs · 60 min',
    desc: 'A solved model paper across English, GK, Islamic Studies, Biology and Physics.',
    href: '/mock-papers/salu-entry-test',
  },
];

const POPULAR_LINKS = [
  { label: 'Aptitude', href: '/quizzes/aptitude' },
  { label: 'General Science', href: '/quizzes/subject/general-science' },
  { label: 'Biology', href: '/quizzes/biology' },
  { label: 'Islamic Studies', href: '/quizzes/islamic-studies' },
  { label: 'English', href: '/quizzes/english-grammar' },
  { label: 'MDCAT mock', href: '/mock-papers/mdcat' },
];

const COMMISSIONS = ['FPSC', 'PPSC', 'SPSC', 'KPPSC', 'NTS', 'STS SIBA', 'MDCAT', 'CSS / PMS'];

const STATS = [
  { value: '12,700+', label: 'Solved MCQs' },
  { value: '43', label: 'Aptitude chapters' },
  { value: '4', label: 'Timed mock exams' },
  { value: '500+', label: 'Job listings' },
];

/* ────────────────────────────────────────────────────────────────────────────
   Small presentational helpers
   ──────────────────────────────────────────────────────────────────────────── */

const CONTAINER = 'max-w-6xl mx-auto px-4 sm:px-6';

function Eyebrow({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'inverse' }) {
  return (
    <p
      className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
        tone === 'inverse' ? 'text-emerald-300' : 'text-emerald-700'
      }`}
    >
      {children}
    </p>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  titleClassName = '',
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  href?: string;
  linkLabel?: string;
  titleClassName?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div className="max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className={`mt-2 text-2xl sm:text-[1.7rem] font-semibold tracking-tight text-slate-900 ${titleClassName}`}>
          {title}
        </h2>
        {description && <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 transition-colors"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

function stripHtml(input: string): string {
  return String(input || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/* ────────────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────────────── */

export default function Home() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [news, setNews] = useState<INews[]>([]);
  const [search, setSearch] = useState('');
  const [searchMode, setSearchMode] = useState<'mcqs' | 'jobs'>('mcqs');
  const [activeAptGroup, setActiveAptGroup] = useState<AptitudeGroupId>('arithmetic');
  const [loading, setLoading] = useState(true);
  const isUr = i18n.language === 'ur';
  const dateLocale = isUr ? 'ur-PK' : 'en-GB';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, newsRes] = await Promise.all([
          axios.get('/api/jobs?limit=6'),
          axios.get('/api/news?limit=4'),
        ]);
        setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
        setNews(Array.isArray(newsRes.data) ? newsRes.data : []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mcqSuggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || searchMode !== 'mcqs') return [];

    const subjectMatches = SUBJECT_BANKS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.topics.some((tp) => tp.toLowerCase().includes(q))
    ).map((s) => ({ label: s.name, meta: s.count, href: s.href }));

    const topicMatches = APTITUDE_TOPICS.filter((tp) => tp.title.toLowerCase().includes(q))
      .slice(0, 6)
      .map((tp) => ({ label: `Aptitude — ${tp.title}`, meta: `${tp.count} questions`, href: `/quizzes/aptitude/${tp.slug}` }));

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
      router.push(mcqSuggestions.length > 0 ? mcqSuggestions[0].href : '/quizzes');
    } else {
      router.push(`/jobs?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const groupTopics = useMemo(
    () => APTITUDE_TOPICS.filter((tp) => tp.group === activeAptGroup),
    [activeAptGroup]
  );
  const activeGroupMeta = APTITUDE_GROUPS.find((g) => g.id === activeAptGroup);

  const formatDate = (value?: string) =>
    value
      ? new Date(value).toLocaleDateString(dateLocale, { day: 'numeric', month: 'short', year: 'numeric' })
      : '';

  return (
    <div className="bg-white text-slate-900">
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="border-b border-slate-200" aria-label="Introduction">
        <div className={`${CONTAINER} pt-12 pb-12 sm:pt-16 sm:pb-16 grid lg:grid-cols-12 gap-10 lg:gap-14 items-end`}>
          <div className="lg:col-span-7">
            <Eyebrow>Pakistan government exams · FPSC · PPSC · SPSC · NTS</Eyebrow>

            <h1 className="mt-4 text-[2rem] sm:text-[2.6rem] leading-[1.12] font-semibold tracking-tight text-slate-900">
              Prepare with 12,700+ solved MCQs and follow every government job in one place.
            </h1>

            <p className="mt-4 text-[15px] leading-relaxed text-slate-600 max-w-xl">
              Subject-wise question banks, 43 aptitude chapters with worked solutions, and full-length
              timed mock exams. Free to use and updated regularly.
            </p>

            {/* Search */}
            <div className="mt-8 max-w-xl relative">
              <div className="flex gap-6 text-[13px] font-medium border-b border-slate-200" role="tablist" aria-label="Search type">
                {[
                  { id: 'mcqs' as const, label: 'MCQs & topics' },
                  { id: 'jobs' as const, label: 'Government jobs' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={searchMode === tab.id}
                    onClick={() => setSearchMode(tab.id)}
                    className={`pb-2.5 -mb-px border-b-2 transition-colors ${
                      searchMode === tab.id
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSearchSubmit} className="mt-4 flex items-center gap-2" id="hero-search-form">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    searchMode === 'mcqs'
                      ? 'Search a subject or topic, e.g. Percentage, Enzymes, Synonyms'
                      : t('home.searchJobs')
                  }
                  className="flex-1 min-w-0 h-10 rounded-md border border-slate-300 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
                  id="hero-search-input"
                  aria-label="Search"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors shrink-0"
                  id="hero-search-btn"
                >
                  {searchMode === 'mcqs' ? 'Search' : t('common.search')}
                </button>
              </form>

              {mcqSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-md border border-slate-200 shadow-lg py-1.5 z-30">
                  {mcqSuggestions.map((item) => (
                    <Link
                      key={item.href + item.label}
                      href={item.href}
                      className="flex items-baseline justify-between gap-4 px-4 py-2 text-sm text-slate-800 hover:bg-slate-50"
                    >
                      <span className="truncate">{item.label}</span>
                      <span className="text-[12px] text-slate-400 tabular-nums shrink-0">{item.meta}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-5 text-[13px] text-slate-500 leading-relaxed">
              <span className="mr-2">Popular:</span>
              {POPULAR_LINKS.map((link, i) => (
                <React.Fragment key={link.href}>
                  {i > 0 && <span className="mx-2 text-slate-300">/</span>}
                  <Link href={link.href} className="text-slate-700 hover:text-slate-950 hover:underline underline-offset-4">
                    {link.label}
                  </Link>
                </React.Fragment>
              ))}
            </p>
          </div>

          {/* Figures */}
          <dl className="lg:col-span-5 grid grid-cols-2 border-t border-l border-slate-200">
            {STATS.map((stat) => (
              <div key={stat.label} className="border-r border-b border-slate-200 px-5 py-6 flex flex-col-reverse">
                <dt className="mt-2 text-[13px] text-slate-500">{stat.label}</dt>
                <dd className="text-[1.75rem] font-semibold tracking-tight text-slate-900 tabular-nums leading-none">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────────────────────── Exam boards ───────────────────────── */}
      <section className="border-b border-slate-200 bg-slate-50/70" aria-label="Exam boards">
        <div className={`${CONTAINER} py-4 flex flex-wrap items-center gap-x-7 gap-y-2`}>
          <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-medium">Syllabus aligned with</span>
          {COMMISSIONS.map((name) => (
            <span key={name} className="text-[13px] font-semibold tracking-wide text-slate-600">
              {name}
            </span>
          ))}
        </div>
      </section>

      <div className={`${CONTAINER} py-16 space-y-20`}>
        {/* ───────────────────────── Subject banks ───────────────────────── */}
        <section aria-label="Subject question banks">
          <SectionHeader
            eyebrow="Practice"
            title="Subject question banks"
            description="Every bank is checked for duplicates and answer accuracy, with explanations where available."
            href="/quizzes"
            linkLabel="View all subjects"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-slate-200">
            {SUBJECT_BANKS.map((s) => (
              <Link
                key={s.id}
                href={s.href}
                className="group border-r border-b border-slate-200 p-6 flex flex-col hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">{s.group}</span>
                  <span className="text-[12px] tabular-nums text-slate-500">{s.count}</span>
                </div>
                <h3 className="mt-3 text-[17px] font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {s.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                <p className="mt-3 text-[13px] text-slate-400 leading-relaxed">{s.topics.join(' · ')}</p>
                <span className="mt-auto pt-5 text-[13px] font-medium text-emerald-800">Start practice →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ───────────────────────── Daily practice ───────────────────────── */}
        <section className="bg-slate-900 text-white rounded-lg overflow-hidden" aria-label="Daily practice">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 p-8 sm:p-10">
            <div className="md:col-span-6">
              <Eyebrow tone="inverse">Daily practice</Eyebrow>
              <h2 className="mt-2 text-2xl sm:text-[1.7rem] font-semibold tracking-tight">
                A new set of questions every day.
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-md">
                Take today&apos;s challenge, a random mixed test, or a short set of surprising facts.
                Your streak and best score are saved on this device.
              </p>
            </div>
            <ul className="md:col-span-6 self-end">
              {[
                { label: "Today's challenge", meta: 'Same set for everyone, resets daily', href: '/quizzes/random-test?mode=daily' },
                { label: 'Random mixed test', meta: 'Choose subject and length', href: '/quizzes/random-test' },
                { label: 'Interesting facts quiz', meta: 'Curated questions with notes', href: '/quizzes/random-test?mode=interesting' },
              ].map((item) => (
                <li key={item.href} className="border-t border-white/10 last:border-b">
                  <Link href={item.href} className="group flex items-baseline justify-between gap-4 py-3.5">
                    <span className="text-[15px] font-medium text-white group-hover:text-emerald-300 transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[12px] text-slate-400 text-right">{item.meta}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────────────────────── Aptitude ───────────────────────── */}
        <section aria-label="Quantitative aptitude chapters">
          <SectionHeader
            eyebrow="Aptitude test"
            title="43 chapters, 3,702 worked questions"
            description="Ten questions per page, with a step-by-step solution you can reveal for each one."
            href="/quizzes/aptitude"
            linkLabel="Open aptitude hub"
          />

          <div className="flex gap-6 overflow-x-auto no-scrollbar border-b border-slate-200 text-[13px] font-medium" role="tablist" aria-label="Aptitude categories">
            {APTITUDE_GROUPS.map((grp) => {
              const active = activeAptGroup === grp.id;
              const count = APTITUDE_TOPICS.filter((tp) => tp.group === grp.id).length;
              return (
                <button
                  key={grp.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveAptGroup(grp.id)}
                  className={`pb-2.5 -mb-px border-b-2 whitespace-nowrap transition-colors ${
                    active ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {grp.label}
                  <span className="ml-1.5 text-slate-400 tabular-nums">{count}</span>
                </button>
              );
            })}
          </div>

          {activeGroupMeta?.blurb && (
            <p className="mt-4 text-[13px] text-slate-500">{activeGroupMeta.blurb}</p>
          )}

          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {groupTopics.map((topic) => (
              <li key={topic.slug} className="border-b border-slate-200">
                <Link
                  href={`/quizzes/aptitude/${topic.slug}`}
                  className="group flex items-baseline justify-between gap-3 py-3"
                >
                  <span className="text-sm text-slate-800 group-hover:text-emerald-800 transition-colors truncate">
                    <span className="mr-3 text-[12px] text-slate-400 tabular-nums">
                      {String(topic.id).padStart(2, '0')}
                    </span>
                    {topic.title}
                  </span>
                  <span className="text-[12px] text-slate-400 tabular-nums shrink-0">{topic.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ───────────────────────── Mock exams ───────────────────────── */}
        <section aria-label="Timed mock exams">
          <SectionHeader
            eyebrow="Mock exams"
            title="Full-length papers under real conditions"
            description="Countdown timer, instant grading and a complete answer key at the end."
            href="/mock-tests"
            linkLabel="All mock papers"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-slate-200">
            {MOCK_EXAMS.map((exam) => (
              <Link
                key={exam.href}
                href={exam.href}
                className="group border-r border-b border-slate-200 p-6 flex flex-col hover:bg-slate-50/80 transition-colors"
              >
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">{exam.org}</span>
                <h3 className="mt-3 text-[15px] font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {exam.title}
                </h3>
                <p className="mt-2 text-[13px] text-slate-600 leading-relaxed">{exam.desc}</p>
                <div className="mt-auto pt-5 flex items-baseline justify-between gap-3">
                  <span className="text-[12px] text-slate-500 tabular-nums">{exam.meta}</span>
                  <span className="text-[13px] font-medium text-emerald-800">Start →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ───────────────────────── Jobs ───────────────────────── */}
        <section aria-label="Latest government jobs">
          <SectionHeader
            eyebrow="Careers"
            title={t('home.featuredJobs')}
            titleClassName={isUr ? 'font-urdu leading-relaxed' : ''}
            description="Recently posted federal and provincial vacancies."
            href="/jobs"
            linkLabel={t('home.viewAll')}
          />

          <div className="border-t border-slate-200">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="py-4 border-b border-slate-200">
                  <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
                  <div className="mt-2 h-3 w-1/3 bg-slate-100 rounded animate-pulse" />
                </div>
              ))
            ) : jobs.length === 0 ? (
              <p className="py-10 text-sm text-slate-500 border-b border-slate-200">{t('home.noJobs')}</p>
            ) : (
              jobs.slice(0, 6).map((job) => {
                const title = isUr && job.titleUr ? job.titleUr : job.titleEn;
                return (
                  <Link
                    key={job._id}
                    href={`/jobs/${job._id}`}
                    className="group grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 py-4 border-b border-slate-200"
                  >
                    <div className="sm:col-span-8 min-w-0">
                      <p className={`text-[15px] font-medium text-slate-900 group-hover:text-emerald-800 transition-colors truncate ${isUr ? 'font-urdu' : ''}`}>
                        {title}
                      </p>
                      <p className="mt-0.5 text-[13px] text-slate-500 truncate">
                        {[job.department, job.location].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <div className="sm:col-span-4 sm:text-right text-[13px] text-slate-500 self-center">
                      {job.status === 'closing_soon' && <span className="text-amber-700 mr-2">Closing soon</span>}
                      {job.status === 'closed' && <span className="text-slate-400 mr-2">Closed</span>}
                      {job.deadline && <span className="tabular-nums">Apply by {formatDate(job.deadline)}</span>}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        <AdSlot format="horizontal" />

        {/* ───────────────────────── News ───────────────────────── */}
        <section aria-label="Latest announcements">
          <SectionHeader
            eyebrow="Announcements"
            title={t('home.latestNews')}
            titleClassName={isUr ? 'font-urdu leading-relaxed' : ''}
            description="Exam schedules, syllabus changes and policy updates."
            href="/news"
            linkLabel={t('home.viewAll')}
          />

          {loading ? (
            <div className="grid md:grid-cols-2 gap-x-10">
              {[1, 2].map((i) => (
                <div key={i} className="py-5 border-t border-slate-200">
                  <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                  <div className="mt-3 h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : news.length === 0 ? (
            <p className="py-10 text-sm text-slate-500 border-t border-slate-200">{t('news.noNews')}</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-x-10">
              {news.slice(0, 4).map((item) => {
                const title = isUr && item.titleUr ? item.titleUr : item.titleEn;
                const body = stripHtml(isUr && item.bodyUr ? item.bodyUr : item.bodyEn);
                return (
                  <Link key={item._id} href={`/news/${item._id}`} className="group block py-5 border-t border-slate-200">
                    <p className="text-[12px] text-slate-400">
                      {formatDate(item.publishedAt || item.createdAt)}
                      {item.category && <span className="ml-2 uppercase tracking-[0.12em]">{item.category}</span>}
                    </p>
                    <h3 className={`mt-2 text-[15px] font-medium text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 ${isUr ? 'font-urdu leading-relaxed' : ''}`}>
                      {title}
                    </h3>
                    {body && <p className="mt-1.5 text-[13px] text-slate-500 leading-relaxed line-clamp-2">{body}</p>}
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ───────────────────────── Closing call to action ───────────────────────── */}
        <section
          className="border border-slate-200 rounded-lg p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
          aria-label="Get started"
        >
          <div className="max-w-xl">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              Start with a short practice set.
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Pick any subject and answer at your own pace. No sign-up is needed to practise.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/quizzes"
              id="cta-start-quiz"
              className="h-10 inline-flex items-center px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors"
            >
              Browse subjects
            </Link>
            <Link
              href="/quizzes/aptitude"
              className="h-10 inline-flex items-center px-4 rounded-md border border-slate-300 hover:border-slate-900 text-slate-900 text-sm font-medium transition-colors"
            >
              Aptitude test
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
