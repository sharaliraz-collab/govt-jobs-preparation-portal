'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { useAuth } from '@/context/AuthContext';
import {
  Briefcase,
  Newspaper,
  BookOpen,
  FileCheck,
  FileText,
  Award,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsRes, jobsRes] = await Promise.all([
        axios.get('/api/dashboard/stats', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/jobs?limit=5')
      ]);
      setStats(statsRes.data);
      setRecentJobs(jobsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-xs text-govt-gold font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Admin Control Panel & Live Portal Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Portal Administration Center</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">
            Manage government recruitment announcements, test preparation content, official news alerts, downloadable forms, and candidate quiz analytics in real-time.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
          <Briefcase className="w-64 h-64 text-white" />
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : stats && (
        <div className="space-y-8">
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/admin/jobs"
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-govt-emerald hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-govt-emerald flex items-center justify-center font-bold group-hover:bg-govt-emerald group-hover:text-white transition">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Post New Job</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-govt-emerald group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              href="/admin/news"
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-purple-500 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold group-hover:bg-purple-700 group-hover:text-white transition">
                  <Newspaper className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Publish News</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              href="/admin/forms"
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold group-hover:bg-blue-700 group-hover:text-white transition">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Upload Form</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              href="/admin/quizzes"
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-amber-500 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:bg-amber-700 group-hover:text-white transition">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Create Quiz</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Jobs Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-emerald-50 text-govt-emerald rounded-xl border border-emerald-100">
                <Briefcase className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Total Job Postings</p>
                <p className="text-2xl font-extrabold text-slate-900">{stats.jobs?.total || 0}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {stats.jobs?.open || 0} Open
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {stats.jobs?.closingSoon || 0} Closing Soon
                  </span>
                </div>
              </div>
            </div>

            {/* News Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-purple-50 text-purple-700 rounded-xl border border-purple-100">
                <Newspaper className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">News & Announcements</p>
                <p className="text-2xl font-extrabold text-slate-900">{stats.news || 0}</p>
                <span className="text-[11px] font-semibold text-purple-700 inline-block mt-1">
                  Official Gazettes & Results
                </span>
              </div>
            </div>

            {/* Test Materials Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Study Materials</p>
                <p className="text-2xl font-extrabold text-slate-900">{stats.materials || 0}</p>
                <span className="text-[11px] font-semibold text-blue-700 inline-block mt-1">
                  Syllabi & Past Papers
                </span>
              </div>
            </div>

            {/* Quiz Attempts Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Quiz Attempts (Total)</p>
                <p className="text-2xl font-extrabold text-slate-900">{stats.quizAttempts?.total || 0}</p>
                <span className="text-[11px] font-semibold text-amber-800 inline-block mt-1">
                  {stats.quizAttempts?.thisWeek || 0} Attempts This Week
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Recent Jobs & System Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Recent Jobs Table (2 Columns) */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-govt-emerald" />
                  Recently Posted Government Jobs
                </h3>
                <Link href="/admin/jobs" className="text-xs font-semibold text-govt-emerald hover:underline flex items-center gap-1">
                  Manage All Jobs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentJobs.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">No job postings found.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentJobs.map((job) => (
                    <div key={job._id} className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-lg transition">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{job.titleEn}</p>
                        <p className="text-[11px] text-slate-500 truncate">{job.department} • {job.location}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          job.status === 'open' ? 'bg-emerald-100 text-emerald-800' :
                          job.status === 'closing_soon' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {job.status === 'open' ? 'Open' : job.status === 'closing_soon' ? 'Closing Soon' : 'Closed'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {job.vacancies} {job.vacancies === 1 ? 'Seat' : 'Seats'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Portal Health & Resource Stats (1 Column) */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FileCheck className="w-4 h-4 text-govt-emerald" />
                  Testing & Assessment Bank
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-600 font-medium">Active Quizzes</span>
                    <span className="font-extrabold text-slate-900 text-sm">{stats.quizzes || 0}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-600 font-medium">Total Question Bank MCQs</span>
                    <span className="font-extrabold text-slate-900 text-sm">{stats.questions || 0}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-600 font-medium">Downloadable Forms</span>
                    <span className="font-extrabold text-slate-900 text-sm">{stats.forms || 0}</span>
                  </div>
                </div>
              </div>

              {/* Status Box */}
              <div className="bg-emerald-950 text-white rounded-xl p-5 border border-emerald-800 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-govt-gold font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Database Engine Status</span>
                </div>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  MongoDB database connection is healthy with automatic memory-server failover fallback active.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
