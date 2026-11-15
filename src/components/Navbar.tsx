'use client';

import React, { useState, useEffect } from 'react';
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
  Users
} from 'lucide-react';

const navLinks = [
  { href: '/', labelKey: 'nav.home', icon: Home, iconColor: 'text-emerald-600' },
  { href: '/jobs', labelKey: 'nav.jobs', icon: Briefcase, iconColor: 'text-emerald-600' },
  { href: '/materials', labelKey: 'nav.materials', icon: BookOpen, iconColor: 'text-blue-600' },
  { href: '/quizzes', labelKey: 'nav.quizzes', icon: FileCheck, iconColor: 'text-amber-600' },
  { href: '/mock-tests', labelKey: 'nav.news', icon: Newspaper, iconColor: 'text-purple-600' },
  { href: '/forms', labelKey: 'nav.forms', icon: FileText, iconColor: 'text-teal-600' },
];

const empSubPages = [
  { label: 'Notifications', path: '/employees-corner?tab=notifications' },
  { label: 'FO1', path: '/employees-corner?tab=fo1' },
  { label: 'FO2', path: '/employees-corner?tab=fo2' },
  { label: 'FO3', path: '/employees-corner?tab=fo3' },
  { label: 'Forms', path: '/employees-corner?tab=forms' },
  { label: 'Govt Subsidies', path: '/employees-corner?tab=subsidies' }
];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileEmpOpen, setMobileEmpOpen] = useState(false);
  const [empDropdownOpen, setEmpDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isUr = i18n.language === 'ur';

  /* Scroll detection for glassmorphism effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-md'
          : 'bg-white/90 backdrop-blur-lg border-b border-slate-200/70 shadow-xs'
      }`}
    >
      {/* Top Banner Bar — Soft Pastel */}
      <div className="bg-slate-50/90 px-4 py-1.5 text-xs border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-medium text-slate-600">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 tracking-wide">GovtJobs.pk — Official Career &amp; Test Prep Portal</span>
          </div>

          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-slate-800 text-xs font-extrabold px-3 py-1 rounded-full transition-all duration-200 border border-slate-200 shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.25} />
            <span>{isUr ? 'English' : 'اردو'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
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

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-xs xl:text-sm font-semibold whitespace-nowrap flex-nowrap" aria-label="Main navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 border ${
                  active
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold shadow-xs'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/70 text-slate-700 hover:text-slate-900'
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-emerald-600' : link.iconColor}`} strokeWidth={2.25} />}
                <span className="whitespace-nowrap">{t(link.labelKey)}</span>
              </Link>
            );
          })}

          {/* Employees Corner Dropdown */}
          <div
            className="relative shrink-0"
            onMouseEnter={() => setEmpDropdownOpen(true)}
            onMouseLeave={() => setEmpDropdownOpen(false)}
          >
            <Link
              href="/employees-corner"
              className={`relative flex items-center gap-1.5 px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 border ${
                isActive('/employees-corner')
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold shadow-xs'
                  : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/70 text-slate-700 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 shrink-0 text-indigo-600" strokeWidth={2.25} />
              <span className="whitespace-nowrap">Employees</span>
              <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-slate-500 transition-transform duration-200 ${empDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={2.25} />
            </Link>

            {empDropdownOpen && (
              <div className="absolute top-full left-0 w-52 bg-white rounded-xl shadow-elevated border border-slate-200 py-2 z-50 text-xs animate-slide-down">
                <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Service Desk
                </div>
                {empSubPages.map((sub) => (
                  <Link
                    key={sub.path}
                    href={sub.path}
                    onClick={() => setEmpDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold transition-colors duration-150 whitespace-nowrap"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="whitespace-nowrap">{sub.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* User / Admin Action Buttons */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0 whitespace-nowrap">
          {user ? (
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={isAdmin ? '/admin/dashboard' : '/my-account'}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 transition-all duration-200 text-slate-800 whitespace-nowrap"
              >
                {isAdmin ? <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" strokeWidth={2.25} /> : <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.25} />}
                <span className="whitespace-nowrap">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="text-xs bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl font-bold transition-all duration-200 flex items-center gap-1.5 text-red-600 border border-red-200 whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" strokeWidth={2.25} />
                <span className="whitespace-nowrap">{t('nav.logout')}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/login"
                className="bg-slate-100 hover:bg-slate-200/80 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 transition-all duration-200 text-slate-800 whitespace-nowrap"
              >
                <span className="whitespace-nowrap">{t('nav.login')}</span>
              </Link>
              <Link
                href="/register"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 shadow-xs whitespace-nowrap"
              >
                <span className="whitespace-nowrap">{t('nav.register')}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-slate-800 bg-slate-100 hover:bg-slate-200 p-2 rounded-xl border border-slate-200 transition-colors"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileOpen ? <X className="w-5 h-5" strokeWidth={2.25} /> : <Menu className="w-5 h-5" strokeWidth={2.25} />}
        </button>
      </div>

      {/* Mobile Drawer — Soft White */}
      {mobileOpen && (
        <div className="lg:hidden bg-white px-4 pt-3 pb-6 border-t border-slate-200 shadow-xl animate-slide-down max-h-[82vh] overflow-y-auto">
          <nav className="space-y-1.5 stagger-children" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    {Icon && <Icon className={`w-4 h-4 ${link.iconColor}`} strokeWidth={2.25} />}
                  </div>
                  <span>{t(link.labelKey)}</span>
                </Link>
              );
            })}

            {/* Expandable Employees' Corner on Mobile */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 overflow-hidden">
              <div className="flex items-center justify-between">
                <Link
                  href="/employees-corner"
                  onClick={() => setMobileOpen(false)}
                  className={`flex-1 flex items-center gap-3 py-2.5 px-3 text-sm font-semibold transition-all ${
                    isActive('/employees-corner') ? 'text-emerald-800 font-bold' : 'text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-indigo-600" strokeWidth={2.25} />
                  </div>
                  <span>Employees&apos; Corner</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileEmpOpen(!mobileEmpOpen)}
                  aria-label="Toggle Employees Corner sub-links"
                  className="p-3 text-slate-500 hover:text-slate-900"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileEmpOpen ? 'rotate-180' : ''}`} strokeWidth={2.25} />
                </button>
              </div>
              {mobileEmpOpen && (
                <div className="grid grid-cols-2 gap-1.5 px-3 pb-3 pt-1 border-t border-slate-200/80">
                  {empSubPages.map((sub) => (
                    <Link
                      key={sub.path}
                      href={sub.path}
                      onClick={() => setMobileOpen(false)}
                      className="text-xs text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-200/80 px-3 py-2 rounded-lg font-semibold truncate"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

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
