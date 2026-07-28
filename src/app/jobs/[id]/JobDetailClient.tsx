'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Loader from '@/components/Loader';
import SealBadge from '@/components/SealBadge';
import ShareButtons from '@/components/ShareButtons';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  MapPin,
  Calendar,
  GraduationCap,
  Users,
  FileDown,
  Bookmark,
  BookmarkCheck,
  ArrowLeft
} from 'lucide-react';
import { IJob } from '@/lib/types';
import { absoluteUrl } from '@/lib/seo';

export default function JobDetailClient({ id, initialJob }: { id: string; initialJob?: IJob | null }) {
  const { t, i18n } = useTranslation();
  const { user, token, toggleSaveJobInState } = useAuth();
  const isUr = i18n.language === 'ur';

  const [job, setJob] = useState<IJob | null>(initialJob || null);
  const [loading, setLoading] = useState(!initialJob);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialJob) return;
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/api/jobs/${id}`);
        setJob(res.data);
      } catch {
        setError('Failed to load job posting details.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, initialJob]);

  if (loading) return <Loader />;
  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-red-600 font-semibold">{error || 'Job posting not found.'}</p>
        <Link href="/jobs" className="inline-block text-xs bg-govt-emerald text-white px-4 py-2 rounded font-bold">
          ← Return to All Jobs
        </Link>
      </div>
    );
  }

  const isSaved = user?.savedJobs?.some((savedId: string | IJob) =>
    typeof savedId === 'string' ? savedId === job._id : savedId._id === job._id
  );

  const handleSaveToggle = async () => {
    if (!user) {
      alert('Please log in to save jobs.');
      return;
    }
    try {
      await axios.post(`/api/jobs/${job._id}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toggleSaveJobInState(job._id);
    } catch (err) {
      console.error('Error toggling save job:', err);
    }
  };

  const title = isUr && job.titleUr ? job.titleUr : job.titleEn;
  const description = isUr && job.descriptionUr ? job.descriptionUr : job.descriptionEn;
  const shareTitle = isUr && job.titleUr ? job.titleUr : job.titleEn;
  const shareDescription = `${job.department} · ${job.location} · ${job.vacancies} vacancies · Apply by ${new Date(job.deadline).toLocaleDateString('en-PK')}`;
  const shareUrl = absoluteUrl(`/jobs/${job._id}`);

  const deadlineFormatted = new Date(job.deadline).toLocaleDateString(isUr ? 'ur-PK' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const jsonLdJob = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.titleEn,
    description: job.descriptionEn || job.titleEn,
    identifier: {
      '@type': 'PropertyValue',
      name: job.department,
      value: job._id,
    },
    datePosted: job.createdAt || new Date().toISOString(),
    validThrough: job.deadline,
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.department,
      sameAs: absoluteUrl('/'),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'PK',
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdJob) }}
      />
      <Link href="/jobs" className="inline-flex items-center gap-1 text-xs font-bold text-govt-emerald hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>{t('jobs.title')}</span>
      </Link>

      <div className="bg-white rounded-xl border border-govt-border p-6 md:p-8 shadow-sm space-y-6">
        <div className="space-y-3 border-b border-govt-border pb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <SealBadge status={job.status ? job.status.replace('_', ' ') : 'OPEN'} type={job.status} />
            {job.featured && <SealBadge status="FEATURED" type="featured" />}
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-md font-semibold">
              {job.category}
            </span>
          </div>

          <h1 className={`text-xl md:text-3xl font-extrabold text-govt-charcoal leading-tight ${isUr ? 'font-urdu' : ''}`}>
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs md:text-sm text-govt-muted pt-1">
            <div className="flex items-center gap-1.5 font-medium text-govt-emerald">
              <Building2 className="w-4 h-4" />
              <span>{job.department}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-govt-emerald" />
              <span>{job.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-govt-bg p-4 rounded-xl border border-govt-border text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-lg border border-gray-200 text-govt-emerald">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-gray-500 font-medium">{t('jobs.vacancies')}</p>
              <p className="font-bold text-govt-charcoal text-sm">{job.vacancies} Positions</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-lg border border-gray-200 text-govt-emerald">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-gray-500 font-medium">{t('jobs.qualification')}</p>
              <p className="font-bold text-govt-charcoal text-sm">{job.qualification}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-lg border border-gray-200 text-govt-red">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-gray-500 font-medium">{t('jobs.deadline')}</p>
              <p className="font-bold text-govt-red text-sm">{deadlineFormatted}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-govt-charcoal border-b border-gray-200 pb-2">
            Job Description & Requirements
          </h2>
          <div className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {description}
          </div>
        </div>

        {job.source && (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div>
              <span className="font-bold">Official Publication Source: </span>
              <span>{job.source}</span>
            </div>
          </div>
        )}

        <ShareButtons
          url={shareUrl}
          title={shareTitle}
          description={shareDescription}
          className="pt-2 border-t border-govt-border"
        />

        <div className="pt-4 border-t border-govt-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToggle}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                isSaved
                  ? 'bg-yellow-50 text-yellow-800 border-yellow-400'
                  : 'bg-white text-govt-charcoal border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-govt-gold fill-current" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? t('jobs.saved') : t('jobs.saveJob')}</span>
            </button>
          </div>

          {job.adFile && (
            <a
              href={job.adFile.startsWith('/uploads') ? job.adFile : `/uploads/${job.adFile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-govt-emerald hover:bg-govt-emerald-dark text-white px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-md"
            >
              <FileDown className="w-4 h-4" />
              <span>{t('jobs.downloadAd')}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
