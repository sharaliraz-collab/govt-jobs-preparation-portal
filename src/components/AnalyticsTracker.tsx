'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Avoid double tracking exact same pathname in quick succession
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    // Do not track admin routes to keep public traffic clean
    if (pathname.startsWith('/admin')) return;

    const trackVisit = async () => {
      try {
        await axios.post('/api/analytics/track', {
          path: pathname,
          title: typeof document !== 'undefined' ? document.title : '',
        });
      } catch (err) {
        // Silent catch to prevent any user-facing error
      }
    };

    // Delay slightly to allow document.title to update
    const timer = setTimeout(trackVisit, 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
