'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Loader from '@/components/Loader';
import { FileCheck, Clock, Award, PlayCircle, HelpCircle } from 'lucide-react';
import { IQuiz } from '@/lib/types';

export default function QuizzesPage() {
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');

  const subjects = [
    'Computer Science',
    'General Knowledge',
    'English Grammar',
    'Islamiat',
    'Pakistan Studies'
  ];

  useEffect(() => {
    fetchQuizzes();
  }, [subject]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const url = subject ? `/api/quizzes?subject=${encodeURIComponent(subject)}` : '/api/quizzes';
      const res = await axios.get(url);
      setQuizzes(res.data);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-govt-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
            {t('quizzes.title')}
          </h1>
          <p className="text-xs md:text-sm text-govt-muted mt-1">
            {t('quizzes.subtitle')}
          </p>
        </div>

        {/* Subject Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600 shrink-0">Filter Subject:</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-govt-emerald font-medium"
          >
            <option value="">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : quizzes.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center border border-govt-border">
          <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-govt-muted">{t('quizzes.noQuizzes')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const title = isUr && quiz.titleUr ? quiz.titleUr : quiz.titleEn;
            const qCount = quiz.questions?.length || 0;

            return (
              <div key={quiz._id} className="bg-white rounded-xl border border-govt-border p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-yellow-800 bg-yellow-50 border border-yellow-300 px-2.5 py-0.5 rounded">
                      {quiz.subject}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-govt-emerald" />
                      {qCount} {t('quizzes.questionsCount')}
                    </span>
                  </div>

                  <h3 className={`text-base font-bold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                    {title}
                  </h3>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-govt-muted">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {t('quizzes.timeLimit')}:
                    </span>
                    <span className="font-bold text-govt-charcoal">{quiz.timeLimitMinutes} {t('quizzes.minutes')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      {t('quizzes.passPercentage')}:
                    </span>
                    <span className="font-bold text-govt-emerald">{quiz.passPercentage}%</span>
                  </div>

                  <Link
                    href={`/quizzes/${quiz._id}`}
                    className="w-full bg-govt-emerald hover:bg-govt-emerald-dark text-white font-bold text-xs py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>{t('quizzes.startQuiz')}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
