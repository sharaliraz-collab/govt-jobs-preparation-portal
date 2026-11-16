'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toggleLanguage } from '@/i18n/i18n';
import { useAuth } from '@/context/AuthContext';
import {
  Globe,
  Home,
  Briefcase,
  BookOpen,
  FileCheck,
  Newspaper,
  FileText,
  UserCheck,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Users,
  Lightbulb,
  Atom,
  Landmark,
  BookMarked,
  Zap,
  FlaskConical,
  Dna,
  Monitor,
  Calculator,
  Sparkles,
  GraduationCap,
  Shield,
  Award,
  Clock,
  Compass,
  Percent,
  Binary
} from 'lucide-react';

/* ─── Clean Mega-Menu Data (No Question Count Clutter) ─── */

const mcqCoreSubjects = [
  {
    name: 'English Grammar & Vocabulary',
    href: '/quizzes/english-grammar',
    desc: 'Parts of Speech, Synonyms, Antonyms & Comprehension',
    icon: BookOpen,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    name: 'Pakistan Studies',
    href: '/quizzes/pak-studies',
    desc: 'Indus Valley, Constitution, Geography & Economy',
    icon: Landmark,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    name: 'Islamic Studies (Islamiat)',
    href: '/quizzes/islamic-studies',
    desc: 'Holy Quran, Hadith, Seerah (ﷺ), Khulafa & Fiqh',
    icon: BookMarked,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    name: 'World General Knowledge',
    href: '/quizzes/world-info',
    desc: 'World Capitals, Currencies & Current Global Leaders',
    icon: Globe,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  },
  {
    name: 'General Science & Ability',
    href: '/quizzes/subject/general-science',
    desc: 'Everyday Science, Analytical & Environmental Science',
    icon: Atom,
    color: 'text-teal-600 bg-teal-50 border-teal-200',
  }
];

const mcqScienceSubjects = [
  {
    name: 'Biology',
    href: '/quizzes/biology',
    desc: 'Cell Biology, Enzymes, Genetics, Physiology & Ecology',
    icon: Dna,
    color: 'text-teal-600 bg-teal-50 border-teal-200',
  },
  {
    name: 'Physics',
    href: '/quizzes/physics',
    desc: 'Kinematics, Dynamics, Optics, Electricity & Modern Physics',
    icon: Zap,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  },
  {
    name: 'Chemistry',
    href: '/quizzes/subject/chemistry',
    desc: 'Organic, Inorganic Compounds, Periodic Table & Reactions',
    icon: FlaskConical,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
  },
  {
    name: 'Computer Science & IT',
    href: '/quizzes/subject/computer-science',
    desc: 'MS Office, Networking, Cybersecurity, OS & Databases',
    icon: Monitor,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  {
    name: 'General Mathematics',
    href: '/quizzes/subject/mathematics',
    desc: 'Basic Arithmetic, Algebra, Geometry & Problem Solving',
    icon: Calculator,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
  }
];

const aptitudeMenuGroups = [
  {
    title: 'Arithmetic & Finance',
    icon: Percent,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
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
    ]
  },
  {
    title: 'Numbers & Algebra',
    icon: Binary,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    topics: [
      { label: 'Number System', href: '/quizzes/aptitude/number-system' },
      { label: 'Problems on Numbers', href: '/quizzes/aptitude/problems-on-numbers' },
      { label: 'H.C.F and L.C.M', href: '/quizzes/aptitude/problems-on-hcf-and-lcm' },
      { label: 'Algebra', href: '/quizzes/aptitude/algebra' },
      { label: 'Surds and Indices', href: '/quizzes/aptitude/surds-and-indices' },
      { label: 'Square & Cube Root', href: '/quizzes/aptitude/square-root-and-cube-root' },
      { label: 'Progressions (AP/GP)', href: '/quizzes/aptitude/progressions' },
      { label: 'Logarithm', href: '/quizzes/aptitude/logarithm' },
    ]
  },
  {
    title: 'Time, Speed & Work',
    icon: Clock,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    topics: [
      { label: 'Time and Work', href: '/quizzes/aptitude/time-and-work' },
      { label: 'Speed, Time & Distance', href: '/quizzes/aptitude/speed-time-and-distance' },
      { label: 'Problems on Trains', href: '/quizzes/aptitude/problems-on-trains' },
      { label: 'Calendar', href: '/quizzes/aptitude/calendar' },
      { label: 'Pipes and Cistern', href: '/quizzes/aptitude/pipes-and-cistern' },
      { label: 'Problems on Ages', href: '/quizzes/aptitude/problems-on-ages' },
      { label: 'Boats and Streams', href: '/quizzes/aptitude/boats-and-streams' },
      { label: 'Clock Problems', href: '/quizzes/aptitude/clock' },
    ]
  },
  {
    title: 'Geometry & Counting',
    icon: Compass,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
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
    ]
  }
];

