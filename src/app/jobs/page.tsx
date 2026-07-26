'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import JobCard from '@/components/JobCard';
import Loader from '@/components/Loader';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { IJob } from '@/lib/types';

export const dynamic = 'force-dynamic';

function JobsContent() {
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isUr = i18n.language === 'ur';

  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const categories = ['Federal', 'Provincial', 'Education', 'Police', 'Health', 'Revenue', 'Judiciary', 'General'];
  const locations = ['Islamabad', 'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'AJ&K'];

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const queryStr = searchParams.toString();
      const res = await axios.get(`/api/jobs?${queryStr}`);
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    if (status) params.set('status', status);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setLocation('');
    setStatus('');
    router.push('/jobs');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-govt-border pb-4">
        <h1 className={`text-2xl md:text-3xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
          {t('jobs.title')}
        </h1>
        <p className="text-xs md:text-sm text-govt-muted mt-1">
          {t('jobs.subtitle')}
        </p>
      </div>

      {/* Filter Toolbar */}
      <form onSubmit={handleApplyFilters} className="bg-white p-4 rounded-xl border border-govt-border shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Title, department..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-govt-emerald"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-govt-emerald bg-white"
          >
            <option value="">{t('jobs.filterCategory')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Location Dropdown */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-govt-emerald bg-white"
          >
            <option value="">{t('jobs.filterLocation')}</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-govt-emerald bg-white"
          >
            <option value="">{t('jobs.filterStatus')}</option>
            <option value="open">{t('jobs.statusOpen')}</option>
            <option value="closing_soon">{t('jobs.statusClosing')}</option>
            <option value="closed">{t('jobs.statusClosed')}</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs text-govt-muted hover:text-govt-red font-medium flex items-center gap-1 px-3 py-1.5 rounded transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t('common.clearFilters')}
          </button>

          <button
            type="submit"
            className="text-xs bg-govt-emerald hover:bg-govt-emerald-dark text-white font-bold px-4 py-1.5 rounded-lg transition flex items-center gap-1 shadow-sm"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Apply Filters</span>
          </button>
        </div>
      </form>

      {/* Jobs Grid */}
      {loading ? (
        <Loader />
      ) : jobs.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center border border-govt-border space-y-3">
          <p className="text-sm font-semibold text-govt-charcoal">{t('jobs.noJobs')}</p>
          <button
            onClick={handleClearFilters}
            className="text-xs bg-govt-emerald text-white px-4 py-2 rounded-lg font-bold hover:bg-govt-emerald-dark"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <JobsContent />
    </Suspense>
  );
}
