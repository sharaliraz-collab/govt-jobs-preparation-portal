'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InterestingRandomQuiz, { QuizMode } from '@/components/InterestingRandomQuiz';
import Loader from '@/components/Loader';

function RandomTestArenaInner() {
  const sp = useSearchParams();
  const modeParam = (sp.get('mode') || 'random').toLowerCase();
  const initialMode: QuizMode =
    modeParam === 'daily' || modeParam === 'interesting' ? modeParam : 'random';
  const initialSubject = sp.get('subject') || 'all';
  const initialCategory = sp.get('category') || 'all';
  const rawCount = parseInt(sp.get('count') || '10', 10);
  const initialCount = Number.isFinite(rawCount) ? rawCount : 10;

  return (
    <InterestingRandomQuiz
      variant="arena"
      initialMode={initialMode}
      initialSubject={initialSubject}
      initialCategory={initialCategory}
      initialCount={initialCount}
    />
  );
}

export default function RandomTestPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-12">
          <Loader />
        </div>
      }
    >
      <RandomTestArenaInner />
    </Suspense>
  );
}
