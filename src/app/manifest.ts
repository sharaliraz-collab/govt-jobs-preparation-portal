import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GovtJobs.pk — Pakistan Government Jobs & Test Prep Portal',
    short_name: 'GovtJobs.pk',
    description:
      'Daily verified FPSC, PPSC, SPSC, KPPSC & NTS government job alerts, downloadable past papers, and online MCQ practice quizzes.',
    start_url: '/',
    display: 'standalone',
    background_color: '#064E3B',
    theme_color: '#064E3B',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
