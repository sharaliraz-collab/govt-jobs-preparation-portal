'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import FormCard from '@/components/FormCard';
import Loader from '@/components/Loader';
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
