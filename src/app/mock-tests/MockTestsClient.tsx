'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import NewsCard from '@/components/NewsCard';
import Loader from '@/components/Loader';
import PoliceConstableMockTest from '@/components/PoliceConstableMockTest';
import { Search, FileCheck, Shield, Sparkles, Award, Clock } from 'lucide-react';
import { INews } from '@/lib/types';

export default function MockTestsClient() {
  const { i18n } = useTranslation();
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
      console.error('Error fetching mock papers:', err);
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
            ← Back to All Mock Tests
          </button>
        </div>
        <PoliceConstableMockTest onClose={() => setShowPoliceMock(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner - Mock Tests */}
      <div className="border-b border-govt-border pb-4">
        <h1 className={`text-2xl md:text-3xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
          {isUr ? 'ماک ٹیسٹ و مشقی پرچا جات' : 'Mock Tests'}
        </h1>
        <p className="text-xs md:text-sm text-govt-muted mt-1">
          {isUr
            ? 'سرکاری ملازمتی امتحانات، سندھ پولیس، منسٽري آف ڊيفينس ۽ اينٽري ٽيسٽ جا آن لائن مڪمل ماڪ ٽيسٽ ڏيو'
            : 'Practice full-length recruitment mock tests, official model papers, and solved entry test exam papers.'}
        </p>
      </div>

      {/* FEATURED MOCK TESTS GRID MATRIX — 6 PREMIUM CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
              Featured Official Mock Tests (6 Master Papers)
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline-block">
            6 Full-Length Practice Exams Available
          </span>
        </div>

        {/* 6 CARDS GRID MATRIX (3 Columns Desktop, 2 Columns Tablet, 1 Column Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* CARD 1: Police Constable (BPS-07) */}
          <div className="relative overflow-hidden rounded-3xl border border-indigo-900/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, #0B2545 0%, #133A6F 60%, #1C4D8D 100%)' }}>
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="p-6 space-y-4 text-white relative z-10">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  <Shield className="w-3 h-3 text-amber-300" />
                  Sindh Police
                </span>
                <span className="bg-white/10 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/15">
                  STS SIBA Pattern
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white leading-snug">
                  Police Constable (BPS-07)
                </h3>
                <p className="text-xs text-slate-200 mt-1.5 line-clamp-3 leading-relaxed">
                  100-Question Written Practice Exam aligned to SIBA Testing Services (STS): English (10%), Sindhi (20%), Maths (20%), GK/IQ (20%), Reasoning (30%).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-200 pt-1">
                <div className="flex items-center gap-1 text-amber-300">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>100 MCQs</span>
                </div>
                <div className="flex items-center gap-1 text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>80 Minutes</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 relative z-10 space-y-2">
              <Link
                href="/mock-papers/police-constable"
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950 group-hover:rotate-12 transition transform" />
                <span>Start Police Constable Test →</span>
              </Link>
              <Link
                href="/mock-papers/police-constable"
                className="w-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold py-1.5 rounded-lg border border-white/15 transition flex items-center justify-center gap-1"
              >
                <span>🔗 Open Direct Link / Share</span>
              </Link>
            </div>
          </div>

          {/* CARD 2: Ministry of Defence (MOD) */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-900/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, #1a3c5e 0%, #0d6b3e 60%, #1a3c5e 100%)' }}>
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="p-6 space-y-4 text-white relative z-10">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  <Shield className="w-3 h-3 text-amber-300" />
                  Federal Defence
                </span>
                <span className="bg-white/10 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/15">
                  Past Papers Syllabus
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white leading-snug">
                  🇵🇰 Ministry of Defence (MOD)
                </h3>
                <p className="text-xs text-slate-200 mt-1.5 line-clamp-3 leading-relaxed">
                  Full-length 100-Question Written Practice Exam covering English, Pak Studies, Islamiat, GK/Current Affairs, Everyday Science &amp; Mathematics (25 MCQs per page).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-200 pt-1">
                <div className="flex items-center gap-1 text-amber-300">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>100 MCQs (4 Pages)</span>
                </div>
                <div className="flex items-center gap-1 text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>90 Minutes</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 relative z-10 space-y-2">
              <Link
                href="/mock-papers/ministry-of-defence"
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950 group-hover:rotate-12 transition transform" />
                <span>Start MOD Mock Test →</span>
              </Link>
              <Link
                href="/mock-papers/ministry-of-defence"
                className="w-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold py-1.5 rounded-lg border border-white/15 transition flex items-center justify-center gap-1"
              >
                <span>🔗 Open Direct Link / Share</span>
              </Link>
            </div>
          </div>

          {/* CARD 3: SPSC Town Officer & BMO (BPS-16/17) */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-900/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, #3b0764 0%, #581c87 60%, #3b0764 100%)' }}>
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="p-6 space-y-4 text-white relative z-10">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  <Award className="w-3 h-3 text-amber-300" />
                  SPSC Written Test
                </span>
                <span className="bg-white/10 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/15">
                  BPS-16/17 Cadre
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white leading-snug">
                  SPSC Town Officer &amp; BMO
                </h3>
                <p className="text-xs text-slate-200 mt-1.5 line-clamp-3 leading-relaxed">
                  Sindh Public Service Commission written exam model paper covering Municipal Law, Pakistan Affairs, General Knowledge, and Current Affairs.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-200 pt-1">
                <div className="flex items-center gap-1 text-amber-300">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>100 MCQs</span>
                </div>
                <div className="flex items-center gap-1 text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>90 Minutes</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 relative z-10 space-y-2">
              <Link
                href="/quizzes/world-info"
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950 group-hover:rotate-12 transition transform" />
                <span>Start SPSC Town Officer Test →</span>
              </Link>
              <Link
                href="/quizzes/world-info"
                className="w-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold py-1.5 rounded-lg border border-white/15 transition flex items-center justify-center gap-1"
              >
                <span>🔗 Open Direct Link / Share</span>
              </Link>
            </div>
          </div>

          {/* CARD 4: FPSC Assistant Director (BPS-17) */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)' }}>
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="p-6 space-y-4 text-white relative z-10">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  <Shield className="w-3 h-3 text-amber-300" />
                  FPSC Federal Exam
                </span>
                <span className="bg-white/10 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/15">
                  BPS-17 Officer
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white leading-snug">
                  FPSC Assistant Director (BPS-17)
                </h3>
                <p className="text-xs text-slate-200 mt-1.5 line-clamp-3 leading-relaxed">
                  Federal Public Service Commission screening test covering English Vocabulary, Grammar, Basic Arithmetic, Everyday Science &amp; Current Affairs.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-200 pt-1">
                <div className="flex items-center gap-1 text-amber-300">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>100 MCQs</span>
                </div>
                <div className="flex items-center gap-1 text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>100 Minutes</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 relative z-10 space-y-2">
              <Link
                href="/quizzes/english-grammar"
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950 group-hover:rotate-12 transition transform" />
                <span>Start FPSC AD Test →</span>
              </Link>
              <Link
                href="/quizzes/english-grammar"
                className="w-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold py-1.5 rounded-lg border border-white/15 transition flex items-center justify-center gap-1"
              >
                <span>🔗 Open Direct Link / Share</span>
              </Link>
            </div>
          </div>

          {/* CARD 5: PST & JEST School Teacher (BPS-14) */}
          <div className="relative overflow-hidden rounded-3xl border border-teal-900/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, #042f2e 0%, #0f766e 60%, #042f2e 100%)' }}>
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="p-6 space-y-4 text-white relative z-10">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  <Award className="w-3 h-3 text-amber-300" />
                  School Education Dept
                </span>
                <span className="bg-white/10 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/15">
                  PST &amp; JEST (BPS-14)
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white leading-snug">
                  PST &amp; JEST Teacher Test
                </h3>
                <p className="text-xs text-slate-200 mt-1.5 line-clamp-3 leading-relaxed">
                  School Education Department written test paper covering Pedagogy, Elementary General Science, Mathematics, Social Studies &amp; English.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-200 pt-1">
                <div className="flex items-center gap-1 text-amber-300">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>100 MCQs</span>
                </div>
                <div className="flex items-center gap-1 text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>90 Minutes</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 relative z-10 space-y-2">
              <Link
                href="/quizzes/physics"
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950 group-hover:rotate-12 transition transform" />
                <span>Start PST &amp; JEST Test →</span>
              </Link>
              <Link
                href="/quizzes/physics"
                className="w-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold py-1.5 rounded-lg border border-white/15 transition flex items-center justify-center gap-1"
              >
                <span>🔗 Open Direct Link / Share</span>
              </Link>
            </div>
          </div>

          {/* CARD 6: Islamic Studies & Pak Affairs Solved Bank */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-950/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, #0b3d2e 0%, #125c43 60%, #0b3d2e 100%)' }}>
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="p-6 space-y-4 text-white relative z-10">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  <Shield className="w-3 h-3 text-amber-300" />
                  Islamic Studies Bank
                </span>
                <span className="bg-white/10 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/15">
                  9 Categories
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white leading-snug">
                  🕌 Islamic Studies (اسلاميات)
                </h3>
                <p className="text-xs text-slate-200 mt-1.5 line-clamp-3 leading-relaxed">
                  Comprehensive 164 Solved MCQs Bank covering Aqaid, Quran, Hadith, Seerah, Khulafa-e-Rashideen, History &amp; Fiqh with Sindhi language toggle.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-200 pt-1">
                <div className="flex items-center gap-1 text-amber-300">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>164 MCQs</span>
                </div>
                <div className="flex items-center gap-1 text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Untimed Practice</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 relative z-10 space-y-2">
              <Link
                href="/quizzes/islamic-studies"
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950 group-hover:rotate-12 transition transform" />
                <span>Start Islamic Studies Test →</span>
              </Link>
              <Link
                href="/quizzes/islamic-studies"
                className="w-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold py-1.5 rounded-lg border border-white/15 transition flex items-center justify-center gap-1"
              >
                <span>🔗 Open Direct Link / Share</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Search and Filters */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-xl border border-govt-border shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:w-1/2">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mock tests, exam gazettes..."
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
          <p className="text-sm text-govt-muted">No additional mock tests found.</p>
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
