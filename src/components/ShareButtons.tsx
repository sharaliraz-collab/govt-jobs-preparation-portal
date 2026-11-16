'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Send,
  Link2,
  Check,
  Sparkles,
  Globe,
  X
} from 'lucide-react';
import { SITE_URL } from '@/lib/seo';

export interface ShareButtonsProps {
  url?: string;
  title: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

function resolveFullUrl(url?: string): string {
  if (typeof window !== 'undefined') {
    if (!url) return window.location.href;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const origin = window.location.origin || SITE_URL;
    return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
  }
  if (!url) return SITE_URL;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

export default function ShareButtons({
  url,
  title,
  description = '',
  className = '',
  compact = false,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState(() => resolveFullUrl(url));

  useEffect(() => {
    setFullUrl(resolveFullUrl(url));
  }, [url]);

  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(
    `${title}${description ? `\n\n${description}` : ''}\n\n🔗 `
  );

  const shareLinks = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodedText}${encodedUrl}`,
      icon: MessageCircle,
      color: 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-emerald-600',
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
      color: 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-blue-600',
    },
    {
      label: 'Twitter / X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: Twitter,
      color: 'hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 text-sky-600',
    },
    {
      label: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Send,
      color: 'hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-300 text-cyan-600',
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
      color: 'hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-indigo-600',
    },
  ];

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* fallback */
    }
  };

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: description || title, url: fullUrl });
      } catch {
        /* user cancelled */
      }
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {!compact && (
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
          <Share2 className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.25} />
          <span>Share:</span>
        </span>
      )}

      {shareLinks.map(({ label, href, icon: Icon, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Share on ${label}`}
          title={`Share on ${label}`}
          className={`p-2 rounded-xl border border-slate-200/90 bg-white transition-all shadow-2xs ${color}`}
        >
          <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />
        </a>
      ))}

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link"
        title="Copy link"
        className={`px-2.5 py-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold shadow-2xs ${
          copied
            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
            : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.25} />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Link2 className="w-3.5 h-3.5 text-slate-500" strokeWidth={2.25} />
            {!compact && <span>Copy Link</span>}
          </>
        )}
      </button>

      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="px-2.5 py-2 rounded-xl border border-slate-200/90 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition shadow-2xs"
        >
          More
        </button>
      )}
    </div>
  );
}

/* ─── Compact Quick-Share Button & Popover for Any List Item / Card ─── */

export interface QuickShareButtonProps {
  path: string;
  title: string;
  description?: string;
  badge?: string;
}

export function QuickShareButton({
  path,
  title,
  description = 'Practice solved MCQs and access official career updates on GovtJobs.pk.',
  badge = 'GovtJobs.pk',
}: QuickShareButtonProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const fullUrl = resolveFullUrl(path);

  return (
    <div ref={wrapperRef} className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label={`Share ${title}`}
        title={`Share ${title}`}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200/90 hover:border-emerald-300 transition-colors"
      >
        <Share2 className="w-3 h-3 text-emerald-600" strokeWidth={2.25} />
        <span>Share</span>
      </button>

      {open && (
        <div
          style={{ backgroundColor: '#ffffff' }}
          className="absolute right-0 bottom-full mb-2 w-72 sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3.5 z-50 text-left space-y-2.5"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* Social Preview Card Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <Globe className="w-2.5 h-2.5" />
                {badge}
              </span>
              <p className="text-xs font-extrabold text-slate-900 mt-1 line-clamp-1">{title}</p>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{description}</p>
              <p className="text-[10px] text-emerald-700 font-medium truncate mt-1">{fullUrl}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0"
              aria-label="Close share menu"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <ShareButtons url={fullUrl} title={title} description={description} compact />
        </div>
      )}
    </div>
  );
}

/* ─── Full-Width Section Social Share & Metadata Preview Banner ─── */

export interface SectionShareBarProps {
  path: string;
  title: string;
  description: string;
  badge?: string;
}

export function SectionShareBar({
  path,
  title,
  description,
  badge = 'Official Social Link Preview',
}: SectionShareBarProps) {
  const [fullUrl, setFullUrl] = useState(() => resolveFullUrl(path));

  useEffect(() => {
    setFullUrl(resolveFullUrl(path));
  }, [path]);

  return (
    <div className="bg-gradient-to-r from-white via-emerald-50/40 to-amber-50/30 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs no-print">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Live Social Metadata Preview Box */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-black text-xs shrink-0 shadow-2xs">
            GJ
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-white text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" strokeWidth={2.25} />
                {badge}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 truncate">{fullUrl}</span>
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">{title}</h3>
            <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-1">{description}</p>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="shrink-0">
          <ShareButtons url={fullUrl} title={title} description={description} />
        </div>
      </div>
    </div>
  );
}
