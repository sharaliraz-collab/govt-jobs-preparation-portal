'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Loader from '@/components/Loader';
import { Calendar, ArrowLeft, Pin } from 'lucide-react';
import { INews } from '@/lib/types';

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const [news, setNews] = useState<INews | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`/api/news/${id}`);
        setNews(res.data);
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) return <Loader />;
  if (!news) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-govt-red font-semibold">News announcement not found.</p>
        <Link href="/news" className="inline-block mt-3 text-xs bg-govt-emerald text-white px-4 py-2 rounded">
          Return to News Feed
        </Link>
      </div>
    );
  }

  const title = isUr && news.titleUr ? news.titleUr : news.titleEn;
  const body = isUr && news.bodyUr ? news.bodyUr : news.bodyEn;
  const dateFormatted = new Date(news.publishedAt || news.createdAt || Date.now()).toLocaleDateString(isUr ? 'ur-PK' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const jsonLdNews = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.titleEn,
    description: news.bodyEn ? news.bodyEn.substring(0, 160) : news.titleEn,
    datePublished: news.publishedAt || news.createdAt || new Date().toISOString(),
    dateModified: news.updatedAt || news.createdAt || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'GovtJobs.pk Editorial Team',
      url: 'https://govtjobs.pk',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GovtJobs.pk',
      logo: {
        '@type': 'ImageObject',
        url: 'https://govtjobs.pk/logo.png',
      },
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdNews) }}
      />
      <Link href="/news" className="inline-flex items-center gap-1 text-xs font-bold text-govt-emerald hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>{t('news.title')}</span>
      </Link>

      <article className="bg-white rounded-xl border border-govt-border p-6 md:p-8 shadow-sm space-y-6">
        <div className="space-y-3 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded">
              {news.category}
            </span>
            {news.pinned && (
              <span className="text-xs font-bold bg-yellow-100 text-yellow-900 border border-yellow-300 px-2.5 py-1 rounded flex items-center gap-1">
                <Pin className="w-3.5 h-3.5 fill-current text-yellow-700" />
                PINNED
              </span>
            )}
          </div>

          <h1 className={`text-xl md:text-3xl font-extrabold text-govt-charcoal leading-tight ${isUr ? 'font-urdu' : ''}`}>
            {title}
          </h1>

          <div className="flex items-center gap-1 text-xs text-govt-muted">
            <Calendar className="w-4 h-4 text-govt-emerald" />
            <span>{t('news.publishedOn')}: {dateFormatted}</span>
          </div>
        </div>

        {news.coverImage && (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <img src={news.coverImage.startsWith('/uploads') ? news.coverImage : `/uploads/${news.coverImage}`} alt={title} className="w-full h-auto max-h-96 object-cover" />
          </div>
        )}

        <div className={`text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-line ${isUr ? 'font-urdu' : ''}`}>
          {body}
        </div>
      </article>
    </div>
  );
}
