import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import MockTestsClient from '../mock-tests/MockTestsClient';

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: 'Mock Tests & Solved Written Model Papers 2026',
    description: 'Attempt free online recruitment mock tests for Sindh Police Constable, Ministry of Defence (MOD), SPSC Town Officer, FPSC Assistant Director, PST & JEST Teachers, and Islamic Studies.',
    path: '/mock-tests',
    image: '/og-image.png',
  });
}

export default function NewsPage() {
  return <MockTestsClient />;
}
