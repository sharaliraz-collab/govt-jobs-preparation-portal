'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Mail, Lock, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('admin@govtjobs.pk');
  const [password, setPassword] = useState('AdminPass123!');
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
        setError('Access Denied: Account does not have Administrator privileges.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl border-2 border-govt-gold p-6 md:p-8 shadow-xl space-y-6">

        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center mx-auto text-2xl border-2 border-govt-gold">
            🔒
          </div>
          <h2 className="text-xl font-extrabold text-govt-charcoal">
            {t('auth.adminLoginTitle')}
          </h2>
          <p className="text-xs text-govt-muted">Protected portal strictly for authorized site owner</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-govt-red rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-govt-charcoal mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-govt-gold text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-govt-charcoal mb-1">Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-govt-gold text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-govt-emerald hover:bg-govt-emerald-dark text-white font-bold py-3 rounded-lg transition shadow text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4 text-govt-gold" />
            <span>{submitting ? 'Authenticating...' : 'Sign In as Admin'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
