'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, AlertCircle, Shield, Briefcase, BookOpen, FileCheck, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const router = useRouter();
  const isUr = i18n.language === 'ur';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/my-account');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-elevated border border-govt-border animate-scale-in">

        {/* Left: Gradient Motivational Panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-govt-emerald-dark via-govt-emerald to-emerald-800 text-white p-8 relative overflow-hidden">
          {/* Background orbs */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-govt-gold/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl" />

          <div className="relative space-y-6">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/15">
              <Shield className="w-6 h-6 text-govt-gold" />
            </div>
            <h2 className="text-2xl font-extrabold leading-tight">
              Your Gateway to<br />Government Careers
            </h2>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Sign in to save jobs, track applications, access study materials, and take timed MCQ tests.
            </p>
          </div>

          <div className="relative space-y-3 pt-8">
            {[
              { icon: Briefcase, label: 'Track & save job postings' },
              { icon: BookOpen, label: 'Access past papers & notes' },
              { icon: FileCheck, label: 'Take timed MCQ quizzes' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-xs text-emerald-100/70">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-govt-gold" />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="bg-white p-6 md:p-8 flex flex-col justify-center">
          <div className="space-y-6">
            <div className="text-center md:text-left space-y-2">
              <div className="md:hidden w-12 h-12 bg-govt-emerald-light text-govt-emerald rounded-xl flex items-center justify-center mx-auto font-extrabold text-lg">
                GJ
              </div>
              <h2 className={`text-xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                {t('auth.loginTitle')}
              </h2>
              <p className="text-xs text-govt-muted">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-govt-red rounded-xl text-xs flex items-center gap-2 animate-slide-down" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs" id="login-form">
              <div>
                <label htmlFor="login-email" className="block font-bold text-govt-charcoal mb-1.5">{t('auth.email')}</label>
                <div className="relative group">
                  <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-govt-emerald absolute left-3 top-3 transition-colors" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="visitor@example.com"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-govt-emerald focus:ring-2 focus:ring-govt-emerald/10 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block font-bold text-govt-charcoal mb-1.5">{t('auth.password')}</label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-gray-400 group-focus-within:text-govt-emerald absolute left-3 top-3 transition-colors" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-govt-emerald focus:ring-2 focus:ring-govt-emerald/10 text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-govt-emerald hover:bg-govt-emerald-dark text-white font-extrabold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-glow-emerald text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
                id="login-submit-btn"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  t('auth.loginBtn')
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-gray-100 text-center">
              <Link href="/register" className="text-xs font-bold text-govt-emerald hover:text-govt-emerald-dark transition-colors">
                {t('auth.noAccount')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
