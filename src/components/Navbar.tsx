'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toggleLanguage } from '@/i18n/i18n';
import { useAuth } from '@/context/AuthContext';
import BrowserNotificationManager from '@/components/BrowserNotificationManager';

/* ─── Navigation Data ─── */

const mcqCoreSubjects = [
  {
    name: 'Daily Random & Interesting Quiz',
    href: '/quizzes/random-test',
    desc: 'Daily challenge, custom random sets and curated facts',
  },
  {
    name: 'English Grammar & Composition',
    href: '/quizzes/english-grammar',
    desc: 'Parts of speech, synonyms, antonyms and comprehension',
  },
  {
    name: 'Pakistan Studies',
    href: '/quizzes/pak-studies',
    desc: 'Indus Valley, constitution, geography and economy',
  },
  {
    name: 'Islamic Studies (Islamiat)',
    href: '/quizzes/islamic-studies',
    desc: 'Holy Quran, Hadith, Seerah, Khulafa and Fiqh',
  },
  {
    name: 'World General Knowledge',
    href: '/quizzes/world-info',
    desc: 'Capitals, currencies and current world leaders',
  },
  {
    name: 'General Science & Ability',
    href: '/quizzes/subject/general-science',
    desc: '2,130+ everyday science, astronomy, physics and biology MCQs',
  },
];

const mcqScienceSubjects = [
  {
    name: 'Biology',
    href: '/quizzes/biology',
    desc: 'Cell biology, enzymes, genetics, physiology and ecology',
  },
  {
    name: 'Physics',
    href: '/quizzes/physics',
    desc: 'Kinematics, dynamics, optics, electricity and modern physics',
  },
  {
    name: 'Chemistry',
    href: '/quizzes/subject/chemistry',
    desc: 'Organic, inorganic, periodic table and chemical reactions',
  },
  {
    name: 'Computer Science & IT',
    href: '/quizzes/subject/computer-science',
    desc: 'MS Office, networking, cybersecurity, OS and databases',
  },
  {
    name: 'General Mathematics',
    href: '/quizzes/subject/mathematics',
    desc: 'Arithmetic, algebra, geometry and problem solving',
  },
];

const aptitudeMenuGroups = [
  {
    title: 'Arithmetic & Finance',
    topics: [
      { label: 'Average', href: '/quizzes/aptitude/average' },
      { label: 'Percentage', href: '/quizzes/aptitude/percentage' },
      { label: 'Profit & Loss', href: '/quizzes/aptitude/profit-and-loss' },
      { label: 'Ratio & Proportion', href: '/quizzes/aptitude/ratio' },
      { label: 'Simple Interest', href: '/quizzes/aptitude/interest' },
      { label: 'Compound Interest', href: '/quizzes/aptitude/compound-interest' },
      { label: 'Partnership', href: '/quizzes/aptitude/partnership' },
      { label: 'Simplification', href: '/quizzes/aptitude/simplification' },
      { label: 'Decimal Fraction', href: '/quizzes/aptitude/decimal-fraction' },
      { label: 'Alligation & Mixture', href: '/quizzes/aptitude/alligation' },
    ],
  },
  {
    title: 'Numbers & Algebra',
    topics: [
      { label: 'Number System', href: '/quizzes/aptitude/number-system' },
      { label: 'Problems on Numbers', href: '/quizzes/aptitude/problems-on-numbers' },
      { label: 'H.C.F and L.C.M', href: '/quizzes/aptitude/problems-on-hcf-and-lcm' },
      { label: 'Algebra', href: '/quizzes/aptitude/algebra' },
      { label: 'Surds and Indices', href: '/quizzes/aptitude/surds-and-indices' },
      { label: 'Square & Cube Root', href: '/quizzes/aptitude/square-root-and-cube-root' },
      { label: 'Progressions (AP/GP)', href: '/quizzes/aptitude/progressions' },
      { label: 'Logarithm', href: '/quizzes/aptitude/logarithm' },
    ],
  },
  {
    title: 'Time, Speed & Work',
    topics: [
      { label: 'Time and Work', href: '/quizzes/aptitude/time-and-work' },
      { label: 'Speed, Time & Distance', href: '/quizzes/aptitude/speed-time-and-distance' },
      { label: 'Problems on Trains', href: '/quizzes/aptitude/problems-on-trains' },
      { label: 'Calendar', href: '/quizzes/aptitude/calendar' },
      { label: 'Pipes and Cistern', href: '/quizzes/aptitude/pipes-and-cistern' },
      { label: 'Problems on Ages', href: '/quizzes/aptitude/problems-on-ages' },
      { label: 'Boats and Streams', href: '/quizzes/aptitude/boats-and-streams' },
      { label: 'Clock Problems', href: '/quizzes/aptitude/clock' },
    ],
  },
  {
    title: 'Geometry & Counting',
    topics: [
      { label: 'Area', href: '/quizzes/aptitude/area' },
      { label: 'Volume & Surface Area', href: '/quizzes/aptitude/volume-and-surface-area' },
      { label: 'Triangles', href: '/quizzes/aptitude/triangles' },
      { label: 'Trigonometry', href: '/quizzes/aptitude/trigonometry' },
      { label: 'Height and Distance', href: '/quizzes/aptitude/height-and-distance' },
      { label: 'Geometry', href: '/quizzes/aptitude/geometry' },
      { label: 'Coordinate Geometry', href: '/quizzes/aptitude/coordinate-geometry' },
      { label: 'Permutation & Combination', href: '/quizzes/aptitude/permutation-and-combination' },
      { label: 'Probability', href: '/quizzes/aptitude/probability' },
    ],
  },
];

