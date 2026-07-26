'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Calendar, Pin, ArrowRight, ArrowLeft } from 'lucide-react';
import { INews } from '@/lib/types';

interface NewsCardProps {
  news: INews;
}

const categoryColors: Record<string, string> = {
  'Exam Schedule': 'bg-blue-50 text-blue-700 border-blue-200',
  'Result': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Policy Update': 'bg-purple-50 text-purple-700 border-purple-200',
  'Syllabus Update': 'bg-amber-50 text-amber-700 border-amber-200',
  'General': 'bg-slate-50 text-slate-600 border-slate-200',
};

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const title = isUr && news.titleUr ? news.titleUr : news.titleEn;
  const body = isUr && news.bodyUr ? news.bodyUr : news.bodyEn;
  const dateFormatted = new Date(news.publishedAt || news.createdAt || Date.now()).toLocaleDateString(isUr ? 'ur-PK' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const catStyle = categoryColors[news.category] || categoryColors['General'];

  return (
    <article
      className={`card-premium p-5 flex flex-col justify-between ${
        news.pinned ? 'border-l-4 border-l-govt-gold ring-1 ring-govt-gold/10' : ''
      }`}
      id={`news-card-${news._id}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3 text-xs">
          <span className={`font-bold px-2.5 py-1 rounded-full border ${catStyle}`}>
            {news.category}
          </span>
          {news.pinned && (
            <span className="flex items-center gap-1 text-yellow-700 font-bold bg-govt-gold-light px-2.5 py-1 rounded-full border border-yellow-300">
              <Pin className="w-3 h-3 fill-current" />
              {t('news.pinned')}
            </span>
          )}
        </div>

        <Link href={`/news/${news._id}`} className="block group">
          <h3 className={`text-base font-bold text-govt-charcoal group-hover:text-govt-emerald transition-colors duration-200 line-clamp-2 ${isUr ? 'font-urdu' : ''}`}>
            {title}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 mt-2.5 line-clamp-3 leading-relaxed">
          {body}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-govt-muted">
        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium">{dateFormatted}</span>
        </div>

        <Link
          href={`/news/${news._id}`}
          className="text-govt-emerald font-bold hover:text-govt-emerald-dark flex items-center gap-1.5 transition-colors duration-200"
        >
          <span>{t('news.readMore')}</span>
          {isUr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </Link>
      </div>
    </article>
  );
};

export default NewsCard;
