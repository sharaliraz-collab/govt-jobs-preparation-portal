import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import MockTestsClient from './MockTestsClient';

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: 'Mock Tests & Solved Written Model Papers 2026',
    description: 'Attempt free online recruitment mock tests for Sindh Police Constable, Ministry of Defence (MOD), SPSC Town Officer, FPSC Assistant Director, PST & JEST Teachers, and Islamic Studies. Live 90-min timer & instant answer keys.',
    path: '/mock-tests',
    image: '/og-image.png',
    keywords: [
      'Mock Tests Pakistan',
      'Police Constable Mock Test',
      'Ministry of Defence MOD Mock Paper',
      'SPSC Town Officer Mock Exam',
      'FPSC Assistant Director Model Paper',
      'PST JEST Teacher Practice Test'
    ],
  });
}

export default function MockTestsPage() {
  return <MockTestsClient />;
}
