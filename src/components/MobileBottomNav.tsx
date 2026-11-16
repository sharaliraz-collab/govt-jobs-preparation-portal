'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, FileCheck, Lightbulb, Award } from 'lucide-react';

const items = [
  { href: '/', label: 'Home', icon: Home, activeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { href: '/quizzes', label: 'MCQs', icon: FileCheck, activeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { href: '/quizzes/aptitude', label: 'Aptitude', icon: Lightbulb, activeColor: 'text-amber-700 bg-amber-50 border-amber-200' },
  { href: '/mock-tests', label: 'Mocks', icon: Award, activeColor: 'text-purple-700 bg-purple-50 border-purple-200' },
  { href: '/jobs', label: 'Jobs', icon: Briefcase, activeColor: 'text-teal-700 bg-teal-50 border-teal-200' },
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
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] no-print"
    >
      <div className="grid grid-cols-5 h-15 py-1 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors ${
                active
                  ? 'text-emerald-700'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all border ${
                  active ? item.activeColor : 'border-transparent text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={2.25} />
              </div>
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
