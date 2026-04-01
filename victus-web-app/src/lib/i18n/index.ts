import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationsEn from './translations/en';
import translationsEs from './translations/es';
import translationsPtBr from './translations/pt-br';

import { storage } from '@/globals/storage';

const resources = {
  'pt-BR': translationsPtBr,
  en: translationsEn,
  es: translationsEs
};

const getStoredLanguage = () => {
  const storedLanguage = localStorage.getItem(storage.language);
  if (storedLanguage && resources[storedLanguage as keyof typeof resources]) {
    return storedLanguage;
  }
  
  const browserLanguage = navigator.language;

  if (browserLanguage.startsWith('pt')) {
    return 'pt-BR';
  }
  
  if (browserLanguage.startsWith('es')) {
    return 'es';
  }
  
  if (browserLanguage.startsWith('en')) {
    return 'en';
  }
  
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    debug: true,
    ns: ['common', 'dashboard'],
    defaultNS: 'dashboard',
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(storage.language, lng);
});

export default i18n;