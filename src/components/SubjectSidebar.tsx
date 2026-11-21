'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DEFAULT_STREAK_STATS, StreakStats, loadLocalStreakStats } from '@/lib/practiceStats';

export interface SubjectNavItem {
  name: string;
  href: string;
  count: string;
  matchPrefix?: string;
  highlight?: boolean;
}

export interface SubjectNavGroup {
  category: string;
  items: SubjectNavItem[];
}

export const SUBJECT_NAV_GROUPS: SubjectNavGroup[] = [
  {
    category: 'Official Tools & Portals',
    items: [
      {
        name: 'Pension Papers (16 A4)',
        href: '/forms/pension-papers',
        count: 'NEW',
        highlight: true,
      },
      {
        name: '100-MCQ Screening Pattern',
        href: '/quizzes/screening-test',
        count: '20 Free',
      },
      {
        name: 'Random Mock Test',
        href: '/quizzes/random-test',
        count: 'Timed',
      },
      {
        name: 'Government Jobs',
        href: '/jobs',
        count: 'Live',
      },
      {
        name: 'Employees Corner',
        href: '/employees-corner',
        count: 'Desk',
      },
    ],
  },
  {
    category: 'Humanities & GK',
    items: [
      {
        name: 'Pakistan Studies',
        href: '/quizzes/pak-studies',
        count: '3,305',
      },
      {
        name: 'Islamic Studies',
        href: '/quizzes/islamic-studies',
        count: '1,711',
      },
      {
        name: 'World General Knowledge',
        href: '/quizzes/world-info',
        count: '420',
      },
    ],
  },
  {
    category: 'Science & STEM',
    items: [
      {
        name: 'General Science',
        href: '/quizzes/subject/general-science',
        count: '2,130',
      },
      {
        name: 'Biology',
        href: '/quizzes/biology',
        count: '1,547',
      },
      {
        name: 'Chemistry',
        href: '/quizzes/subject/chemistry',
        count: '1,518',
      },
      {
        name: 'Physics',
        href: '/quizzes/physics',
        count: '941',
      },
      {
        name: 'Computer Science',
        href: '/quizzes/subject/computer-science',
        count: 'Core',
      },
      {
        name: 'Mathematics',
        href: '/quizzes/subject/mathematics',
        count: 'Core',
      },
    ],
  },
  {
    category: 'Language & Reasoning',
    items: [
      {
        name: 'Quantitative Aptitude',
        href: '/quizzes/aptitude',
        matchPrefix: '/quizzes/aptitude',
        count: '3,702',
      },
      {
        name: 'English Grammar',
        href: '/quizzes/english-grammar',
        count: '400',
      },
      {
        name: 'All Subjects Directory',
        href: '/quizzes',
        count: '15,677',
      },
    ],
  },
];

