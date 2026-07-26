'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import JobCard from '@/components/JobCard';
import Loader from '@/components/Loader';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Bookmark, Award, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { IJob } from '@/lib/types';

export default function MyAccountPage() {
  const { t, i18n } = useTranslation();
  const { user, token } = useAuth();
  const isUr = i18n.language === 'ur';

  const [savedJobs, setSavedJobs] = useState<IJob[]>([]);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'saved' | 'history'>('saved');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const [meRes, historyRes] = await Promise.all([
          axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/quizzes/history/my', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setSavedJobs(meRes.data.savedJobs || []);
        setQuizHistory(historyRes.data || []);
      } catch (err) {
        console.error('Error fetching account data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSavedJobRemove = (jobId: string) => {
    setSavedJobs(prev => prev.filter(job => job._id !== jobId));
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Account Banner */}
        <div className="bg-white rounded-xl border border-govt-border p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
              {t('nav.myAccount')}
            </h1>
            <p className="text-xs text-govt-muted mt-1">
              Welcome back, <span className="font-bold text-govt-emerald">{user?.name}</span> ({user?.email})
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex gap-2 border border-govt-border p-1 rounded-lg bg-slate-50 text-xs">
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 rounded-md font-bold transition flex items-center gap-1.5 ${
                activeTab === 'saved' ? 'bg-govt-emerald text-white shadow-sm' : 'text-slate-600 hover:text-govt-emerald'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Jobs ({savedJobs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md font-bold transition flex items-center gap-1.5 ${
                activeTab === 'history' ? 'bg-govt-emerald text-white shadow-sm' : 'text-slate-600 hover:text-govt-emerald'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Quiz History ({quizHistory.length})</span>
            </button>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : activeTab === 'saved' ? (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-govt-charcoal">Saved Job Announcements</h2>

            {savedJobs.length === 0 ? (
              <div className="bg-white p-12 rounded-xl text-center border border-govt-border text-sm text-govt-muted">
                You haven't saved any job postings yet. Browse jobs and click the bookmark button to save them here!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedJobs.map((job) => (
                  <JobCard key={job._id} job={job} onSaveToggle={handleSavedJobRemove} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-govt-charcoal">MCQ Quiz Attempt History</h2>

            {quizHistory.length === 0 ? (
              <div className="bg-white p-12 rounded-xl text-center border border-govt-border text-sm text-govt-muted">
                You haven't attempted any practice quizzes yet. Take a quiz to track your progress!
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-govt-border overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-gray-200 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Quiz Title</th>
                      <th className="p-3.5">Subject</th>
                      <th className="p-3.5">Score</th>
                      <th className="p-3.5">Percentage</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {quizHistory.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5 font-bold text-govt-charcoal">
                          {item.quiz ? (isUr && item.quiz.titleUr ? item.quiz.titleUr : item.quiz.titleEn) : 'Archived Quiz'}
                        </td>
                        <td className="p-3.5 text-slate-600 font-medium">
                          {item.quiz?.subject || 'N/A'}
                        </td>
                        <td className="p-3.5 font-bold">
                          {item.score} / {item.totalQuestions}
                        </td>
                        <td className="p-3.5 font-bold text-slate-800">
                          {item.percentage}%
                        </td>
                        <td className="p-3.5">
                          {item.passed ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                              <XCircle className="w-3.5 h-3.5" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(item.attemptedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
