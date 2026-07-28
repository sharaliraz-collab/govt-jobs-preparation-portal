'use client';

import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Link2, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export default function ShareButtons({ url, title, description = '', className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${title}${description ? ` — ${description}` : ''}`);

  const shareLinks = [
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
      color: 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300',
    },
    {
      label: 'Twitter / X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: Twitter,
      color: 'hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300',
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      icon: MessageCircle,
      color: 'hover:bg-green-50 hover:text-green-700 hover:border-green-300',
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
      color: 'hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300',
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy link. Please copy manually: ' + url);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description || title, url });
      } catch {
        /* user cancelled */
      }
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs font-semibold text-govt-muted flex items-center gap-1 mr-1">
        <Share2 className="w-3.5 h-3.5" />
        Share:
      </span>

      {shareLinks.map(({ label, href, icon: Icon, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          title={label}
          className={`p-2 rounded-lg border border-gray-200 bg-white text-govt-muted transition ${color}`}
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}

      <button
        onClick={handleCopy}
        aria-label="Copy link"
        title="Copy link"
        className={`p-2 rounded-lg border transition flex items-center gap-1 text-xs font-semibold ${
          copied
            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
            : 'bg-white text-govt-muted border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }`}
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </button>

      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-govt-muted hover:bg-gray-50 transition"
        >
          More
        </button>
      )}
    </div>
  );
}
