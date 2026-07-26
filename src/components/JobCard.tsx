'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import SealBadge from './SealBadge';
import { MapPin, Building2, Calendar, Bookmark, BookmarkCheck, FileText, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { IJob } from '@/lib/types';

interface JobCardProps {
  job: IJob;
  onSaveToggle?: (jobId: string) => void;
}

const statusBorderColor: Record<string, string> = {
  open: 'border-l-govt-emerald',
  closing_soon: 'border-l-amber-500',
  closed: 'border-l-govt-red',
};

const JobCard: React.FC<JobCardProps> = ({ job, onSaveToggle }) => {
  const { t, i18n } = useTranslation();
  const { user, token, toggleSaveJobInState } = useAuth();
  const isUr = i18n.language === 'ur';

  const isSaved = user?.savedJobs?.some((id: any) => (typeof id === 'string' ? id === job._id : id._id === job._id));

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to save jobs to your account history.');
      return;
    }

    try {
      await axios.post(`/api/jobs/${job._id}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toggleSaveJobInState(job._id);
      if (onSaveToggle) onSaveToggle(job._id);
    } catch (err) {
      console.error('Error saving job:', err);
    }
  };

  const title = isUr && job.titleUr ? job.titleUr : job.titleEn;
  const description = isUr && job.descriptionUr ? job.descriptionUr : job.descriptionEn;
  const deadlineFormatted = job.deadline ? new Date(job.deadline).toLocaleDateString(isUr ? 'ur-PK' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'N/A';

  const borderClass = statusBorderColor[job.status] || 'border-l-govt-emerald';

  return (
    <div
      className={`card-premium border-l-4 ${borderClass} p-5 flex flex-col justify-between group`}
      id={`job-card-${job._id}`}
    >
      {/* Header Info */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <SealBadge status={job.status ? job.status.replace('_', ' ') : 'OPEN'} type={job.status} />
            {job.featured && <SealBadge status="FEATURED" type="featured" />}
            <span className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full font-semibold border border-slate-200">
              {job.category}
            </span>
          </div>

          <button
            onClick={handleSave}
            title={isSaved ? t('jobs.unsaveJob') : t('jobs.saveJob')}
            aria-label={isSaved ? 'Remove from saved jobs' : 'Save this job'}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isSaved
                ? 'text-govt-gold bg-govt-gold-light shadow-sm'
                : 'text-gray-300 hover:text-govt-emerald hover:bg-govt-emerald-light'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>

        {/* Title */}
        <Link href={`/jobs/${job._id}`} className="block group/title">
          <h3 className={`text-base font-bold text-govt-charcoal group-hover/title:text-govt-emerald transition-colors duration-200 line-clamp-2 ${isUr ? 'font-urdu' : ''}`}>
            {title}
          </h3>
        </Link>

        {/* Department & Location */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-govt-muted">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-govt-emerald/70" />
            <span className="font-semibold">{job.department}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-govt-emerald/70" />
            <span>{job.location}</span>
          </div>
          {job.vacancies > 0 && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-govt-emerald/70" />
              <span>{job.vacancies} {job.vacancies === 1 ? 'Post' : 'Posts'}</span>
            </div>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-govt-red font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>{t('jobs.deadline')}: {deadlineFormatted}</span>
        </div>

        <Link
          href={`/jobs/${job._id}`}
          className="text-xs bg-govt-emerald hover:bg-govt-emerald-dark text-white px-3.5 py-2 rounded-lg font-bold transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md group-hover:shadow-glow-emerald"
          id={`apply-btn-${job._id}`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t('jobs.applyDetails')}</span>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