const mockTestsSubPages = [
  {
    label: 'MDCAT Full Mock Exam',
    href: '/mock-papers/mdcat',
    desc: 'Biology, Chemistry, Physics & English timed test',
    icon: Award,
    color: 'text-teal-600 bg-teal-50 border-teal-200'
  },
  {
    label: 'SALU Khairpur Entry Test',
    href: '/mock-papers/salu-entry-test',
    desc: 'English, GK, Islamic Studies, Biology & Physics',
    icon: GraduationCap,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    label: 'Sindh Police Constable',
    href: '/mock-papers/police-constable',
    desc: 'STS SIBA Pattern: Reasoning, Maths, GK & Sindhi',
    icon: Shield,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  },
  {
    label: 'Ministry of Defence (MOD)',
    href: '/mock-papers/ministry-of-defence',
    desc: 'Federal screening: GK, Pak Studies, English & Math',
    icon: Shield,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
];

const jobsResourcesSubPages = [
  {
    label: 'Government Job Alerts',
    href: '/jobs',
    desc: 'Latest verified Federal & Provincial vacancies',
    icon: Briefcase,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  {
    label: 'Past Papers & Syllabus PDFs',
    href: '/materials',
    desc: 'Downloadable FPSC, PPSC, SPSC & NTS study materials',
    icon: BookOpen,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    label: 'Application & Challan Forms',
    href: '/forms',
    desc: 'Official fee challans, verification & recruitment forms',
    icon: FileText,
    color: 'text-teal-600 bg-teal-50 border-teal-200'
  },
  {
    label: 'Sindh Free Solar Panel Scheme',
    href: '/forms/sindh-solar',
    desc: 'Online eligibility & registration form portal',
    icon: Sparkles,
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  {
    label: 'Official News & Results',
    href: '/news',
    desc: 'Exam schedules, merit lists & policy notifications',
    icon: Newspaper,
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  }
];

const empSubPages = [
  { label: 'Official Notifications', path: '/employees-corner?tab=notifications', desc: 'Circulars & service updates' },
  { label: 'FO1 Service Portal', path: '/employees-corner?tab=fo1', desc: 'Field office records I' },
  { label: 'FO2 Service Portal', path: '/employees-corner?tab=fo2', desc: 'Field office records II' },
  { label: 'FO3 Service Portal', path: '/employees-corner?tab=fo3', desc: 'Field office records III' },
  { label: 'Departmental Forms', path: '/employees-corner?tab=forms', desc: 'Leave, GP fund & pension' },
  { label: 'Govt Subsidies & Schemes', path: '/employees-corner?tab=subsidies', desc: 'Employee welfare programs' }
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
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled
          ? 'border-b border-slate-200 shadow-md'
          : 'border-b border-slate-200/80 shadow-xs'
      }`}
    >
      {/* ───── 1. Top Announcement Bar ───── */}
      <div className="bg-slate-50 px-4 py-1.5 text-xs border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium text-slate-600 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-slate-700 tracking-wide truncate">
              GovtJobs.pk — Official Career &amp; Advanced MCQs Test Preparation Portal
            </span>
          </div>

          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-slate-800 text-xs font-extrabold px-3 py-0.5 rounded-full transition-all duration-200 border border-slate-200 shadow-xs shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.25} />
            <span>{isUr ? 'English' : 'اردو'}</span>
          </button>
        </div>
      </div>

      {/* ───── 2. Main Desktop & Mobile Navbar ───── */}
      <div className="relative bg-white" onMouseLeave={handleMouseLeave}>
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Go to homepage">
            <img
              src="/logo.png"
              alt="GovtJobs.pk Logo"
              className="w-9 h-9 rounded-full border-2 border-emerald-500/80 shadow-xs object-cover transition-transform duration-300 group-hover:scale-105 shrink-0"
            />
            <span className={`text-lg xl:text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap ${isUr ? 'font-urdu' : ''}`}>
              {t('nav.title')}
            </span>
          </Link>

          {/* Desktop Navigation with Hover Sub-Sections */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-xs xl:text-sm font-semibold whitespace-nowrap" aria-label="Main navigation">
            {/* Home */}
            <Link
              href="/"
              onMouseEnter={() => handleMouseEnter(null)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 border ${
                isActive('/')
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold shadow-xs'
                  : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/70 text-slate-700 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.25} />
              <span>{t('nav.home')}</span>
            </Link>

            {/* 1. MCQs Prep — Hover Sub-Sections */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('mcqs')}
            >
              <Link
                href="/quizzes"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all duration-200 border ${
                  activeDropdown === 'mcqs' || (isActive('/quizzes') && !isActive('/quizzes/aptitude'))
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-xs'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/70 text-slate-700 hover:text-slate-900'
                }`}
              >
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.25} />
                <span>MCQs Prep</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${activeDropdown === 'mcqs' ? 'rotate-180 text-emerald-700' : ''}`} strokeWidth={2.25} />
              </Link>
            </div>

            {/* 2. Aptitude Test — Hover Sub-Sections */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('aptitude')}
            >
              <Link
                href="/quizzes/aptitude"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all duration-200 border ${
                  activeDropdown === 'aptitude' || isActive('/quizzes/aptitude')
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-xs'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/70 text-slate-700 hover:text-slate-900'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" strokeWidth={2.25} />
                <span>Aptitude Test</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${activeDropdown === 'aptitude' ? 'rotate-180 text-amber-700' : ''}`} strokeWidth={2.25} />
              </Link>
            </div>

            {/* 3. Mock Exams — Hover Sub-Sections */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('mocks')}
            >
              <Link
                href="/mock-tests"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all duration-200 border ${
                  activeDropdown === 'mocks' || isActive('/mock-tests') || isActive('/mock-papers')
                    ? 'bg-purple-50 border-purple-200 text-purple-900 font-bold shadow-xs'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/70 text-slate-700 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4 text-purple-600 shrink-0" strokeWidth={2.25} />
                <span>Mock Exams</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${activeDropdown === 'mocks' ? 'rotate-180 text-purple-700' : ''}`} strokeWidth={2.25} />
              </Link>
            </div>

            {/* 4. Jobs & Resources — Hover Sub-Sections */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('jobs')}
            >
              <Link
                href="/jobs"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all duration-200 border ${
                  activeDropdown === 'jobs' || isActive('/jobs') || isActive('/materials') || isActive('/forms')
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold shadow-xs'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/70 text-slate-700 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.25} />
                <span>Jobs &amp; Papers</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${activeDropdown === 'jobs' ? 'rotate-180 text-emerald-700' : ''}`} strokeWidth={2.25} />
              </Link>
            </div>

            {/* 5. Employees Corner — Hover Sub-Sections */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('employees')}
            >
              <Link
                href="/employees-corner"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all duration-200 border ${
                  activeDropdown === 'employees' || isActive('/employees-corner')
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-800 font-bold shadow-xs'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/70 text-slate-700 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 text-indigo-600 shrink-0" strokeWidth={2.25} />
                <span>Employees</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${activeDropdown === 'employees' ? 'rotate-180 text-indigo-700' : ''}`} strokeWidth={2.25} />
              </Link>
            </div>
          </nav>

          {/* User / Admin Action Buttons */}
          <div className="hidden lg:flex items-center gap-2 shrink-0 whitespace-nowrap">
            {user ? (
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={isAdmin ? '/admin/dashboard' : '/my-account'}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 transition-all duration-200 text-slate-800"
                >
                  {isAdmin ? <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" strokeWidth={2.25} /> : <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.25} />}
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  aria-label="Logout"
                  className="text-xs bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl font-bold transition-all duration-200 flex items-center gap-1.5 text-red-600 border border-red-200"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" strokeWidth={2.25} />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/login"
                  className="bg-slate-100 hover:bg-slate-200/80 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 transition-all duration-200 text-slate-800"
                >
                  <span>{t('nav.login')}</span>
                </Link>
                <Link
                  href="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 shadow-xs"
                >
                  <span>{t('nav.register')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-slate-800 bg-slate-100 hover:bg-slate-200 p-2 rounded-xl border border-slate-200 transition-colors"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" strokeWidth={2.25} /> : <Menu className="w-5 h-5" strokeWidth={2.25} />}
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SOLID OPAQUE HOVER PANELS (Desktop) — Zero Bleed-Through or Overlap
        ═══════════════════════════════════════════════════════════════════ */}

        {/* ─── PANEL 1: MCQs PREP (SUBJECTS) ─── */}
        {activeDropdown === 'mcqs' && (
          <div
            onMouseEnter={() => handleMouseEnter('mcqs')}
            style={{ backgroundColor: '#ffffff' }}
            className="hidden lg:block absolute top-full left-0 right-0 bg-white border-t border-b border-slate-200 shadow-2xl z-[100]"
          >
            <div className="max-w-7xl mx-auto px-6 py-5">
              <div className="grid grid-cols-12 gap-6">
                {/* Col 1: General & Humanities */}
                <div className="col-span-4 space-y-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" strokeWidth={2.25} />
                    <span>General &amp; Humanities</span>
                  </div>
                  <div className="space-y-1">
                    {mcqCoreSubjects.map((subj) => {
                      const Icon = subj.icon;
                      return (
                        <Link
                          key={subj.href}
                          href={subj.href}
                          onClick={() => setActiveDropdown(null)}
                          className="group flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all"
                        >
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${subj.color}`}>
                            <Icon className="w-4 h-4" strokeWidth={2.25} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                              {subj.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {subj.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Col 2: Science & STEM */}
                <div className="col-span-4 space-y-2 border-l border-slate-100 pl-6">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Atom className="w-3.5 h-3.5" strokeWidth={2.25} />
                    <span>Science, Medical &amp; STEM</span>
                  </div>
                  <div className="space-y-1">
                    {mcqScienceSubjects.map((subj) => {
                      const Icon = subj.icon;
                      return (
                        <Link
                          key={subj.href}
                          href={subj.href}
                          onClick={() => setActiveDropdown(null)}
                          className="group flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all"
                        >
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${subj.color}`}>
                            <Icon className="w-4 h-4" strokeWidth={2.25} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                              {subj.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {subj.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Col 3: Quantitative Aptitude Quick Access */}
                <div className="col-span-4 flex flex-col justify-between bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4">
                  <div className="space-y-2.5">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-white text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <Lightbulb className="w-3 h-3 text-amber-600" strokeWidth={2.25} />
                      <span>Quantitative Reasoning</span>
                    </div>

                    <div>
                      <Link
                        href="/quizzes/aptitude"
                        onClick={() => setActiveDropdown(null)}
                        className="text-sm font-extrabold text-slate-900 hover:text-emerald-700 transition-colors block"
                      >
                        Aptitude Test Sub-Sections
                      </Link>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        Topic-wise practice with step-by-step math solutions.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {[
                        { label: 'Average', slug: 'average' },
                        { label: 'Percentage', slug: 'percentage' },
                        { label: 'Profit & Loss', slug: 'profit-and-loss' },
                        { label: 'Ratio', slug: 'ratio' },
                        { label: 'Time & Work', slug: 'time-and-work' },
                        { label: 'Trains', slug: 'problems-on-trains' },
                        { label: 'Number System', slug: 'number-system' },
                        { label: 'Algebra', slug: 'algebra' },
                      ].map((t) => (
                        <Link
                          key={t.slug}
                          href={`/quizzes/aptitude/${t.slug}`}
                          onClick={() => setActiveDropdown(null)}
                          className="text-xs font-semibold bg-white hover:bg-emerald-600 text-slate-700 hover:text-white border border-slate-200/90 hover:border-emerald-600 px-2.5 py-1.5 rounded-lg transition-colors truncate"
                        >
                          {t.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-amber-200/60 flex items-center gap-2">
                    <Link
                      href="/quizzes/aptitude"
                      onClick={() => setActiveDropdown(null)}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1"
                    >
                      <span>All Aptitude Topics</span>
                      <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.25} />
                    </Link>
                    <Link
                      href="/quizzes"
                      onClick={() => setActiveDropdown(null)}
                      className="flex-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1"
                    >
                      <span>All Subjects</span>
                      <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.25} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── PANEL 2: APTITUDE TOPICS BY CATEGORY ─── */}
        {activeDropdown === 'aptitude' && (
          <div
            onMouseEnter={() => handleMouseEnter('aptitude')}
            style={{ backgroundColor: '#ffffff' }}
            className="hidden lg:block absolute top-full left-0 right-0 bg-white border-t border-b border-slate-200 shadow-2xl z-[100]"
          >
            <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Lightbulb className="w-4 h-4" strokeWidth={2.25} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Quantitative Aptitude &amp; Numerical Reasoning Topics
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Select any topic below to start practicing with step-by-step solutions
                    </p>
                  </div>
                </div>
                <Link
                  href="/quizzes/aptitude"
                  onClick={() => setActiveDropdown(null)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>View All Aptitude Topics</span>
                  <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-6">
                {aptitudeMenuGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.title} className="space-y-2">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${group.color}`}>
                          <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />
                        </div>
                        <span className="text-xs font-extrabold text-slate-800">{group.title}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-0.5">
                        {group.topics.map((topic) => (
                          <Link
                            key={topic.href}
                            href={topic.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors group"
                          >
                            <span className="truncate">{topic.label}</span>
                            <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── PANEL 3: MOCK EXAMS DROPDOWN ─── */}
        {activeDropdown === 'mocks' && (
          <div
            onMouseEnter={() => handleMouseEnter('mocks')}
            style={{ backgroundColor: '#ffffff' }}
            className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 w-[580px] bg-white rounded-b-2xl border border-slate-200 shadow-2xl p-5 z-[100]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" strokeWidth={2.25} />
                Official Timed Mock Exams
              </span>
              <Link
                href="/mock-tests"
                onClick={() => setActiveDropdown(null)}
                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                All Mock Papers <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {mockTestsSubPages.map((mock) => {
                const Icon = mock.icon;
                return (
                  <Link
                    key={mock.href}
                    href={mock.href}
                    onClick={() => setActiveDropdown(null)}
                    className="group flex items-start gap-3 p-3 rounded-xl border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/40 transition-all"
                  >
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${mock.color}`}>
                      <Icon className="w-4 h-4" strokeWidth={2.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-extrabold text-slate-900 group-hover:text-purple-800 truncate">
                        {mock.label}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{mock.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── PANEL 4: JOBS, PAST PAPERS & FORMS ─── */}
        {activeDropdown === 'jobs' && (
          <div
            onMouseEnter={() => handleMouseEnter('jobs')}
            style={{ backgroundColor: '#ffffff' }}
            className="hidden lg:block absolute top-full left-1/2 -translate-x-1/3 w-[540px] bg-white rounded-b-2xl border border-slate-200 shadow-2xl p-5 z-[100]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" strokeWidth={2.25} />
                Jobs, Past Papers &amp; Official Forms
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {jobsResourcesSubPages.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setActiveDropdown(null)}
                    className="group flex items-start gap-3 p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all"
                  >
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon className="w-4 h-4" strokeWidth={2.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-800 block truncate">
                        {item.label}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── PANEL 5: EMPLOYEES CORNER ─── */}
        {activeDropdown === 'employees' && (
          <div
            onMouseEnter={() => handleMouseEnter('employees')}
            style={{ backgroundColor: '#ffffff' }}
            className="hidden lg:block absolute top-full right-24 w-[420px] bg-white rounded-b-2xl border border-slate-200 shadow-2xl p-4 z-[100]"
          >
            <div className="px-2 pb-2 mb-2 text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
              <span>Employees&apos; Service Desk</span>
              <Link href="/employees-corner" onClick={() => setActiveDropdown(null)} className="text-emerald-700 hover:underline">
                Open Portal →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {empSubPages.map((sub) => (
                <Link
                  key={sub.path}
                  href={sub.path}
                  onClick={() => setActiveDropdown(null)}
                  className="flex flex-col p-2.5 rounded-xl hover:bg-indigo-50/60 border border-transparent hover:border-indigo-200/80 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span className="truncate">{sub.label}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 pl-3 mt-0.5 truncate">{sub.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ───── 3. Mobile Drawer with Expandable Sub-Sections ───── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white px-4 pt-3 pb-8 border-t border-slate-200 shadow-2xl max-h-[84vh] overflow-y-auto">
          <nav className="space-y-2" aria-label="Mobile navigation">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-bold ${
                isActive('/') ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4 text-emerald-600" strokeWidth={2.25} />
              <span>{t('nav.home')}</span>
            </Link>

            {/* Mobile Accordion 1: MCQs Prep */}
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/30 overflow-hidden">
              <div className="flex items-center justify-between">
                <Link
                  href="/quizzes"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center gap-2.5 py-2.5 px-3 text-sm font-extrabold text-slate-900"
                >
                  <FileCheck className="w-4 h-4 text-emerald-600" strokeWidth={2.25} />
                  <span>MCQs Prep</span>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('mcqs')}
                  className="p-3 text-slate-600"
                  aria-label="Toggle MCQs Prep sub-sections"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileSection === 'mcqs' ? 'rotate-180' : ''}`} strokeWidth={2.25} />
                </button>
              </div>
              {mobileSection === 'mcqs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 px-3 pb-3 pt-1 border-t border-emerald-200/60">
                  {[...mcqCoreSubjects, ...mcqScienceSubjects].map((subj) => {
                    const Icon = subj.icon;
                    return (
                      <Link
                        key={subj.href}
                        href={subj.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 bg-white hover:bg-emerald-50 border border-slate-200/80 px-3 py-2 rounded-lg text-xs font-bold text-slate-800"
                      >
                        <Icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" strokeWidth={2.25} />
                        <span className="truncate">{subj.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Accordion 2: Aptitude Test */}
            <div className="rounded-xl border border-amber-200/90 bg-amber-50/30 overflow-hidden">
              <div className="flex items-center justify-between">
                <Link
                  href="/quizzes/aptitude"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center gap-2.5 py-2.5 px-3 text-sm font-extrabold text-slate-900"
                >
                  <Lightbulb className="w-4 h-4 text-amber-600" strokeWidth={2.25} />
                  <span>Aptitude Test</span>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('aptitude')}
                  className="p-3 text-slate-600"
                  aria-label="Toggle Aptitude sub-sections"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileSection === 'aptitude' ? 'rotate-180' : ''}`} strokeWidth={2.25} />
                </button>
              </div>
              {mobileSection === 'aptitude' && (
                <div className="px-3 pb-3 pt-1 border-t border-amber-200/60 space-y-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    {aptitudeMenuGroups.flatMap(g => g.topics.slice(0, 3)).map((topic) => (
                      <Link
                        key={topic.href}
                        href={topic.href}
                        onClick={() => setMobileOpen(false)}
                        className="bg-white border border-slate-200/80 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 truncate"
                      >
                        {topic.label}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/quizzes/aptitude"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center bg-amber-500 text-white text-xs font-extrabold py-2 rounded-lg"
                  >
                    View All Aptitude Topics →
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Accordion 3: Mock Exams */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 overflow-hidden">
              <div className="flex items-center justify-between">
                <Link
                  href="/mock-tests"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center gap-2.5 py-2.5 px-3 text-sm font-bold text-slate-800"
                >
                  <Award className="w-4 h-4 text-purple-600" strokeWidth={2.25} />
                  <span>Mock Exams</span>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('mocks')}
                  className="p-3 text-slate-600"
                  aria-label="Toggle Mock Exams"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileSection === 'mocks' ? 'rotate-180' : ''}`} strokeWidth={2.25} />
                </button>
              </div>
              {mobileSection === 'mocks' && (
                <div className="grid grid-cols-1 gap-1.5 px-3 pb-3 pt-1 border-t border-slate-200/80">
                  {mockTestsSubPages.map((m) => (
                    <Link
                      key={m.href}
                      href={m.href}
                      onClick={() => setMobileOpen(false)}
                      className="bg-white border border-slate-200/80 px-3 py-2 rounded-lg text-xs font-bold text-slate-800 truncate"
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Accordion 4: Jobs, Past Papers & Forms */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 overflow-hidden">
              <div className="flex items-center justify-between">
                <Link
                  href="/jobs"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center gap-2.5 py-2.5 px-3 text-sm font-bold text-slate-800"
                >
                  <Briefcase className="w-4 h-4 text-emerald-600" strokeWidth={2.25} />
                  <span>Jobs, Past Papers &amp; Forms</span>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('jobs')}
                  className="p-3 text-slate-600"
                  aria-label="Toggle Jobs and Papers"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileSection === 'jobs' ? 'rotate-180' : ''}`} strokeWidth={2.25} />
                </button>
              </div>
              {mobileSection === 'jobs' && (
                <div className="grid grid-cols-1 gap-1.5 px-3 pb-3 pt-1 border-t border-slate-200/80">
                  {jobsResourcesSubPages.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="bg-white border border-slate-200/80 px-3 py-2 rounded-lg text-xs font-bold text-slate-800 truncate"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Accordion 5: Employees' Corner */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 overflow-hidden">
              <div className="flex items-center justify-between">
                <Link
                  href="/employees-corner"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center gap-2.5 py-2.5 px-3 text-sm font-bold text-slate-800"
                >
                  <Users className="w-4 h-4 text-indigo-600" strokeWidth={2.25} />
                  <span>Employees&apos; Corner</span>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('employees')}
                  className="p-3 text-slate-600"
                  aria-label="Toggle Employees Corner"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileSection === 'employees' ? 'rotate-180' : ''}`} strokeWidth={2.25} />
                </button>
              </div>
              {mobileSection === 'employees' && (
                <div className="grid grid-cols-2 gap-1.5 px-3 pb-3 pt-1 border-t border-slate-200/80">
                  {empSubPages.map((sub) => (
                    <Link
                      key={sub.path}
                      href={sub.path}
                      onClick={() => setMobileOpen(false)}
                      className="text-xs text-slate-700 bg-white border border-slate-200/80 px-3 py-2 rounded-lg font-semibold truncate"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Auth Footer */}
          <div className="pt-4 mt-4 border-t border-slate-200">
            {user ? (
              <div className="flex items-center justify-between gap-2 px-1">
                <Link
                  href={isAdmin ? '/admin/dashboard' : '/my-account'}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-800 py-2"
                >
                  {isAdmin ? <ShieldAlert className="w-4 h-4 text-amber-600" strokeWidth={2.25} /> : <UserCheck className="w-4 h-4 text-emerald-600" strokeWidth={2.25} />}
                  <span>{user.name} ({isAdmin ? 'Admin' : 'Visitor'})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-600 flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg font-bold transition"
                >
                  <LogOut className="w-3.5 h-3.5" strokeWidth={2.25} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center text-xs bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-xl font-bold text-slate-800 border border-slate-200 transition"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-center text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl font-extrabold transition shadow-xs"
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
