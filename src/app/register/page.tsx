'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Lock, AlertCircle, Shield, Award, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const { register } = useAuth();
  const router = useRouter();
  const isUr = i18n.language === 'ur';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /* Password strength indicator */
  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { level: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score <= 3) return { level: 3, label: 'Good', color: 'bg-blue-500' };
    return { level: 4, label: 'Strong', color: 'bg-emerald-500' };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await register(name, email, password);
      router.push('/my-account');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account.');
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
              <Award className="w-6 h-6 text-govt-gold" />
            </div>
            <h2 className="text-2xl font-extrabold leading-tight">
              Join 10,000+<br />Aspirants Today
            </h2>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Create a free account to bookmark jobs, track quiz performance, and never miss a deadline.
            </p>
          </div>

          <div className="relative space-y-3 pt-8">
            {[
              { icon: CheckCircle, label: '100% Free — no hidden charges' },
              { icon: TrendingUp, label: 'Track your quiz progress' },
              { icon: Shield, label: 'Data encrypted & secure' },
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

        {/* Right: Registration Form */}
        <div className="bg-white p-6 md:p-8 flex flex-col justify-center">
          <div className="space-y-6">
            <div className="text-center md:text-left space-y-2">
              <div className="md:hidden w-12 h-12 bg-govt-gold-light text-govt-gold rounded-xl flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h2 className={`text-xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                {t('auth.registerTitle')}
              </h2>
              <p className="text-xs text-govt-muted">Create a free job seeker account to track entry tests & bookmarks</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-govt-red rounded-xl text-xs flex items-center gap-2 animate-slide-down" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs" id="register-form">
              <div>
                <label htmlFor="reg-name" className="block font-bold text-govt-charcoal mb-1.5">{t('auth.name')}</label>
                <div className="relative group">
                  <User className="w-4 h-4 text-gray-400 group-focus-within:text-govt-emerald absolute left-3 top-3 transition-colors" />
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Muhammad Ali"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-govt-emerald focus:ring-2 focus:ring-govt-emerald/10 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="block font-bold text-govt-charcoal mb-1.5">{t('auth.email')}</label>
                <div className="relative group">
                  <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-govt-emerald absolute left-3 top-3 transition-colors" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-govt-emerald focus:ring-2 focus:ring-govt-emerald/10 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-password" className="block font-bold text-govt-charcoal mb-1.5">{t('auth.password')}</label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-gray-400 group-focus-within:text-govt-emerald absolute left-3 top-3 transition-colors" />
                  <input
                    id="reg-password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-govt-emerald focus:ring-2 focus:ring-govt-emerald/10 text-sm transition-all"
                  />
                </div>

                {/* Password Strength Bar */}
                {password && (
                  <div className="mt-2 space-y-1 animate-fade-in">
                    <div className="flex gap-1">
                      {[1,2,3,4].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength.level ? passwordStrength.color : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-[10px] font-bold ${
                      passwordStrength.level <= 1 ? 'text-red-500' :
                      passwordStrength.level <= 2 ? 'text-amber-500' :
                      passwordStrength.level <= 3 ? 'text-blue-500' : 'text-emerald-500'
                    }`}>
                      Password strength: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-govt-emerald hover:bg-govt-emerald-dark text-white font-extrabold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-glow-emerald text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
                id="register-submit-btn"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  t('auth.registerBtn')
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-gray-100 text-center">
              <Link href="/login" className="text-xs font-bold text-govt-emerald hover:text-govt-emerald-dark transition-colors">
                {t('auth.hasAccount')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
