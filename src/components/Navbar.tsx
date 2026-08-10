'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toggleLanguage } from '@/i18n/i18n';
import { useAuth } from '@/context/AuthContext';
import {
  Globe,
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
  { href: '/', labelKey: 'nav.home', icon: null },
  { href: '/jobs', labelKey: 'nav.jobs', icon: Briefcase },
  { href: '/materials', labelKey: 'nav.materials', icon: BookOpen },
  { href: '/quizzes', labelKey: 'nav.quizzes', icon: FileCheck },
  { href: '/mock-tests', labelKey: 'nav.news', icon: Newspaper },
  { href: '/forms', labelKey: 'nav.forms', icon: FileText },
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
          ? 'bg-slate-950/85 backdrop-blur-2xl border-b border-white/10 shadow-2xl'
          : 'bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-lg'
      }`}
    >
      {/* Top Banner Bar */}
      <div className="bg-emerald-950/80 backdrop-blur-md px-4 py-1 text-xs border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-medium text-emerald-200">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-glow-gold" />
            <span className="text-xs font-bold text-emerald-200 tracking-wide">GovtJobs.pk</span>
          </div>

          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full transition-all duration-200 border border-white/20 shadow-xs backdrop-blur-md"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-300" />
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
            className="w-9 h-9 rounded-full border-2 border-amber-400/90 shadow-glow-gold object-cover transition-transform duration-300 group-hover:scale-105 shrink-0"
          />
          <span className={`text-lg xl:text-xl font-extrabold tracking-tight text-white whitespace-nowrap drop-shadow-md ${isUr ? 'font-urdu' : ''}`}>
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
                className={`relative flex items-center gap-1.5 px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl transition-all duration-300 whitespace-nowrap shrink-0 border ${
                  active
                    ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border-emerald-400/60 text-white shadow-sm backdrop-blur-md'
                    : 'bg-white/5 hover:bg-white/15 border-white/10 text-slate-200 hover:text-white'
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-emerald-300' : 'text-slate-300'}`} />}
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
              className={`relative flex items-center gap-1.5 px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl transition-all duration-300 whitespace-nowrap shrink-0 border ${
                isActive('/employees-corner')
                  ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border-emerald-400/60 text-white shadow-sm backdrop-blur-md'
                  : 'bg-white/5 hover:bg-white/15 border-white/10 text-slate-200 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Employees</span>
              <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${empDropdownOpen ? 'rotate-180' : ''}`} />
            </Link>

            {empDropdownOpen && (
              <div className="absolute top-full left-0 w-52 bg-white rounded-xl shadow-elevated border border-gray-100 py-2 z-50 text-xs animate-slide-down">
                <div className="px-4 py-1.5 text-[10px] font-bold text-govt-muted uppercase tracking-wider border-b border-gray-100 mb-1">
                  Service Desk
                </div>
                {empSubPages.map((sub) => (
                  <Link
                    key={sub.path}
                    href={sub.path}
                    onClick={() => setEmpDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-govt-emerald-light text-slate-700 hover:text-govt-emerald font-semibold transition-colors duration-150 whitespace-nowrap"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-govt-emerald/40 shrink-0" />
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
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur px-3 py-2 rounded-lg text-xs font-bold border border-white/15 transition-all duration-200 text-white whitespace-nowrap"
              >
                {isAdmin ? <ShieldAlert className="w-4 h-4 text-govt-gold shrink-0" /> : <UserCheck className="w-4 h-4 shrink-0" />}
                <span className="whitespace-nowrap">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="text-xs bg-red-500/20 hover:bg-red-500/30 px-3 py-2 rounded-lg font-bold transition-all duration-200 flex items-center gap-1.5 text-red-200 hover:text-white border border-red-400/20 whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">{t('nav.logout')}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/login"
                className="bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-lg text-xs font-bold border border-white/15 transition-all duration-200 text-white whitespace-nowrap"
              >
                <span className="whitespace-nowrap">{t('nav.login')}</span>
              </Link>
              <Link
                href="/register"
                className="bg-govt-gold hover:bg-yellow-500 text-govt-emerald-dark px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all duration-200 shadow-glow-gold whitespace-nowrap"
              >
                <span className="whitespace-nowrap">{t('nav.register')}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-govt-emerald-dark/98 backdrop-blur-lg px-4 pt-3 pb-5 border-t border-emerald-700/40 animate-slide-down">
          <nav className="space-y-1 stagger-children" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-emerald-100 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {t(link.labelKey)}
                </Link>
              );
            })}
            <Link
              href="/employees-corner"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                isActive('/employees-corner')
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-emerald-100 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Employees&apos; Corner
            </Link>
          </nav>

          <div className="pt-4 mt-3 border-t border-emerald-700/50">
            {user ? (
              <div className="space-y-2">
                <Link
                  href={isAdmin ? '/admin/dashboard' : '/my-account'}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-xs font-bold text-govt-gold px-3 py-2"
                >
                  {isAdmin ? <ShieldAlert className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  {user.name} ({isAdmin ? 'Admin' : 'Visitor'})
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-300 flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 rounded-lg transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2 px-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-lg font-bold text-white border border-white/15 transition"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-xs bg-govt-gold hover:bg-yellow-500 text-govt-emerald-dark px-4 py-2.5 rounded-lg font-extrabold transition shadow"
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