const mockTestsSubPages = [
  {
    label: '100-MCQ Screening Pattern (20 Free)',
    href: '/quizzes/screening-test',
    desc: 'Random FPSC/PPSC/SPSC blueprint · save progress in free account',
  },
  {
    label: 'MDCAT Full Mock Exam',
    href: '/mock-papers/mdcat',
    desc: 'Biology, Chemistry, Physics & English timed test',
  },
  {
    label: 'SALU Khairpur Entry Test',
    href: '/mock-papers/salu-entry-test',
    desc: 'English, GK, Islamic Studies, Biology & Physics',
  },
  {
    label: 'Sindh Police Constable',
    href: '/mock-papers/police-constable',
    desc: 'STS SIBA pattern: Reasoning, Maths, GK & Sindhi',
  },
  {
    label: 'Ministry of Defence (MOD)',
    href: '/mock-papers/ministry-of-defence',
    desc: 'Federal screening: GK, Pak Studies, English & Math',
  },
];

const jobsResourcesSubPages = [
  {
    label: 'Government Job Alerts',
    href: '/jobs',
    desc: 'Latest verified Federal & Provincial vacancies',
  },
  {
    label: 'Past Papers & Syllabus PDFs',
    href: '/materials',
    desc: 'Downloadable FPSC, PPSC, SPSC & NTS study materials',
  },
  {
    label: 'Pension Papers (Fill & Print A4)',
    href: '/forms/pension-papers',
    desc: 'All 16 official Form 3 (Pen.), certificates, commutation & LPC',
  },
  {
    label: 'Application & Challan Forms',
    href: '/forms',
    desc: 'Official fee challans, verification & recruitment forms',
  },
  {
    label: 'Sindh Free Solar Panel Scheme',
    href: '/forms/sindh-solar',
    desc: 'Online eligibility & registration form portal',
  },
  {
    label: 'Official News & Results',
    href: '/news',
    desc: 'Exam schedules, merit lists & policy notifications',
  },
];

