import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import ar from './locales/ar/translation.json';

const storedLanguage = localStorage.getItem('language') || 'en'; // Default to 'en' if no language is stored

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: storedLanguage, // Use the saved language from localStorage
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
