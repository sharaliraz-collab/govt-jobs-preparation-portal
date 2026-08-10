import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import MDCATMockTest from '@/components/MDCATMockTest';

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: 'MDCAT Mock Test (200 MCQs) — SIBA Testing Service Model Paper',
    description: 'Attempt full-length 200-question MDCAT Mock Test aligned to SIBA Testing Service (STS) pattern: Biology (80), Chemistry (60), Physics (40), English (20). Live 3-hour timer & instant scoring.',
    path: '/mock-papers/mdcat',
    image: '/og-mdcat.png',
    keywords: [
      'MDCAT Mock Test',
      'SIBA Testing Service MDCAT',
      'MDCAT 200 MCQs Practice',
      'Medical Entry Test Model Paper',
      'Sindh MDCAT Mock Exam 2026'
    ],
  });
}

export default function MDCATMockTestPage() {
  return (
    <div className="min-h-screen py-8">
      <MDCATMockTest />
    </div>
  );
}
