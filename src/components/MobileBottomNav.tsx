'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Home' },
  { href: '/quizzes', label: 'Subjects' },
  { href: '/quizzes/aptitude', label: 'Aptitude' },
  { href: '/mock-tests', label: 'Mocks' },
  { href: '/jobs', label: 'Jobs' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/quizzes') return pathname?.startsWith('/quizzes') && !pathname?.startsWith('/quizzes/aptitude');
    return pathname?.startsWith(href);
  };

  return (
    <nav
      aria-label="Mobile quick navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 no-print"
    >
      <div className="grid grid-cols-5 h-11 max-w-md mx-auto">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-center text-[12px] border-t-2 -mt-px transition-colors ${
                active
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
