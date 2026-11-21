'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import FormCard from '@/components/FormCard';
import Loader from '@/components/Loader';
import { SectionShareBar } from '@/components/ShareButtons';
import { Search, FileText } from 'lucide-react';
import { IFormDoc } from '@/lib/types';

export default function FormsPage() {
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const [forms, setForms] = useState<IFormDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const categories = ['Admission', 'Scholarship', 'Verification', 'Application', 'General'];

  useEffect(() => {
    fetchForms();
  }, [category]);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search.trim()) params.append('search', search.trim());

      const res = await axios.get(`/api/forms?${params.toString()}`);
      setForms(res.data);
    } catch (err) {
      console.error('Error loading forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchForms();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-govt-border pb-4">
        <h1 className={`text-2xl md:text-3xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
          {t('forms.title')}
        </h1>
        <p className="text-xs md:text-sm text-govt-muted mt-1">
          {t('forms.subtitle')}
        </p>
      </div>

      <SectionShareBar
        path="/forms"
        title="Download Official Government Application & Challan Forms PDF"
        description="Official job application forms, bank fee challan slips, verification documents, and Sindh Free Solar Scheme registration."
        badge="Official Forms Portal"
      />

      {/* Featured: Government Pension Papers — Fill & Print A4 Studio */}
      <div className="rounded-xl border border-slate-900 bg-slate-950 text-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
            Official Civil Services Tool · Form 3 (Pen.) &amp; A.T.C.5 LPC
          </p>
          <h2 className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-white">
            Government Pension Papers — Fill Once &amp; Print All 16 A4 Pages
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Stop filling pension papers by hand. Enter employee particulars once to auto-calculate
            qualifying service, gross/net pension, commutation lump sum (in figures &amp; words),
            all 8 DDO/HOD certificates, Sindh Consolidated Certificate, Descriptive Roll, and
            A.T.C.5 Last-Pay Certificate — verified against DAO/AG mistakes and ready for exact A4
            printing.
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <Link
            href="/forms/pension-papers"
            className="px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold text-center whitespace-nowrap transition-colors"
          >
            Open Pension Papers Studio →
          </Link>
          <span className="text-[10px] text-slate-400 text-center">
            100% Free · Stays Private in Your Browser
          </span>
        </div>
      </div>

      {/* Featured: FO-2 (FORM: PAY02) Payroll Amendment — A4 Landscape */}
      <div className="rounded-xl border border-sky-200 bg-sky-50/70 text-slate-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">
            PIFRA / SAP Payroll Tool · FORM: PAY02 (A4 Landscape)
          </p>
          <h2 className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-slate-950">
            FO-2 (PAY02) Payroll System Amendment Form — Single Employee Entry
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Fill DDO Cost Center (6 boxes), Personnel Number (8 boxes), Grade (2 boxes), Salary
            Start/Stop, 1-click PIFRA Wage Types &amp; 6-box right-aligned Rupees, and print
            pixel-perfect A4 Landscape with official emblem.
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <Link
            href="/forms/fo2"
            className="px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs sm:text-sm font-semibold text-center whitespace-nowrap transition-colors"
          >
            Open FO-2 (PAY02) Studio →
          </Link>
          <span className="text-[10px] text-sky-800 text-center">
            Exact 297 × 210 mm A4 Landscape · Free
          </span>
        </div>
      </div>

      {/* Featured: Sindh Solar Energy Program */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-700 shadow-elevated"
        style={{ background: 'linear-gradient(135deg, #046a38 0%, #024d29 60%, #012b17 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10" style={{ background: '#c8a24a' }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-5" style={{ background: '#fff' }} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 p-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              ☀️ Government Program — Open for Applications
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Sindh Solar Energy Program
            </h2>
            <p className="font-sindhi text-lg text-emerald-200" style={{ direction: 'rtl', lineHeight: '2', fontWeight: 400 }}>
              سنڌ سولر توانائي جو منصوبو — درخواست فارم
            </p>
            <p className="text-xs text-emerald-200 max-w-xl leading-relaxed">
              Apply online for free solar panel installation under Government of Sindh Solar Energy Program. No sign-up required. Get instant acknowledgment slip.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Link href="/forms/sindh-solar"
              className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-emerald-950 text-sm font-black px-7 py-3 rounded-xl transition shadow-md whitespace-nowrap">
              ☀️ Apply Now
            </Link>
            <span className="text-[10px] text-emerald-300 text-center font-medium">No Login Required</span>
          </div>
        </div>
        <div style={{ height: 4, background: 'repeating-linear-gradient(90deg,#c8a24a 0 20px,transparent 20px 40px)' }} />
      </div>


      <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-xl border border-govt-border shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:w-1/2">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search form title, challan slip..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-govt-emerald"
          />
        </div>

        <div className="w-full md:w-1/3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-govt-emerald bg-white"
          >
            <option value="">{t('forms.category')} (All)</option>
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

      {loading ? (
        <Loader />
      ) : forms.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center border border-govt-border">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-govt-muted">{t('forms.noForms')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((item) => (
            <FormCard key={item._id} form={item} />
          ))}
        </div>
      )}
    </div>
  );
}