const empSubPages = [
  { label: 'Pension Papers — Fill & Print', path: '/forms/pension-papers', desc: '16 pixel-perfect A4 sheets & auto commutation' },
  { label: 'Official Notifications', path: '/employees-corner?tab=notifications', desc: 'Circulars & service updates' },
  { label: 'FO1 Service Portal', path: '/employees-corner?tab=fo1', desc: 'Field office records I' },
  { label: 'FO2 Service Portal', path: '/employees-corner?tab=fo2', desc: 'Field office records II' },
  { label: 'FO3 Service Portal', path: '/employees-corner?tab=fo3', desc: 'Field office records III' },
  { label: 'Departmental Forms', path: '/employees-corner?tab=forms', desc: 'Leave, GP fund & pension' },
  { label: 'Govt Subsidies & Schemes', path: '/employees-corner?tab=subsidies', desc: 'Employee welfare programs' },
];

const subjectNavItems: { label: string; href: string; hasDropdown?: 'aptitude' }[] = [
  { label: '100-MCQ Screening Test', href: '/quizzes/screening-test' },
  { label: 'Daily Random Quiz', href: '/quizzes/random-test' },
  { label: 'Physics', href: '/quizzes/physics' },
  { label: 'Chemistry', href: '/quizzes/subject/chemistry' },
  { label: 'English Grammar & Composition', href: '/quizzes/english-grammar' },
  { label: 'General Science & Ability', href: '/quizzes/subject/general-science' },
  { label: 'Aptitude Test', href: '/quizzes/aptitude', hasDropdown: 'aptitude' },
  { label: 'Biology', href: '/quizzes/biology' },
  { label: 'Pakistan Studies', href: '/quizzes/pak-studies' },
  { label: 'Islamic Studies', href: '/quizzes/islamic-studies' },
  { label: 'World GK', href: '/quizzes/world-info' },
  { label: 'Computer Science', href: '/quizzes/subject/computer-science' },
  { label: 'Mathematics', href: '/quizzes/subject/mathematics' },
];

