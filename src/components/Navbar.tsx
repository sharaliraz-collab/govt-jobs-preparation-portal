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
  Layers,
  CheckCircle2,
  Flame,
  Compass,
  Percent,
  Binary
} from 'lucide-react';

/* ─── Mega-Menu Data Definitions ─── */

const mcqCoreSubjects = [
  {
    name: 'English Grammar & Vocabulary',
    href: '/quizzes/english-grammar',
    count: '100+ MCQs',
    desc: 'Parts of Speech, Synonyms, Antonyms & Comprehension',
    icon: BookOpen,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    subTags: ['Parts of Speech', 'Synonyms', 'Antonyms', 'Reading']
  },
  {
    name: 'Pakistan Studies',
    href: '/quizzes/pak-studies',
    count: '364 MCQs',
    desc: '15 Sections — Indus Valley, Constitution, Geography & Economy',
    icon: Landmark,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    subTags: ['History', 'Constitution', 'Geography', 'Water & Economy']
  },
  {
    name: 'Islamic Studies (Islamiat)',
    href: '/quizzes/islamic-studies',
    count: '160+ MCQs',
    desc: '9 Categories — Holy Quran, Hadith, Seerah, Khulafa & Fiqh',
    icon: BookMarked,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    subTags: ['Quran', 'Hadith', 'Seerah (ﷺ)', 'Khulafa-e-Rashideen']
  },
  {
    name: 'World General Knowledge',
    href: '/quizzes/world-info',
    count: '420 MCQs',
    desc: '195 World Capitals, 195 Currencies & 30 Current Leaders',
    icon: Globe,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    subTags: ['Asia', 'Europe', 'Africa', 'Capitals & Currencies']
  },
  {
    name: 'General Science & Ability',
    href: '/quizzes/subject/general-science',
    count: 'CSS / FPSC',
    desc: 'Everyday Science, Analytical Reasoning & Environmental Science',
    icon: Atom,
    color: 'text-teal-600 bg-teal-50 border-teal-200',
    subTags: ['Everyday Science', 'Astronomy', 'Environment']
  }
];

const mcqScienceSubjects = [
  {
    name: 'Biology (Board & MDCAT)',
    href: '/quizzes/biology',
    count: '1,000 MCQs',
    desc: '14 Topics — Cell Biology, Genetics, Physiology, Ecology & Evolution',
    icon: Dna,
    color: 'text-teal-600 bg-teal-50 border-teal-200',
    subTags: ['Cell Biology', 'Enzymes', 'Genetics', 'Human Physiology']
  },
  {
    name: 'Physics (Board & Entry Test)',
    href: '/quizzes/physics',
    count: '1,000 MCQs',
    desc: '19 Topics — Kinematics, Dynamics, Optics, Electricity & Modern Physics',
    icon: Zap,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    subTags: ['Mechanics', 'Electrostatics', 'Optics', 'Nuclear Physics']
  },
  {
    name: 'Chemistry',
    href: '/quizzes/subject/chemistry',
    count: 'Practice Bank',
    desc: 'Organic, Inorganic Compounds, Periodic Table & Chemical Reactions',
    icon: FlaskConical,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    subTags: ['Organic', 'Inorganic', 'Periodic Table']
  },
  {
    name: 'Computer Science & IT',
    href: '/quizzes/subject/computer-science',
    count: 'Practice Bank',
    desc: 'MS Office, Networking, Cybersecurity, OS & Database Fundamentals',
    icon: Monitor,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    subTags: ['MS Office', 'Networks', 'DBMS']
  },
  {
    name: 'General Mathematics',
    href: '/quizzes/subject/mathematics',
    count: 'Practice Bank',
    desc: 'Basic Arithmetic, Algebra, Geometry, Ratios & Problem Solving',
    icon: Calculator,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    subTags: ['Arithmetic', 'Equations', 'Geometry']
  }
];

