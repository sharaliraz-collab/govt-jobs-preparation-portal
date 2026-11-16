'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import MaterialCard from '@/components/MaterialCard';
import AdSlot from '@/components/AdSlot';
import Loader from '@/components/Loader';
import { SectionShareBar } from '@/components/ShareButtons';
import { Search, BookOpen, RefreshCw } from 'lucide-react';
import { IMaterial } from '@/lib/types';

export default function MaterialsPage() {
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const [materials, setMaterials] = useState<IMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');

  const subjects = [
    'General Knowledge',
    'English Grammar',
    'Islamiat',
    'Pakistan Studies',
    'Computer Science',
    'Mathematics & Intelligence',
    'Everyday Science',
    'Current Affairs'
  ];

  useEffect(() => {
    fetchMaterials();
  }, [subject]);

  const fetchMaterials = async (customSearch = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (customSearch.trim()) params.append('search', customSearch.trim());
      if (subject) params.append('subject', subject);

      const res = await axios.get(`/api/materials?${params.toString()}`);
      setMaterials(res.data);
    } catch (err) {
      console.error('Error loading test materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMaterials(search);
  };

  const handleClear = () => {
    setSearch('');
    setSubject('');
    fetchMaterials('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-govt-border pb-4">
        <h1 className={`text-2xl md:text-3xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
          {t('materials.title')}
        </h1>
        <p className="text-xs md:text-sm text-govt-muted mt-1">
          {t('materials.subtitle')}
        </p>
      </div>

      <SectionShareBar
        path="/materials"
        title="Solved Past Papers & Syllabus PDFs — FPSC, PPSC, SPSC & NTS"
        description="Download free solved past papers, official exam syllabi, and subject study notes on GovtJobs.pk."
        badge="Study Materials PDF"
      />

      {/* Filter bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-4 sm:p-5 rounded-2xl border border-govt-border shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative w-full md:w-1/2">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search material title, past paper..."
            className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-govt-emerald"
          />
        </div>

        <div className="w-full md:w-1/3">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            aria-label="Filter by subject"
            className="w-full px-3 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-govt-emerald bg-white"
          >
            <option value="">{t('materials.filterSubject')}</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs sm:text-sm text-govt-muted hover:text-govt-red font-semibold flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            type="submit"
            className="text-xs sm:text-sm bg-govt-emerald hover:bg-govt-emerald-dark text-white font-bold px-5 py-2.5 rounded-xl transition"
          >
            Search
          </button>
        </div>
      </form>

      <AdSlot format="horizontal" />

      {/* Materials List */}
      {loading ? (
        <Loader />
      ) : materials.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center border border-govt-border">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-govt-muted">{t('materials.noMaterials')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((mat) => (
            <MaterialCard key={mat._id} material={mat} />
          ))}
        </div>
      )}
    </div>
  );
}
