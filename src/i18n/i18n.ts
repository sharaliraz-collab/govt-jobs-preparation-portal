import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en.json';
import urTranslation from './ur.json';

const getInitialLang = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('govt_portal_lang') || 'en';
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    ur: { translation: urTranslation }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export const toggleLanguage = () => {
  const newLang = i18n.language === 'en' ? 'ur' : 'en';
  i18n.changeLanguage(newLang);
  if (typeof window !== 'undefined') {
    localStorage.setItem('govt_portal_lang', newLang);
    document.documentElement.dir = newLang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  }
};

export default i18n;
