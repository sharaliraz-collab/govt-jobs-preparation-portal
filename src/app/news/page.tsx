import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import MockTestsClient from '../mock-tests/MockTestsClient';

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: 'Latest Government Job Notifications, Schedules & Mock Tests 2026',
    description: 'Attempt free online recruitment mock tests and view official exam schedules for Sindh Police Constable, Ministry of Defence (MOD), SPSC, FPSC, and PST & JEST Teachers.',
    path: '/news',
    image: '/og-image.png',
  });
}

export default function NewsPage() {
  return <MockTestsClient />;
}
