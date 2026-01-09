import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './assets/locales/en/translation.json';
import de from './assets/locales/de/translation.json';

// Load saved language preference from localStorage
const getSavedLanguage = () => {
  try {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.language && ['en', 'de'].includes(parsed.language)) {
        return parsed.language;
      }
    }
  } catch (e) {
    console.error('Failed to load language preference:', e);
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
