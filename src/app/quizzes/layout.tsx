'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import SubjectSidebar from '@/components/SubjectSidebar';

export default function QuizzesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || '';

  // Keep the main /quizzes directory page full-width without a duplicate sidebar
  if (pathname === '/quizzes') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8 lg:flex lg:items-start lg:gap-7">
        <SubjectSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
