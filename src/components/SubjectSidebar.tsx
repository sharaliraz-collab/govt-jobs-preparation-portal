'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface SubjectNavItem {
  name: string;
  href: string;
  count: string;
  matchPrefix?: string;
}

export interface SubjectNavGroup {
  category: string;
  items: SubjectNavItem[];
}

export const SUBJECT_NAV_GROUPS: SubjectNavGroup[] = [
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
    ],
  },
  {
    category: 'Practice Tools',
    items: [
      {
        name: 'Random Mock Test',
        href: '/quizzes/random-test',
        count: 'Timed',
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
  const [mobileOpen, setMobileOpen] = useState(false);

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
      {/* Mobile Compact Subject Switcher */}
      <div className="lg:hidden mb-4">
        <div className="bg-white border border-slate-200/90 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-left bg-slate-50/70 hover:bg-slate-100/70 transition-colors"
          >
            <div className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Subject Directory
              </span>
              <span className="block text-xs font-semibold text-slate-900 truncate mt-0.5">
                {activeItem.name}{' '}
                <span className="text-slate-400 font-normal tabular-nums">
                  ({activeItem.count})
                </span>
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-600 border border-slate-200 bg-white px-2.5 py-1 rounded">
              {mobileOpen ? 'Close' : 'Switch Subject'}
            </span>
          </button>

          {mobileOpen && (
            <div className="p-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
              {SUBJECT_NAV_GROUPS.map((group) => (
                <div key={group.category}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5 px-2">
                    {group.category}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const active = isItemActive(item);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                            active
                              ? 'bg-slate-900 text-white font-semibold'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-medium'
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          <span
                            className={`text-[10px] tabular-nums ml-2 ${
                              active ? 'text-slate-300' : 'text-slate-400'
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

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-56 xl:w-60 shrink-0">
        <div className="sticky top-20 bg-white border border-slate-200/90 rounded-lg p-3.5">
          <div className="pb-2.5 mb-3 border-b border-slate-100 flex items-baseline justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-900">
              Subjects
            </h2>
            <span className="text-[10px] font-medium text-slate-400 tabular-nums">
              15,677 MCQs
            </span>
          </div>

          <nav className="space-y-4" aria-label="Subject Navigation">
            {SUBJECT_NAV_GROUPS.map((group) => (
              <div key={group.category}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1 px-2">
                  {group.category}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isItemActive(item);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12.5px] transition-colors ${
                            active
                              ? 'bg-slate-900 text-white font-semibold'
                              : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950 font-medium'
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          <span
                            className={`text-[10px] tabular-nums ml-2 shrink-0 ${
                              active ? 'text-slate-300' : 'text-slate-400'
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