const aptitudeMenuGroups = [
  {
    title: 'Arithmetic & Finance',
    icon: Percent,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    topics: [
      { label: 'Average', href: '/quizzes/aptitude/average', count: 100 },
      { label: 'Percentage', href: '/quizzes/aptitude/percentage', count: 100 },
      { label: 'Profit & Loss', href: '/quizzes/aptitude/profit-and-loss', count: 100 },
      { label: 'Ratio & Proportion', href: '/quizzes/aptitude/ratio', count: 100 },
      { label: 'Simple Interest', href: '/quizzes/aptitude/interest', count: 100 },
      { label: 'Compound Interest', href: '/quizzes/aptitude/compound-interest', count: 100 },
      { label: 'Partnership', href: '/quizzes/aptitude/partnership', count: 100 },
      { label: 'Simplification', href: '/quizzes/aptitude/simplification', count: 100 },
      { label: 'Decimal Fraction', href: '/quizzes/aptitude/decimal-fraction', count: 100 },
      { label: 'Alligation & Mixture', href: '/quizzes/aptitude/alligation', count: 94 },
    ]
  },
  {
    title: 'Numbers & Algebra',
    icon: Binary,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    topics: [
      { label: 'Number System', href: '/quizzes/aptitude/number-system', count: 100 },
      { label: 'Problems on Numbers', href: '/quizzes/aptitude/problems-on-numbers', count: 100 },
      { label: 'H.C.F and L.C.M', href: '/quizzes/aptitude/problems-on-hcf-and-lcm', count: 100 },
      { label: 'Algebra', href: '/quizzes/aptitude/algebra', count: 100 },
      { label: 'Surds and Indices', href: '/quizzes/aptitude/surds-and-indices', count: 100 },
      { label: 'Square & Cube Root', href: '/quizzes/aptitude/square-root-and-cube-root', count: 100 },
      { label: 'Progressions (AP/GP)', href: '/quizzes/aptitude/progressions', count: 91 },
      { label: 'Logarithm', href: '/quizzes/aptitude/logarithm', count: 47 },
    ]
  },
  {
    title: 'Time, Speed & Work',
    icon: Clock,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    topics: [
      { label: 'Time and Work', href: '/quizzes/aptitude/time-and-work', count: 100 },
      { label: 'Speed, Time & Distance', href: '/quizzes/aptitude/speed-time-and-distance', count: 100 },
      { label: 'Problems on Trains', href: '/quizzes/aptitude/problems-on-trains', count: 86 },
      { label: 'Calendar', href: '/quizzes/aptitude/calendar', count: 84 },
      { label: 'Pipes and Cistern', href: '/quizzes/aptitude/pipes-and-cistern', count: 67 },
      { label: 'Problems on Ages', href: '/quizzes/aptitude/problems-on-ages', count: 52 },
      { label: 'Boats and Streams', href: '/quizzes/aptitude/boats-and-streams', count: 49 },
      { label: 'Clock Problems', href: '/quizzes/aptitude/clock', count: 41 },
    ]
  },
  {
    title: 'Geometry, Mensuration & Counting',
    icon: Compass,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    topics: [
      { label: 'Area', href: '/quizzes/aptitude/area', count: 100 },
      { label: 'Volume & Surface Area', href: '/quizzes/aptitude/volume-and-surface-area', count: 100 },
      { label: 'Triangles', href: '/quizzes/aptitude/triangles', count: 100 },
      { label: 'Trigonometry', href: '/quizzes/aptitude/trigonometry', count: 100 },
      { label: 'Height and Distance', href: '/quizzes/aptitude/height-and-distance', count: 100 },
      { label: 'Geometry', href: '/quizzes/aptitude/geometry', count: 100 },
      { label: 'Coordinate Geometry', href: '/quizzes/aptitude/coordinate-geometry', count: 90 },
      { label: 'Permutation & Combination', href: '/quizzes/aptitude/permutation-and-combination', count: 100 },
      { label: 'Probability', href: '/quizzes/aptitude/probability', count: 100 },
    ]
  }
];