type DropdownId = 'mcqs' | 'aptitude' | 'mocks' | 'jobs' | 'employees' | null;

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [activeDropdown, setActiveDropdown] = useState<DropdownId>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>('mcqs');
  const [scrolled, setScrolled] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isUr = i18n.language === 'ur';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  const handleMouseEnter = (id: DropdownId) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const toggleMobileAccordion = (section: string) => {
    setMobileSection((prev) => (prev === section ? null : section));
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 border-b border-slate-200 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      {/* ───── 1. Top Utility Bar (with Blinking Pension Papers & Browser Alerts) ───── */}
      <div className="bg-slate-900 text-slate-200 px-3 sm:px-4 py-1.5 text-[12px]">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/forms/pension-papers"
              className="pension-blink-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide shrink-0 transition-transform hover:scale-[1.02]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" aria-hidden="true" />
              <span>NEW · Pension Papers (Fill &amp; Print 16 A4) →</span>
            </Link>
            <span className="hidden md:inline truncate tracking-wide text-slate-400 text-[11.5px]">
              Pakistan Government Jobs &amp; Exam Preparation
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <BrowserNotificationManager />
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="shrink-0 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-100 hover:text-white text-[11px] font-medium transition-colors"
            >
              {isUr ? 'English' : 'اردو'}
            </button>
          </div>
        </div>
      </div>

      {/* ───── 2. Main Desktop & Mobile Navbar ───── */}
      <div className="relative bg-white" onMouseLeave={handleMouseLeave}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 py-2.5">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Go to homepage">
            <img
              src="/logo.png"
              alt="GovtJobs.pk Logo"
              width={28}
              height={28}
              className="w-7 h-7 rounded-md object-cover shrink-0 shadow-xs"
            />
            <span className={`text-[16px] font-semibold tracking-tight text-slate-900 whitespace-nowrap ${isUr ? 'font-urdu' : ''}`}>
              {t('nav.title')}
            </span>
          </Link>

          {/* Desktop Navigation — Soft Blue Rounded Pills */}
          <nav className="hidden lg:flex items-center gap-2 text-[13px] whitespace-nowrap" aria-label="Main navigation">
            {[
              { key: null, href: '/', label: t('nav.home'), active: isActive('/') },
              { key: 'mcqs' as const, href: '/quizzes', label: 'Subjects', active: activeDropdown === 'mcqs' || pathname === '/quizzes' || pathname?.startsWith('/quizzes/') },
              { key: 'mocks' as const, href: '/mock-tests', label: 'Mock Exams', active: activeDropdown === 'mocks' || isActive('/mock-tests') || isActive('/mock-papers') },
              { key: 'jobs' as const, href: '/jobs', label: 'Jobs & Papers', active: activeDropdown === 'jobs' || isActive('/jobs') || isActive('/materials') || isActive('/forms') },
              { key: 'employees' as const, href: '/employees-corner', label: 'Employees', active: activeDropdown === 'employees' || isActive('/employees-corner') },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => handleMouseEnter(item.key)}
                className={`px-3.5 py-1.5 rounded-lg border transition-colors ${
                  item.active
                    ? 'bg-sky-700 text-white border-sky-700 font-semibold shadow-2xs'
                    : 'bg-sky-50/90 text-sky-900 border-sky-200/80 hover:bg-sky-100 hover:border-sky-300 font-medium'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User / Admin Actions */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0 whitespace-nowrap text-[13px]">
            {user ? (
              <>
                <Link
                  href={isAdmin ? '/admin/dashboard' : '/my-account'}
                  className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200/80 text-sky-950 hover:bg-sky-100 font-medium transition-colors"
                >
                  {isAdmin ? `Admin · ${user.name}` : user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  aria-label="Logout"
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg bg-sky-50/80 border border-sky-200/80 text-sky-900 hover:bg-sky-100 font-medium transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  className="h-8 inline-flex items-center px-3.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-[13px] font-semibold transition-colors"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden h-8 px-3 rounded-lg border border-sky-200 bg-sky-50 text-[13px] font-semibold text-sky-950 hover:bg-sky-100 transition-colors"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {/* ───── Subject Sub-Navigation Bar (Soft Blue Rounded Pills + Blinking Pension Papers) ───── */}
        <div className="border-t border-sky-100 bg-sky-50/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2">
            <nav
              className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap text-[12px]"
              aria-label="Subject navigation"
            >
              <Link
                href="/forms/pension-papers"
                onClick={() => setActiveDropdown(null)}
                className="pension-blink-pill px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors"
              >
                Pension Papers (16 A4)
              </Link>
              {subjectNavItems.map((subj) => {
                const active = isActive(subj.href) || (subj.hasDropdown && activeDropdown === subj.hasDropdown);
                return (
                  <Link
                    key={subj.href}
                    href={subj.href}
                    onMouseEnter={() => handleMouseEnter(subj.hasDropdown ?? null)}
                    onClick={() => setActiveDropdown(null)}
                    className={`px-2.5 py-1 rounded-lg border shrink-0 transition-colors ${
                      active
                        ? 'bg-sky-700 text-white border-sky-700 font-semibold'
                        : 'bg-white/90 text-sky-900 border-sky-200/80 hover:bg-sky-100 hover:border-sky-300 font-medium'
                    }`}
                  >
                    {subj.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ─── PANEL 1: SUBJECTS ─── */}
        {activeDropdown === 'mcqs' && (
          <div
            onMouseEnter={() => handleMouseEnter('mcqs')}
            className="hidden lg:block absolute top-full left-0 right-0 bg-white border-t border-b border-slate-200 shadow-lg z-[100]"
          >
            <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-12 gap-8">
              <div className="col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 pb-2 border-b border-slate-200">
                  General &amp; Humanities
                </p>
                <ul className="mt-2 divide-y divide-slate-100">
                  {mcqCoreSubjects.map((subj) => (
                    <li key={subj.href}>
                      <Link
                        href={subj.href}
                        onClick={() => setActiveDropdown(null)}
                        className="block py-2.5 group"
                      >
                        <div className="text-[13px] font-medium text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {subj.name}
                        </div>
                        <div className="text-[12px] text-slate-500 truncate">{subj.desc}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 pb-2 border-b border-slate-200">
                  Science &amp; STEM
                </p>
                <ul className="mt-2 divide-y divide-slate-100">
                  {mcqScienceSubjects.map((subj) => (
                    <li key={subj.href}>
                      <Link
                        href={subj.href}
                        onClick={() => setActiveDropdown(null)}
                        className="block py-2.5 group"
                      >
                        <div className="text-[13px] font-medium text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {subj.name}
                        </div>
                        <div className="text-[12px] text-slate-500 truncate">{subj.desc}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-4 bg-slate-50 border border-slate-200 rounded-md p-5 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    Quantitative reasoning
                  </p>
                  <Link
                    href="/quizzes/aptitude"
                    onClick={() => setActiveDropdown(null)}
                    className="mt-1.5 block text-[15px] font-semibold text-slate-900 hover:text-emerald-800"
                  >
                    Aptitude Test (43 chapters)
                  </Link>
                  <p className="mt-1 text-[12px] text-slate-600 leading-relaxed">
                    3,702 solved numerical and reasoning problems with step-by-step explanations.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px]">
                    {[
                      { label: 'Average', slug: 'average' },
                      { label: 'Percentage', slug: 'percentage' },
                      { label: 'Profit & Loss', slug: 'profit-and-loss' },
                      { label: 'Ratio', slug: 'ratio' },
                      { label: 'Time & Work', slug: 'time-and-work' },
                      { label: 'Trains', slug: 'problems-on-trains' },
                      { label: 'Number System', slug: 'number-system' },
                      { label: 'Algebra', slug: 'algebra' },
                    ].map((tp) => (
                      <Link
                        key={tp.slug}
                        href={`/quizzes/aptitude/${tp.slug}`}
                        onClick={() => setActiveDropdown(null)}
                        className="text-slate-700 hover:text-emerald-800 hover:underline underline-offset-4 truncate"
                      >
                        {tp.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-[12px] font-medium">
                  <Link
                    href="/quizzes/aptitude"
                    onClick={() => setActiveDropdown(null)}
                    className="text-slate-900 hover:text-emerald-800 underline underline-offset-4"
                  >
                    All aptitude topics →
                  </Link>
                  <Link
                    href="/quizzes"
                    onClick={() => setActiveDropdown(null)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    All subjects
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── PANEL 2: APTITUDE TOPICS ─── */}
        {activeDropdown === 'aptitude' && (
          <div
            onMouseEnter={() => handleMouseEnter('aptitude')}
            className="hidden lg:block absolute top-full left-0 right-0 bg-white border-t border-b border-slate-200 shadow-lg z-[100]"
          >
            <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
              <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-[14px] font-semibold text-slate-900">
                    Quantitative Aptitude &amp; Numerical Reasoning
                  </h3>
                  <p className="text-[12px] text-slate-500">
                    43 chapters with worked step-by-step solutions
                  </p>
                </div>
                <Link
                  href="/quizzes/aptitude"
                  onClick={() => setActiveDropdown(null)}
                  className="text-[13px] font-medium text-slate-900 underline underline-offset-4 hover:text-emerald-800"
                >
                  Open full aptitude hub →
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-8">
                {aptitudeMenuGroups.map((group) => (
                  <div key={group.title}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 pb-2 border-b border-slate-200">
                      {group.title}
                    </p>
                    <ul className="mt-2 space-y-1.5 text-[13px]">
                      {group.topics.map((topic) => (
                        <li key={topic.href}>
                          <Link
                            href={topic.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block text-slate-700 hover:text-emerald-800 transition-colors truncate"
                          >
                            {topic.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── PANEL 3: MOCK EXAMS ─── */}
        {activeDropdown === 'mocks' && (
          <div
            onMouseEnter={() => handleMouseEnter('mocks')}
            className="hidden lg:block absolute top-full left-0 right-0 bg-white border-t border-b border-slate-200 shadow-lg z-[100]"
          >
            <div className="max-w-6xl mx-auto px-6 py-6">
              <div className="flex items-baseline justify-between border-b border-slate-200 pb-3 mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Full-length timed mock papers
                </span>
                <Link
                  href="/mock-tests"
                  onClick={() => setActiveDropdown(null)}
                  className="text-[13px] font-medium text-slate-900 underline underline-offset-4 hover:text-emerald-800"
                >
                  All mock papers →
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {mockTestsSubPages.map((mock) => (
                  <Link
                    key={mock.href}
                    href={mock.href}
                    onClick={() => setActiveDropdown(null)}
                    className="group block p-3 rounded-md border border-slate-200 hover:border-slate-400 transition-colors"
                  >
                    <div className="text-[13px] font-semibold text-slate-900 group-hover:text-emerald-800">
                      {mock.label}
                    </div>
                    <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">{mock.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── PANEL 4: JOBS, PAST PAPERS & FORMS ─── */}
        {activeDropdown === 'jobs' && (
          <div
            onMouseEnter={() => handleMouseEnter('jobs')}
            className="hidden lg:block absolute top-full left-0 right-0 bg-white border-t border-b border-slate-200 shadow-lg z-[100]"
          >
            <div className="max-w-6xl mx-auto px-6 py-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 border-b border-slate-200 pb-3 mb-4">
                Recruitment, past papers &amp; official forms
              </p>
              <div className="grid grid-cols-5 gap-5">
                {jobsResourcesSubPages.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setActiveDropdown(null)}
                    className="group block p-3 rounded-md border border-slate-200 hover:border-slate-400 transition-colors"
                  >
                    <div className="text-[13px] font-semibold text-slate-900 group-hover:text-emerald-800">
                      {item.label}
                    </div>
                    <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── PANEL 5: EMPLOYEES CORNER ─── */}
        {activeDropdown === 'employees' && (
          <div
            onMouseEnter={() => handleMouseEnter('employees')}
            className="hidden lg:block absolute top-full left-0 right-0 bg-white border-t border-b border-slate-200 shadow-lg z-[100]"
          >
            <div className="max-w-6xl mx-auto px-6 py-6">
              <div className="flex items-baseline justify-between border-b border-slate-200 pb-3 mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Employees&apos; service desk
                </span>
                <Link
                  href="/employees-corner"
                  onClick={() => setActiveDropdown(null)}
                  className="text-[13px] font-medium text-slate-900 underline underline-offset-4 hover:text-emerald-800"
                >
                  Open portal →
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-5">
                {empSubPages.map((sub) => (
                  <Link
                    key={sub.path}
                    href={sub.path}
                    onClick={() => setActiveDropdown(null)}
                    className="group block py-2"
                  >
                    <div className="text-[13px] font-medium text-slate-900 group-hover:text-emerald-800">
                      {sub.label}
                    </div>
                    <div className="text-[12px] text-slate-500">{sub.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ───── 3. Mobile Drawer ───── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white px-4 pt-2 pb-8 border-t border-slate-200 shadow-lg max-h-[84vh] overflow-y-auto">
          <nav className="divide-y divide-slate-200 text-sm" aria-label="Mobile navigation">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`block py-3 font-medium ${isActive('/') ? 'text-emerald-800' : 'text-slate-900'}`}
            >
              {t('nav.home')}
            </Link>

            {/* Mobile Section 1: Subjects */}
            <div className="py-2">
              <div className="flex items-center justify-between">
                <Link
                  href="/quizzes"
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 font-medium text-slate-900"
                >
                  Subjects &amp; MCQs
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('mcqs')}
                  className="px-2 py-1 text-xs text-slate-500"
                  aria-label="Toggle Subjects"
                >
                  {mobileSection === 'mcqs' ? 'Hide' : 'Show'}
                </button>
              </div>
              {mobileSection === 'mcqs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-2 pb-1 pl-3 border-l border-slate-200">
                  {[...mcqCoreSubjects, ...mcqScienceSubjects].map((subj) => (
                    <Link
                      key={subj.href}
                      href={subj.href}
                      onClick={() => setMobileOpen(false)}
                      className="py-1 text-[13px] text-slate-600 hover:text-slate-900 truncate"
                    >
                      {subj.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Section 2: Aptitude */}
            <div className="py-2">
              <div className="flex items-center justify-between">
                <Link
                  href="/quizzes/aptitude"
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 font-medium text-slate-900"
                >
                  Aptitude Test (43 Topics)
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('aptitude')}
                  className="px-2 py-1 text-xs text-slate-500"
                  aria-label="Toggle Aptitude"
                >
                  {mobileSection === 'aptitude' ? 'Hide' : 'Show'}
                </button>
              </div>
              {mobileSection === 'aptitude' && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2 pb-1 pl-3 border-l border-slate-200">
                  {aptitudeMenuGroups.flatMap((g) => g.topics.slice(0, 3)).map((topic) => (
                    <Link
                      key={topic.href}
                      href={topic.href}
                      onClick={() => setMobileOpen(false)}
                      className="py-1 text-[13px] text-slate-600 hover:text-slate-900 truncate"
                    >
                      {topic.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Section 3: Mock Exams */}
            <div className="py-2">
              <div className="flex items-center justify-between">
                <Link
                  href="/mock-tests"
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 font-medium text-slate-900"
                >
                  Mock Exams
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('mocks')}
                  className="px-2 py-1 text-xs text-slate-500"
                  aria-label="Toggle Mock Exams"
                >
                  {mobileSection === 'mocks' ? 'Hide' : 'Show'}
                </button>
              </div>
              {mobileSection === 'mocks' && (
                <div className="grid grid-cols-1 gap-y-1.5 pt-2 pb-1 pl-3 border-l border-slate-200">
                  {mockTestsSubPages.map((m) => (
                    <Link
                      key={m.href}
                      href={m.href}
                      onClick={() => setMobileOpen(false)}
                      className="py-1 text-[13px] text-slate-600 hover:text-slate-900 truncate"
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Section 4: Jobs & Resources */}
            <div className="py-2">
              <div className="flex items-center justify-between">
                <Link
                  href="/jobs"
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 font-medium text-slate-900"
                >
                  Jobs, Past Papers &amp; Forms
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('jobs')}
                  className="px-2 py-1 text-xs text-slate-500"
                  aria-label="Toggle Jobs"
                >
                  {mobileSection === 'jobs' ? 'Hide' : 'Show'}
                </button>
              </div>
              {mobileSection === 'jobs' && (
                <div className="grid grid-cols-1 gap-y-1.5 pt-2 pb-1 pl-3 border-l border-slate-200">
                  {jobsResourcesSubPages.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="py-1 text-[13px] text-slate-600 hover:text-slate-900 truncate"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Section 5: Employees */}
            <div className="py-2">
              <div className="flex items-center justify-between">
                <Link
                  href="/employees-corner"
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 font-medium text-slate-900"
                >
                  Employees&apos; Corner
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('employees')}
                  className="px-2 py-1 text-xs text-slate-500"
                  aria-label="Toggle Employees"
                >
                  {mobileSection === 'employees' ? 'Hide' : 'Show'}
                </button>
              </div>
              {mobileSection === 'employees' && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2 pb-1 pl-3 border-l border-slate-200">
                  {empSubPages.map((sub) => (
                    <Link
                      key={sub.path}
                      href={sub.path}
                      onClick={() => setMobileOpen(false)}
                      className="py-1 text-[13px] text-slate-600 hover:text-slate-900 truncate"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Auth Footer */}
          <div className="pt-4 mt-2 border-t border-slate-200">
            {user ? (
              <div className="flex items-center justify-between text-[13px]">
                <Link
                  href={isAdmin ? '/admin/dashboard' : '/my-account'}
                  onClick={() => setMobileOpen(false)}
                  className="font-medium text-slate-900"
                >
                  {user.name} ({isAdmin ? 'Admin' : 'Account'})
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-slate-900"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 h-9 inline-flex items-center justify-center rounded-md border border-slate-300 text-[13px] font-medium text-slate-800"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 h-9 inline-flex items-center justify-center rounded-md bg-slate-900 text-white text-[13px] font-medium"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
