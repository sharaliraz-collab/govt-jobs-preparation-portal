import React from 'react';
import type { Metadata } from 'next';
import PoliceConstableMockTest from '@/components/PoliceConstableMockTest';
import ShareButtons from '@/components/ShareButtons';
import { buildPageMetadata, absoluteUrl } from '@/lib/seo';
import { Shield, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: 'Police Constable (BPS-07) Mock Written Test 2026 — SIBA (STS) Model Paper',
    description: 'Free 100-Question Sindh Police Constable (BPS-07) Written Test practice paper. Aligned to SIBA Testing Services (STS) Matriculation syllabus: English (10%), Sindhi (20%), Maths (20%), Gen. Awareness (20%), Reasoning (30%). Instant scoring & answer key.',
    path: '/quizzes/police-constable',
    image: '/og-police-constable.png',
    keywords: [
      'Police Constable Mock Test',
      'Sindh Police BPS-07 Written Test',
      'STS Police Constable Past Papers',
      'SIBA Testing Services Model Paper',
      'Sindh Police Constable 100 MCQs Test',
      'Police Constable Written Test Preparation'
    ],
  });
}

export default function PoliceConstableQuizAliasPage() {
  const shareUrl = absoluteUrl('/quizzes/police-constable');
  const shareTitle = 'Police Constable (BPS-07) Solved Mock Written Test — 100 MCQs';
  const shareDescription = 'Attempt free 100-question Sindh Police Constable written practice exam aligned to SIBA Testing Services (STS). Instant grading & complete answer key review!';

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-5xl mx-auto px-4 space-y-6">

        {/* Navigation & Link Sharing Header */}
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

        {/* Interactive 100-Question Mock Test Component */}
        <PoliceConstableMockTest />

        {/* Bottom Social Share Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center no-print">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Share this Mock Test with Fellow Candidates</span>
          </h3>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Help other Sindh Police Constable candidates prepare for the SIBA Testing Services (STS) BPS-07 written test by sharing this free practice paper!
          </p>
          <div className="flex justify-center pt-1">
            <ShareButtons
              url={shareUrl}
              title={shareTitle}
              description={shareDescription}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