const mockTestsSubPages = [
  {
    label: 'MDCAT Full Mock Exam (SIBA Pattern)',
    href: '/mock-papers/mdcat',
    badge: '200 MCQs · 180m',
    desc: 'Biology (80), Chemistry (60), Physics (40), English (20)',
    icon: Award,
    color: 'text-teal-600 bg-teal-50 border-teal-200'
  },
  {
    label: 'SALU Khairpur Entry Test',
    href: '/mock-papers/salu-entry-test',
    badge: '50 MCQs · 60m',
    desc: 'English, GK, Islamic Studies, Biology & Physics model paper',
    icon: GraduationCap,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    label: 'Sindh Police Constable (BPS-07)',
    href: '/mock-papers/police-constable',
    badge: '100 MCQs · 80m',
    desc: 'STS SIBA Pattern: Reasoning, Maths, GK, English & Sindhi',
    icon: Shield,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  },
  {
    label: 'Ministry of Defence (MOD)',
    href: '/mock-papers/ministry-of-defence',
    badge: '100 MCQs · 90m',
    desc: 'Federal screening test: GK, Pak Studies, English, Islamiat & Math',
    icon: Shield,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
];

const jobsResourcesSubPages = [
  {
    label: 'All Government Job Alerts',
    href: '/jobs',
    desc: 'Latest verified Federal & Provincial vacancies',
    icon: Briefcase,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  {
    label: 'Solved Past Papers & Syllabus PDFs',
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
    label: 'Official News & Result Gazettes',
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

const quickBarItems = [
  { label: 'Aptitude (3,702)', href: '/quizzes/aptitude', icon: Lightbulb, hot: true },
  { label: 'Biology (1,000)', href: '/quizzes/biology', icon: Dna },
  { label: 'Physics (1,000)', href: '/quizzes/physics', icon: Zap },
  { label: 'World GK (420)', href: '/quizzes/world-info', icon: Globe },
  { label: 'Pak Studies (364)', href: '/quizzes/pak-studies', icon: Landmark },
  { label: 'Islamic Studies', href: '/quizzes/islamic-studies', icon: BookMarked },
  { label: 'English Grammar', href: '/quizzes/english-grammar', icon: BookOpen },
  { label: 'MDCAT Mock (200)', href: '/mock-papers/mdcat', icon: Award },
  { label: 'Police Mock (100)', href: '/mock-papers/police-constable', icon: Shield },
  { label: 'MOD Mock (100)', href: '/mock-papers/ministry-of-defence', icon: Shield },
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

  /* Scroll detection for subtle elevation */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close menus on route change */
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
    }, 140);
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-md'
          : 'bg-white/95 backdrop-blur-lg border-b border-slate-200/80 shadow-xs'
      }`}
    >
      {/* ───── 1. Top Announcement & Stats Bar ───── */}
      <div className="bg-slate-50/90 px-4 py-1.5 text-xs border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium text-slate-600 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-slate-700 tracking-wide truncate">
              GovtJobs.pk — Pakistan&apos;s #1 Advanced MCQs Prep (7,600+ Solved Questions) &amp; Career Portal
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/quizzes/aptitude"
              className="hidden md:inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/90 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors"
            >
              <Flame className="w-3 h-3 text-amber-500" strokeWidth={2.25} />
              <span>New: 3,702 Aptitude MCQs</span>
            </Link>

            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-slate-800 text-xs font-extrabold px-3 py-0.5 rounded-full transition-all duration-200 border border-slate-200 shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.25} />
              <span>{isUr ? 'English' : 'اردو'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ───── 2. Main Desktop & Mobile Navbar ───── */}
      <div className="relative" onMouseLeave={handleMouseLeave}>
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Go to homepage">
            <img
              src="/logo.png"
              alt="GovtJobs.pk Logo"
              className="w-9 h-9 rounded-full border-2 border-emerald-500/80 shadow-xs object-cover transition-transform duration-300 group-hover:scale-105 shrink-0"
            />
            <div className="flex flex-col">
              <span className={`text-lg xl:text-xl font-extrabold tracking-tight text-slate-900 leading-none whitespace-nowrap ${isUr ? 'font-urdu' : ''}`}>
                {t('nav.title')}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase mt-0.5">
                MCQs &amp; Jobs Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with Hover Mega-Menus */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs xl:text-sm font-semibold whitespace-nowrap" aria-label="Main navigation">
            {/* Home */}
            <Link
              href="/"
              onMouseEnter={() => handleMouseEnter(null)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 border ${
                isActive('/')
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold shadow-xs'
                  : 'bg-transparent hover:bg-slate-100/80 border-transparent text-slate-700 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.25} />
              <span>{t('nav.home')}</span>
            </Link>

            {/* 1. MCQs Prep — MEGA MENU TRIGGER */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('mcqs')}
            >
              <Link
                href="/quizzes"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all duration-200 border ${
                  activeDropdown === 'mcqs' || (isActive('/quizzes') && !isActive('/quizzes/aptitude'))
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-extrabold shadow-xs'
                    : 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200/70 text-slate-800 hover:text-emerald-900 font-bold'
                }`}
              >
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.25} />
                <span>MCQs Prep</span>
                <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-1.5 py-0.2 rounded-full leading-tight">
                  11 Subjects
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${activeDropdown === 'mcqs' ? 'rotate-180 text-emerald-700' : ''}`} strokeWidth={2.25} />
              </Link>
            </div>

            {/* 2. Aptitude Test (43 Topics) — MEGA MENU TRIGGER */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('aptitude')}
            >
              <Link
                href="/quizzes/aptitude"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all duration-200 border ${
                  activeDropdown === 'aptitude' || isActive('/quizzes/aptitude')
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-extrabold shadow-xs'
                    : 'bg-amber-50/40 hover:bg-amber-50 border-amber-200/70 text-slate-800 hover:text-amber-900 font-bold'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" strokeWidth={2.25} />
                <span>Aptitude MCQs</span>
                <span className="text-[10px] font-extrabold bg-amber-500 text-white px-1.5 py-0.2 rounded-full leading-tight">
                  3,702
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${activeDropdown === 'aptitude' ? 'rotate-180 text-amber-700' : ''}`} strokeWidth={2.25} />
              </Link>
            </div>

            {/* 3. Mock Exams — DROPDOWN TRIGGER */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('mocks')}
            >
              <Link
                href="/mock-tests"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 border ${
                  activeDropdown === 'mocks' || isActive('/mock-tests') || isActive('/mock-papers')
                    ? 'bg-purple-50 border-purple-200 text-purple-900 font-bold shadow-xs'
                    : 'bg-transparent hover:bg-slate-100/80 border-transparent text-slate-700 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4 text-purple-600 shrink-0" strokeWidth={2.25} />
                <span>Mock Exams</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${activeDropdown === 'mocks' ? 'rotate-180 text-purple-700' : ''}`} strokeWidth={2.25} />
              </Link>
            </div>

            {/* 4. Jobs & Resources — DROPDOWN TRIGGER */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('jobs')}
            >
              <Link
                href="/jobs"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 border ${
                  activeDropdown === 'jobs' || isActive('/jobs') || isActive('/materials') || isActive('/forms')
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold shadow-xs'
                    : 'bg-transparent hover:bg-slate-100/80 border-transparent text-slate-700 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.25} />
                <span>Jobs &amp; Papers</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${activeDropdown === 'jobs' ? 'rotate-180 text-emerald-700' : ''}`} strokeWidth={2.25} />
              </Link>
            </div>

            {/* 5. Employees Corner — DROPDOWN TRIGGER */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('employees')}
            >
              <Link
                href="/employees-corner"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 border ${
                  activeDropdown === 'employees' || isActive('/employees-corner')
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-800 font-bold shadow-xs'
                    : 'bg-transparent hover:bg-slate-100/80 border-transparent text-slate-700 hover:text-slate-900'
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
                  className="bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 transition-all duration-200 text-slate-800"
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
            HOVER MEGA-MENUS (Desktop)
        ═══════════════════════════════════════════════════════════════════ */}

        {/* ─── MEGA MENU 1: MCQs PREP (11 SUBJECTS + SUB-SECTIONS) ─── */}
        {activeDropdown === 'mcqs' && (
          <div
            onMouseEnter={() => handleMouseEnter('mcqs')}
            className="hidden lg:block absolute top-full inset-x-0 bg-white/98 backdrop-blur-2xl border-b border-slate-200 shadow-2xl z-50 animate-slide-down"
          >
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="grid grid-cols-12 gap-6">
                {/* Col 1: Core & Humanities Subjects (5 cols) */}
                <div className="col-span-5 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" strokeWidth={2.25} />
                      General &amp; Humanities MCQs
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">FPSC · PPSC · SPSC · NTS</span>
                  </div>
                  <div className="space-y-1.5">
                    {mcqCoreSubjects.map((subj) => {
                      const Icon = subj.icon;
                      return (
                        <Link
                          key={subj.href}
                          href={subj.href}
                          onClick={() => setActiveDropdown(null)}
                          className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all"
                        >
                          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${subj.color} group-hover:scale-105 transition-transform`}>
                            <Icon className="w-4 h-4" strokeWidth={2.25} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                {subj.name}
                              </span>
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full shrink-0">
                                {subj.count}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">{subj.desc}</p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {subj.subTags.map((tag) => (
                                <span key={tag} className="text-[9px] font-bold text-slate-600 bg-slate-100/90 px-1.5 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Col 2: Science & Technical Subjects (4 cols) */}
                <div className="col-span-4 space-y-2.5 border-l border-slate-100 pl-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                      <Atom className="w-3.5 h-3.5" strokeWidth={2.25} />
                      Science, Medical &amp; STEM MCQs
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">Board &amp; Entry Tests</span>
                  </div>
                  <div className="space-y-1.5">
                    {mcqScienceSubjects.map((subj) => {
                      const Icon = subj.icon;
                      return (
                        <Link
                          key={subj.href}
                          href={subj.href}
                          onClick={() => setActiveDropdown(null)}
                          className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all"
                        >
                          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${subj.color} group-hover:scale-105 transition-transform`}>
                            <Icon className="w-4 h-4" strokeWidth={2.25} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                {subj.name}
                              </span>
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full shrink-0">
                                {subj.count}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">{subj.desc}</p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {subj.subTags.map((tag) => (
                                <span key={tag} className="text-[9px] font-bold text-slate-600 bg-slate-100/90 px-1.5 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Col 3: Quantitative Aptitude Spotlight Card (3 cols) */}
                <div className="col-span-3 flex flex-col justify-between bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/60 border border-amber-200/80 rounded-2xl p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                        <Lightbulb className="w-3 h-3 text-amber-600" strokeWidth={2.25} />
                        Quantitative Bank
                      </span>
                      <span className="text-[11px] font-black text-emerald-700">43 Topics</span>
                    </div>

                    <div>
                      <Link
                        href="/quizzes/aptitude"
                        onClick={() => setActiveDropdown(null)}
                        className="text-sm font-black text-slate-900 hover:text-emerald-700 transition-colors block"
                      >
                        Aptitude &amp; Reasoning (3,702 MCQs)
                      </Link>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        10 questions per page with step-by-step LaTeX math solutions shown on click.
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Popular Sub-Sections:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: 'Average', slug: 'average' },
                          { label: 'Percentage', slug: 'percentage' },
                          { label: 'Profit & Loss', slug: 'profit-and-loss' },
                          { label: 'Ratio', slug: 'ratio' },
                          { label: 'Time & Work', slug: 'time-and-work' },
                          { label: 'Trains', slug: 'problems-on-trains' },
                          { label: 'Number System', slug: 'number-system' },
                          { label: 'Algebra', slug: 'algebra' },
                          { label: 'Ages', slug: 'problems-on-ages' },
                          { label: 'Probability', slug: 'probability' },
                        ].map((t) => (
                          <Link
                            key={t.slug}
                            href={`/quizzes/aptitude/${t.slug}`}
                            onClick={() => setActiveDropdown(null)}
                            className="text-[11px] font-semibold bg-white hover:bg-emerald-600 text-slate-700 hover:text-white border border-slate-200 hover:border-emerald-600 px-2 py-0.5 rounded-lg transition-colors"
                          >
                            {t.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-amber-200/60 space-y-2">
                    <Link
                      href="/quizzes/aptitude"
                      onClick={() => setActiveDropdown(null)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Open All 43 Aptitude Topics</span>
                      <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
                    </Link>
                    <Link
                      href="/quizzes"
                      onClick={() => setActiveDropdown(null)}
                      className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1"
                    >
                      <span>View All 11 MCQ Subjects</span>
                      <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.25} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── MEGA MENU 2: APTITUDE 43 TOPICS BY GROUP ─── */}
        {activeDropdown === 'aptitude' && (
          <div
            onMouseEnter={() => handleMouseEnter('aptitude')}
            className="hidden lg:block absolute top-full inset-x-0 bg-white/98 backdrop-blur-2xl border-b border-slate-200 shadow-2xl z-50 animate-slide-down"
          >
            <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
              {/* Top Header inside Mega Menu */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Lightbulb className="w-4 h-4" strokeWidth={2.25} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Quantitative Aptitude &amp; Numerical Reasoning — 3,702 Solved MCQs
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      10 questions per page · Top page counter · Click &ldquo;Show Solution&rdquo; for step-by-step formulas
                    </p>
                  </div>
                </div>
                <Link
                  href="/quizzes/aptitude"
                  onClick={() => setActiveDropdown(null)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>Explore All 43 Topics</span>
                  <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
                </Link>
              </div>

              {/* 4 Columns of Sub-Sections */}
              <div className="grid grid-cols-4 gap-5">
                {aptitudeMenuGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.title} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${group.color}`}>
                          <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />
                        </div>
                        <span className="text-xs font-extrabold text-slate-800">{group.title}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {group.topics.map((topic) => (
                          <Link
                            key={topic.href}
                            href={topic.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-colors group"
                          >
                            <span className="truncate">{topic.label}</span>
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600 shrink-0 ml-2">
                              {topic.count} Qs
                            </span>
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

        {/* ─── MEGA MENU 3: MOCK EXAMS DROPDOWN ─── */}
        {activeDropdown === 'mocks' && (
          <div
            onMouseEnter={() => handleMouseEnter('mocks')}
            className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 w-[640px] bg-white/98 backdrop-blur-2xl rounded-b-2xl border border-t-0 border-slate-200 shadow-2xl p-5 z-50 animate-slide-down"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" strokeWidth={2.25} />
                Full-Length Timed Official Mock Exams
              </span>
              <Link
                href="/mock-tests"
                onClick={() => setActiveDropdown(null)}
                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                View All Mock Papers <ChevronRight className="w-3 h-3" />
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
                    className="group flex items-start gap-3 p-3 rounded-xl border border-slate-200/70 hover:border-purple-300 hover:bg-purple-50/30 transition-all"
                  >
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${mock.color}`}>
                      <Icon className="w-4 h-4" strokeWidth={2.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-extrabold text-slate-900 group-hover:text-purple-800 truncate">
                          {mock.label}
                        </span>
                      </div>
                      <span className="inline-block text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.2 rounded mt-0.5">
                        {mock.badge}
                      </span>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{mock.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── MEGA MENU 4: JOBS, PAST PAPERS & FORMS ─── */}
        {activeDropdown === 'jobs' && (
          <div
            onMouseEnter={() => handleMouseEnter('jobs')}
            className="hidden lg:block absolute top-full left-1/2 -translate-x-1/3 w-[560px] bg-white/98 backdrop-blur-2xl rounded-b-2xl border border-t-0 border-slate-200 shadow-2xl p-5 z-50 animate-slide-down"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" strokeWidth={2.25} />
                Career Opportunities, Past Papers &amp; Official Forms
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
                    className="group flex items-start gap-3 p-2.5 rounded-xl border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all"
                  >
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon className="w-4 h-4" strokeWidth={2.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-800 block">
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

        {/* ─── MEGA MENU 5: EMPLOYEES CORNER ─── */}
        {activeDropdown === 'employees' && (
          <div
            onMouseEnter={() => handleMouseEnter('employees')}
            className="hidden lg:block absolute top-full right-24 w-[420px] bg-white/98 backdrop-blur-2xl rounded-b-2xl border border-t-0 border-slate-200 shadow-2xl p-4 z-50 animate-slide-down"
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
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    {sub.label}
                  </span>
                  <span className="text-[10px] text-slate-500 pl-3 mt-0.5">{sub.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ───── 3. Secondary Sub-Nav Strip: One-Click Popular MCQ Tracks ───── */}
      <div className="bg-slate-50/70 border-t border-slate-200/70 px-4 py-1.5 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1 pr-1 shrink-0">
            <Layers className="w-3 h-3 text-emerald-600" strokeWidth={2.25} />
            Quick MCQs:
          </span>
          {quickBarItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/quizzes' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 border ${
                  active
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : item.hot
                    ? 'bg-amber-50/90 hover:bg-amber-100 text-amber-900 border-amber-200/90'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200/80'
                }`}
              >
                <Icon className={`w-3 h-3 shrink-0 ${active ? 'text-white' : item.hot ? 'text-amber-600' : 'text-emerald-600'}`} strokeWidth={2.25} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ───── 4. Mobile Drawer with Expandable Sub-Sections ───── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white px-4 pt-3 pb-8 border-t border-slate-200 shadow-2xl animate-slide-down max-h-[84vh] overflow-y-auto">
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

            {/* Mobile Accordion 1: MCQs Prep (11 Subjects) */}
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/30 overflow-hidden">
              <div className="flex items-center justify-between">
                <Link
                  href="/quizzes"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center gap-2.5 py-2.5 px-3 text-sm font-extrabold text-slate-900"
                >
                  <FileCheck className="w-4 h-4 text-emerald-600" strokeWidth={2.25} />
                  <span>MCQs Prep (11 Subjects)</span>
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
                        className="flex items-center justify-between gap-2 bg-white hover:bg-emerald-50 border border-slate-200/80 px-3 py-2 rounded-lg text-xs font-bold text-slate-800"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" strokeWidth={2.25} />
                          <span className="truncate">{subj.name}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                          {subj.count}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Accordion 2: Aptitude Test (43 Topics) */}
            <div className="rounded-xl border border-amber-200/90 bg-amber-50/30 overflow-hidden">
              <div className="flex items-center justify-between">
                <Link
                  href="/quizzes/aptitude"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center gap-2.5 py-2.5 px-3 text-sm font-extrabold text-slate-900"
                >
                  <Lightbulb className="w-4 h-4 text-amber-600" strokeWidth={2.25} />
                  <span>Aptitude Test (3,702 MCQs)</span>
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
                    View All 43 Aptitude Topics →
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
                  <span>Full-Length Mock Exams</span>
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
                      className="flex items-center justify-between bg-white border border-slate-200/80 px-3 py-2 rounded-lg text-xs font-bold text-slate-800"
                    >
                      <span className="truncate">{m.label}</span>
                      <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded shrink-0">{m.badge}</span>
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
                      className="bg-white border border-slate-200/80 px-3 py-2 rounded-lg text-xs font-bold text-slate-800"
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
