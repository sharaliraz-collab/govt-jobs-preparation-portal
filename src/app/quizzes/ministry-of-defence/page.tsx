import React from 'react';
import type { Metadata } from 'next';
import MinistryOfDefenceMockTest from '@/components/MinistryOfDefenceMockTest';
import ShareButtons from '@/components/ShareButtons';
import { buildPageMetadata, absoluteUrl } from '@/lib/seo';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: 'Ministry of Defence Pakistan (MOD) Mock Written Test 2026 — 100 MCQs Model Paper',
    description: 'Free 100-Question Ministry of Defence (MOD) Written Test practice paper. Aligned to past papers syllabus: English, Pakistan Studies, Islamiat, General Knowledge, Everyday Science, Mathematics.',
    path: '/quizzes/ministry-of-defence',
    image: '/og-ministry-of-defence.png',
    keywords: [
      'Ministry of Defence Mock Test',
      'MOD Written Test Past Papers',
      'Ministry of Defence Pakistan 100 MCQs',
      'MOD Paper 2026 Preparation'
    ],
  });
}

export default function MinistryOfDefenceQuizAliasPage() {
  const shareUrl = absoluteUrl('/quizzes/ministry-of-defence');
  const shareTitle = 'Ministry of Defence Pakistan (MOD) Solved Written Test — 100 MCQs';
  const shareDescription = 'Attempt free 100-question Ministry of Defence (MOD) written practice exam. Live timer, section breakdown, and full answer key!';

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-5xl mx-auto px-4 space-y-6">

        {/* Navigation Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Quizzes</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Share Test:</span>
            <ShareButtons
              url={shareUrl}
              title={shareTitle}
              description={shareDescription}
              className="py-0 border-none"
            />
          </div>
        </div>

        {/* Interactive MOD Mock Test */}
        <MinistryOfDefenceMockTest />

      </div>
    </div>
  );
}