export default function SubjectSidebar() {
  const pathname = usePathname() || '';
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState<StreakStats>(DEFAULT_STREAK_STATS);

  useEffect(() => {
    setStats(loadLocalStreakStats());
  }, [pathname]);

  const isItemActive = (item: SubjectNavItem) => {
    if (item.href === '/quizzes') {
      return pathname === '/quizzes';
    }
    if (item.matchPrefix) {
      return pathname === item.href || pathname.startsWith(`${item.matchPrefix}/`);
    }
    return pathname === item.href;
  };

  const activeItem =
    SUBJECT_NAV_GROUPS.flatMap((g) => g.items).find((item) => isItemActive(item)) ||
    SUBJECT_NAV_GROUPS[0].items[0];

  return (
    <>
      {/* Mobile Compact Subject & Tools Switcher */}
      <div className="lg:hidden mb-4">
        <div className="bg-white border border-sky-200/90 rounded-xl overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-left bg-sky-50/80 hover:bg-sky-100/70 transition-colors"
          >
            <div className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-700">
                Subjects &amp; Official Tools
              </span>
              <span className="block text-xs font-semibold text-slate-900 truncate mt-0.5">
                {activeItem.name}{' '}
                <span className="text-sky-700/80 font-normal tabular-nums">
                  ({activeItem.count})
                </span>
              </span>
            </div>
            <span className="text-[11px] font-semibold text-sky-900 border border-sky-300 bg-white px-2.5 py-1 rounded-lg">
              {mobileOpen ? 'Close' : 'Switch'}
            </span>
          </button>

          {mobileOpen && (
            <div className="p-3 border-t border-sky-100 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
              {SUBJECT_NAV_GROUPS.map((group) => (
                <div key={group.category}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700/80 mb-1.5 px-2">
                    {group.category}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const active = isItemActive(item);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                            item.highlight
                              ? 'pension-blink-pill font-semibold'
                              : active
                              ? 'bg-sky-700 text-white border-sky-700 font-semibold'
                              : 'bg-sky-50/50 border-sky-100 text-sky-950 hover:bg-sky-100 hover:border-sky-300 font-medium'
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          <span
                            className={`text-[10px] tabular-nums ml-2 ${
                              item.highlight
                                ? 'text-amber-950 font-bold'
                                : active
                                ? 'text-sky-100'
                                : 'text-sky-700/80'
                            }`}
                          >
                            {item.count}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Fixed-Height Scrollable Sticky Sidebar (Never Overlaps Navbar or Clips) */}
      <aside className="hidden lg:block w-60 xl:w-64 shrink-0">
        <div className="sticky top-[156px] max-h-[calc(100vh-172px)] overflow-y-auto bg-white border border-sky-200/90 rounded-xl p-3.5 shadow-2xs">
          {/* Always-Visible Mini User Progress Card */}
          <div className="mb-3 pb-3 border-b border-sky-100">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-700">
                {user ? user.name : 'Your Prep Stats'}
              </span>
              <Link
                href={user ? '/my-account' : '/register'}
                className="text-[10px] font-semibold text-sky-800 hover:underline"
              >
                {user ? 'Dashboard →' : 'Save Free →'}
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
              <div className="rounded-lg bg-sky-50 border border-sky-100 py-1 px-1">
                <div className="text-xs font-bold text-sky-950 tabular-nums">
                  {stats.dailyStreak}d
                </div>
                <div className="text-[9px] uppercase tracking-wider text-sky-700">Streak</div>
              </div>
              <div className="rounded-lg bg-sky-50 border border-sky-100 py-1 px-1">
                <div className="text-xs font-bold text-sky-950 tabular-nums">{stats.totalXP}</div>
                <div className="text-[9px] uppercase tracking-wider text-sky-700">XP</div>
              </div>
              <div className="rounded-lg bg-sky-50 border border-sky-100 py-1 px-1">
                <div className="text-xs font-bold text-emerald-700 tabular-nums">
                  {stats.bestAccuracy}%
                </div>
                <div className="text-[9px] uppercase tracking-wider text-sky-700">Best</div>
              </div>
            </div>
          </div>

          <div className="pb-2 mb-2.5 border-b border-slate-100 flex items-baseline justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-900">
              Navigation
            </h2>
            <span className="text-[10px] font-medium text-sky-700 tabular-nums">
              15,677 MCQs
            </span>
          </div>

          <nav className="space-y-3.5" aria-label="Subject and Tools Navigation">
            {SUBJECT_NAV_GROUPS.map((group) => (
              <div key={group.category}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5 px-2">
                  {group.category}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const active = isItemActive(item);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] border transition-colors ${
                            item.highlight
                              ? 'pension-blink-pill font-semibold'
                              : active
                              ? 'bg-sky-700 text-white border-sky-700 font-semibold shadow-2xs'
                              : 'bg-sky-50/55 border-sky-100/90 text-sky-950 hover:bg-sky-100 hover:border-sky-300 font-medium'
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          <span
                            className={`text-[10px] tabular-nums ml-2 shrink-0 ${
                              item.highlight
                                ? 'text-amber-950 font-bold'
                                : active
                                ? 'text-sky-100'
                                : 'text-sky-700/80'
                            }`}
                          >
                            {item.count}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
