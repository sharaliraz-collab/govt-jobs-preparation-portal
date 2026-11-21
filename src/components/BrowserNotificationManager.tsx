'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface PortalNotificationItem {
  id: string;
  type: 'job' | 'news' | 'daily' | 'tool';
  badge: string;
  title: string;
  body: string;
  url: string;
  createdAt: string;
}

const SEEN_OS_KEY = 'govtjobs_os_notified_ids_v1';
const READ_INBOX_KEY = 'govtjobs_inbox_read_ids_v1';
const ENABLED_KEY = 'govtjobs_browser_alerts_enabled_v1';

function loadIdSet(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveIdSet(key: string, set: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(set).slice(-80)));
  } catch {
    /* ignore */
  }
}

export default function BrowserNotificationManager() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PortalNotificationItem[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const [statusMsg, setStatusMsg] = useState('');

  const panelRef = useRef<HTMLDivElement | null>(null);
  const swRegRef = useRef<ServiceWorkerRegistration | null>(null);

  const showNativeNotification = useCallback(
    async (title: string, body: string, url: string, tag?: string) => {
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;

      const options: NotificationOptions = {
        body,
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-48x48.png',
        tag: tag || `govtjobs-${Date.now()}`,
        data: { url },
      };

      try {
        const reg =
          swRegRef.current ||
          ('serviceWorker' in navigator ? await navigator.serviceWorker.ready : null);
        if (reg && 'showNotification' in reg) {
          await reg.showNotification(title, options);
          return;
        }
      } catch {
        /* fallback to direct Notification constructor */
      }

      try {
        const n = new Notification(title, options);
        n.onclick = () => {
          window.focus();
          if (url) window.location.href = url;
          n.close();
        };
      } catch {
        /* browser blocked direct Notification */
      }
    },
    []
  );

  const fetchAndDispatchLatest = useCallback(
    async (shouldNotifyOs: boolean) => {
      try {
        const res = await axios.get('/api/notifications/latest', { timeout: 8000 });
        const list: PortalNotificationItem[] = Array.isArray(res.data?.notifications)
          ? res.data.notifications
          : [];
        setItems(list);

        if (shouldNotifyOs && typeof window !== 'undefined' && Notification.permission === 'granted') {
          const seen = loadIdSet(SEEN_OS_KEY);
          const unseen = list.filter((item) => !seen.has(item.id));
          if (unseen.length > 0) {
            // Notify at most 1 freshest item per check so users are never spammed
            const top = unseen[0];
            await showNativeNotification(
              `GovtJobs.pk · ${top.badge}`,
              `${top.title} — ${top.body}`,
              top.url,
              top.id
            );
            for (const item of list) seen.add(item.id);
            saveIdSet(SEEN_OS_KEY, seen);
          }
        }
      } catch {
        /* non-blocking */
      }
    },
    [showNativeNotification]
  );

  // Initialize Notification support, Service Worker registration, and periodic alert check
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isSupported = 'Notification' in window;
    setSupported(isSupported);
    setReadIds(loadIdSet(READ_INBOX_KEY));

    const perm = isSupported ? Notification.permission : 'denied';
    setPermission(perm);

    const userEnabled =
      perm === 'granted' && window.localStorage.getItem(ENABLED_KEY) !== '0';
    setEnabled(userEnabled);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          swRegRef.current = reg;
        })
        .catch(() => {});
    }

    fetchAndDispatchLatest(userEnabled);

    const intervalId = window.setInterval(() => {
      const stillEnabled =
        'Notification' in window &&
        Notification.permission === 'granted' &&
        window.localStorage.getItem(ENABLED_KEY) !== '0';
      fetchAndDispatchLatest(stillEnabled);
    }, 15 * 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, [fetchAndDispatchLatest]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const handleEnableBrowserAlerts = async () => {
    if (!supported) {
      setStatusMsg('Your browser does not support desktop alerts. Use this Alerts inbox instead.');
      return;
    }
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        window.localStorage.setItem(ENABLED_KEY, '1');
        setEnabled(true);
        setStatusMsg('Browser notifications enabled! Welcome alert sent.');

        // Mark currently loaded items as seen after welcoming so next new job/news fires cleanly
        const seen = loadIdSet(SEEN_OS_KEY);
        for (const it of items) seen.add(it.id);
        saveIdSet(SEEN_OS_KEY, seen);

        await showNativeNotification(
          'GovtJobs.pk Browser Alerts Enabled',
          'You will now receive new government job postings, official exam news, and daily MCQ challenges right in your browser.',
          '/jobs',
          'govtjobs-welcome-alert'
        );
      } else if (result === 'denied') {
        setEnabled(false);
        setStatusMsg(
          'Notifications are blocked in browser settings. Click the lock icon in your address bar to allow.'
        );
      }
    } catch {
      setStatusMsg('Could not request browser permission.');
    }
  };

  const handleSendTestAlert = async () => {
    const sample = items[0];
    await showNativeNotification(
      sample ? `GovtJobs.pk · ${sample.badge}` : 'GovtJobs.pk Live Alert',
      sample
        ? sample.title
        : 'Browser alerts are active — new government jobs & daily quizzes will notify you here.',
      sample?.url || '/forms/pension-papers',
      `govtjobs-test-${Date.now()}`
    );
    setStatusMsg('Test notification sent to your browser.');
  };

  const markAllRead = () => {
    const next = new Set(readIds);
    for (const it of items) next.add(it.id);
    setReadIds(next);
    saveIdSet(READ_INBOX_KEY, next);
  };

  const markOneRead = (id: string) => {
    const next = new Set(readIds);
    next.add(id);
    setReadIds(next);
    saveIdSet(READ_INBOX_KEY, next);
    setOpen(false);
  };

  const unreadCount = items.filter((it) => !readIds.has(it.id)).length;

  return (
    <div ref={panelRef} className="relative flex items-center gap-1.5 shrink-0">
      {supported && permission !== 'granted' && (
        <button
          type="button"
          onClick={handleEnableBrowserAlerts}
          className="px-2.5 py-0.5 rounded-full bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/50 text-sky-100 text-[11px] font-semibold transition-colors whitespace-nowrap"
        >
          Allow Alerts
        </button>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-100 text-[11px] font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap"
      >
        <span>Alerts</span>
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold tabular-nums">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed sm:absolute right-2 sm:right-0 top-10 sm:top-full sm:mt-2 w-[calc(100vw-1rem)] sm:w-[360px] max-w-[380px] bg-white text-slate-900 rounded-xl border border-slate-200 shadow-xl z-[120] overflow-hidden">
          <div className="px-4 py-3 bg-sky-50/80 border-b border-sky-100 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-slate-950">
                Live GovtJobs.pk Alerts &amp; Notifications
              </p>
              <p className="text-[11px] text-slate-600">
                {enabled
                  ? 'Browser alerts active — new jobs & daily quizzes notify automatically.'
                  : 'Allow browser alerts to get new job & exam updates immediately.'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="shrink-0 text-[11px] font-medium text-sky-800 hover:underline"
              >
                Mark read
              </button>
            )}
          </div>

          {/* Browser Permission Control Row */}
          <div className="px-4 py-2.5 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2">
            {permission === 'granted' ? (
              <>
                <span className="text-[11px] font-semibold text-emerald-700">
                  Browser Notifications: Allowed
                </span>
                <button
                  type="button"
                  onClick={handleSendTestAlert}
                  className="px-2.5 py-1 rounded-md border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-900 text-[11px] font-semibold transition-colors"
                >
                  Send Test Notification
                </button>
              </>
            ) : (
              <>
                <span className="text-[11px] text-slate-600">
                  {permission === 'denied'
                    ? 'Blocked in browser address bar'
                    : 'Get instant alerts in Chrome / Edge / Android'}
                </span>
                <button
                  type="button"
                  onClick={handleEnableBrowserAlerts}
                  className="px-2.5 py-1 rounded-md bg-sky-700 hover:bg-sky-800 text-white text-[11px] font-semibold transition-colors"
                >
                  Allow in Browser
                </button>
              </>
            )}
          </div>

          {statusMsg && (
            <div className="px-4 py-2 bg-slate-900 text-white text-[11px]">{statusMsg}</div>
          )}

          {/* Latest Alerts List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-slate-500">
                Loading latest jobs and notifications...
              </p>
            ) : (
              items.map((item) => {
                const unread = !readIds.has(item.id);
                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={() => markOneRead(item.id)}
                    className={`block px-4 py-2.5 hover:bg-sky-50/70 transition-colors ${
                      unread ? 'bg-sky-50/35' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          item.type === 'tool'
                            ? 'bg-amber-100 text-amber-900'
                            : item.type === 'daily'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-sky-100 text-sky-900'
                        }`}
                      >
                        {item.badge}
                      </span>
                      {unread && (
                        <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0" aria-label="Unread" />
                      )}
                    </div>
                    <p className="mt-1 text-xs font-semibold text-slate-900 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                      {item.body}
                    </p>
                  </Link>
                );
              })
            )}
          </div>

          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <Link
              href="/news"
              onClick={() => setOpen(false)}
              className="font-medium text-sky-800 hover:underline"
            >
              All Official News →
            </Link>
            <Link
              href="/jobs"
              onClick={() => setOpen(false)}
              className="font-medium text-slate-700 hover:text-slate-950"
            >
              Latest Jobs →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
