'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import NewsCard from '@/components/NewsCard';
import Loader from '@/components/Loader';
import PoliceConstableMockTest from '@/components/PoliceConstableMockTest';
import { Search, FileCheck, Shield, Sparkles, X, Award, Clock } from 'lucide-react';
import { INews } from '@/lib/types';

export default function NewsPage() {
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const [news, setNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [showPoliceMock, setShowPoliceMock] = useState(false);

  const categories = ['Result', 'Notification', 'Deadline Extension', 'General'];

  useEffect(() => {
    fetchNews();
  }, [category]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search.trim()) params.append('search', search.trim());

      const res = await axios.get(`/api/news?${params.toString()}`);
      setNews(res.data);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews();
  };

  if (showPoliceMock) {
    return (
      <div className="py-4">
        <div className="max-w-5xl mx-auto px-4 mb-4 flex justify-between items-center">
          <button
            onClick={() => setShowPoliceMock(false)}
            className="text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
          >
            ← Back to All Mock Papers
          </button>
        </div>
        <PoliceConstableMockTest onClose={() => setShowPoliceMock(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner - Mock Papers */}
      <div className="border-b border-govt-border pb-4">
        <h1 className={`text-2xl md:text-3xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
          {isUr ? 'ماک پیپرز و مشقی پرچا جات' : 'Mock Papers'}
        </h1>
        <p className="text-xs md:text-sm text-govt-muted mt-1">
          {isUr
            ? 'سرکاری ملازمتی امتحانات، سندھ پولیس اور اینٹری ٹیسٹ کے آن لائن مکمل ماک پیپرز دیں'
            : 'Practice full-length recruitment mock papers, written test practice sets, and solved exam papers.'}
        </p>
      </div>

      {/* FEATURED SOFT GRADIENT CARD: Police Constable Mock Paper */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-900/40 shadow-xl transition-all duration-300 hover:shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #0B2545 0%, #133A6F 45%, #1C4D8D 85%, #0B2545 100%)'
        }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full opacity-20 bg-amber-400 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10 bg-cyan-400 blur-2xl" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-white">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                <Shield className="w-3.5 h-3.5 text-amber-300" />
                Featured Official Written Test
              </span>
              <span className="bg-white/10 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/15">
                STS SIBA Pattern
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Police Constable (BPS-07) — Mock Paper
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Complete 100-Question Written Practice Exam aligned to SIBA Testing Services (STS) Matriculation Level Syllabus: English (10%), Sindhi (20%), Mathematics (20%), Gen. Awareness/IQ (20%), Reasoning (30%).
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 text-amber-300">
                <FileCheck className="w-4 h-4" />
                <span>100 MCQs (20 per page)</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <Clock className="w-4 h-4" />
                <span>80 Minutes</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <Award className="w-4 h-4" />
                <span>Instant Grading &amp; Section Breakdown</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 shrink-0 justify-center">
            <Link
              href="/mock-papers/police-constable"
              className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs sm:text-sm font-black px-7 py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition transform" />
              <span>Start Police Constable Mock Test →</span>
            </Link>
            <Link
              href="/mock-papers/police-constable"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl border border-white/20 transition flex items-center justify-center gap-1.5"
            >
              <span>🔗 Open Direct Link / Share Paper</span>
            </Link>
            <span className="text-[10px] text-slate-300 text-center font-medium">Free Access · Optimized for WhatsApp &amp; Social Share</span>
          </div>
        </div>

        <div style={{ height: 4, background: 'repeating-linear-gradient(90deg, #C9A227 0 20px, transparent 20px 40px)' }} />
      </div>

      {/* FEATURED SOFT GRADIENT CARD: Ministry of Defence (MOD) Mock Paper */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-900/40 shadow-xl transition-all duration-300 hover:shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #1a3c5e 0%, #0d6b3e 60%, #1a3c5e 100%)'
        }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full opacity-20 bg-amber-400 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10 bg-emerald-400 blur-2xl" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-white">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                <Shield className="w-3.5 h-3.5 text-amber-300" />
                Featured Federal Defence Exam
              </span>
              <span className="bg-white/10 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/15">
                Past Papers Syllabus
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              🇵🇰 Ministry of Defence (MOD) — Mock Test
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Full-length 100-Question Written Practice Exam covering English (20), Pakistan Studies (20), Islamiat (15), General Knowledge &amp; Current Affairs (15), Everyday Science (15), and Mathematics (15).
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 text-amber-300">
                <FileCheck className="w-4 h-4" />
                <span>100 MCQs (6 Sections)</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <Clock className="w-4 h-4" />
                <span>90 Minutes Timer</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <Award className="w-4 h-4" />
                <span>Instant Grading &amp; Review Key</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 shrink-0 justify-center">
            <Link
              href="/mock-papers/ministry-of-defence"
              className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs sm:text-sm font-black px-7 py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition transform" />
              <span>Start Ministry of Defence Mock Test →</span>
            </Link>
            <Link
              href="/mock-papers/ministry-of-defence"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl border border-white/20 transition flex items-center justify-center gap-1.5"
            >
              <span>🔗 Open Direct Link / Share Paper</span>
            </Link>
            <span className="text-[10px] text-slate-300 text-center font-medium">Free Access · Optimized for WhatsApp &amp; Social Share</span>
          </div>
        </div>

        <div style={{ height: 4, background: 'repeating-linear-gradient(90deg, #0d6b3e 0 20px, transparent 20px 40px)' }} />
      </div>

      {/* Search and Filters */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-xl border border-govt-border shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:w-1/2">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mock papers, exam gazettes..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-govt-emerald"
          />
        </div>

        <div className="w-full md:w-1/3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-govt-emerald bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-govt-emerald hover:bg-govt-emerald-dark text-white text-xs font-bold px-5 py-2 rounded-lg transition"
        >
          Search
        </button>
      </form>

      {/* News Feed / Mock Papers List */}
      {loading ? (
        <Loader />
      ) : news.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center border border-govt-border">
          <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-govt-muted">No additional mock papers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item) => (
            <NewsCard key={item._id || item.id} news={item} />
          ))}
        </div>
      )}
    </div>
  );
}
