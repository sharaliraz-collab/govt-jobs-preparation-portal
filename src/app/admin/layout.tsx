'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  Newspaper,
  FileText,
  BookOpen,
  Award,
  HelpCircle,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  UserCheck
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't apply layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Job Postings', path: '/admin/jobs', icon: Briefcase },
    { label: 'News & Alerts', path: '/admin/news', icon: Newspaper },
    { label: 'Application Forms', path: '/admin/forms', icon: FileText },
    { label: 'Study Materials', path: '/admin/materials', icon: BookOpen },
    { label: 'Quizzes & Tests', path: '/admin/quizzes', icon: Award },
    { label: 'Question Bank', path: '/admin/questions', icon: HelpCircle },
  ];

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">

        {/* Mobile Header Bar */}
        <div className="md:hidden bg-govt-emerald-dark text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-govt-gold" />
            <span className="font-bold text-sm">Govt Portal Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded hover:bg-emerald-800 transition"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Sidebar Container */}
        <aside
          className={`fixed md:sticky top-0 z-30 h-screen w-64 bg-slate-900 text-slate-200 flex flex-col justify-between shadow-xl transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Sidebar Top Header */}
          <div>
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-govt-emerald text-white flex items-center justify-center font-extrabold text-sm shadow border border-emerald-500">
                  ADM
                </div>
                <div>
                  <h2 className="font-bold text-sm text-white group-hover:text-govt-gold transition">
                    Admin Portal
                  </h2>
                  <p className="text-[10px] text-emerald-400 font-medium">System Control Center</p>
                </div>
              </Link>
            </div>

            {/* Admin User Info Card */}
            <div className="p-4 mx-3 my-3 bg-slate-800/80 rounded-lg border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-govt-gold/20 text-govt-gold flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-100 truncate">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation Section Header */}
            <div className="px-5 pt-3 pb-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Management Modules</p>
            </div>

            {/* Sidebar Navigation Links */}
            <nav className="px-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-govt-emerald text-white shadow-md font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-govt-gold' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Actions */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition border border-slate-700"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                View Public Site
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">Live</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold transition border border-red-900/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out Admin Session</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col min-w-0">
          {/* Top Desktop Bar */}
          <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-3.5 items-center justify-between shadow-xs sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-govt-emerald" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Government Recruitment & Portal System Administration
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                System Ready & Operational
              </span>
            </div>
          </header>

          {/* Page Content Body */}
          <main className="p-4 sm:p-6 lg:p-8 flex-grow">
            {children}
          </main>
        </div>

      </div>
    </AdminRoute>
  );
}
