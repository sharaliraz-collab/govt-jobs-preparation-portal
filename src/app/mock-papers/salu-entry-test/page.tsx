import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import SaluMockTest from '@/components/SaluMockTest';
import ShareButtons from '@/components/ShareButtons';
import { buildPageMetadata, absoluteUrl } from '@/lib/seo';
import { Sparkles, ArrowLeft, GraduationCap, MapPin, Award, Clock, BookOpen, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 86400; // 24 hours static revalidation

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: 'Shah Abdul Latif University (SALU) Entry Test 2026 — 50 MCQs Solved Mock Paper',
    description: 'Free 50-Question Shah Abdul Latif University (SALU) Khairpur Entry Test practice paper. Aligned with SALU syllabus: English (10 MCQs), General Knowledge (10 MCQs), Islamic Studies (10 MCQs), Biology (10 MCQs), and Physics (10 MCQs). Live 60-min timer, instant grading & answer key.',
    path: '/mock-papers/salu-entry-test',
    image: '/og-salu-entry-test.png',
    keywords: [
      'SALU Entry Test',
      'Shah Abdul Latif University Khairpur Entry Test 2026',
      'Bab-e-Latif SALU Entry Paper',
      'SALU Mock Test 50 MCQs',
      'SALU Past Papers Solved',
      'SALU Admission Test Preparation',
      'Khairpur University Model Paper',
      'SALU Entry Test MCQs with Answers',
      'SALU Bachelor Admission Test'
    ],
  });
}

export default function SaluEntryTestPage() {
  const shareUrl = absoluteUrl('/mock-papers/salu-entry-test');
  const shareTitle = '📘 Shah Abdul Latif University (SALU) Khairpur — 50 MCQs Solved Entry Test Mock Paper 2026';
  const shareDescription = '🎯 Practice the official 50-MCQ admission test for Shah Abdul Latif University (SALU) Khairpur. Includes English, GK, Islamic Studies, Biology & Physics with 60-min live timer and complete answer key!';

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-5xl mx-auto px-4 space-y-6">

        {/* Navigation & Link Sharing Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <Link
            href="/mock-tests"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-sky-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Mock Tests</span>
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

        {/* SALU Campus & Gate Showcase Card */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm no-print">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-center">
            {/* Image of Bab-e-Latif Gate */}
            <div className="md:col-span-5 relative h-56 md:h-full min-h-[220px] bg-slate-900">
              <Image
                src="/salu-gate.png"
                alt="Bab-e-Latif Main Gate - Shah Abdul Latif University Khairpur"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-950/40" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                  🏛️ Bab-e-Latif Gate · SALU Khairpur
                </span>
              </div>
            </div>

            {/* University & Exam Highlights */}
            <div className="md:col-span-7 p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-900 text-xs font-extrabold px-3 py-1 rounded-full border border-sky-200">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-700" />
                  Shah Abdul Latif University
                </span>
                <span className="inline-flex items-center gap-1 text-slate-600 text-xs font-semibold bg-slate-100 px-3 py-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  Khairpur Mirs, Sindh
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900 leading-snug">
                  SALU Khairpur Entry Test 2026 Model Paper
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Prepare for Bachelor &amp; Master degree admissions at Shah Abdul Latif University (SALU). Practice with this standard 50-MCQ format across 5 subjects with live timer and scoring.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold pt-1">
                <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-100 text-sky-950">
                  <span className="text-[10px] uppercase font-bold text-sky-700 block">Total Questions</span>
                  <span className="text-sm font-black">50 MCQs</span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-emerald-950">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Time Duration</span>
                  <span className="text-sm font-black">60 Minutes</span>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-amber-950 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">Passing Marks</span>
                  <span className="text-sm font-black">25 / 50 (50%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive 50-Question SALU Mock Test Component */}
        <SaluMockTest />

        {/* Bottom Social Share Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-center no-print">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Share this SALU Khairpur Practice Test with Fellow Students
            </h3>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              Help other students preparing for the Shah Abdul Latif University (SALU) admission entry test on WhatsApp groups, Facebook, and Twitter.
            </p>
          </div>

          <div className="flex justify-center pt-2">
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
