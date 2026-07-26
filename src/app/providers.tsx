'use client';

import React, { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import '@/i18n/i18n';
import i18n from '@/i18n/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedLang = localStorage.getItem('govt_portal_lang') || 'en';
    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
    document.documentElement.dir = savedLang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  }, []);

  return <AuthProvider>{children}</AuthProvider>;
}
