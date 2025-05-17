import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonPtBr from './translations/pt-br/common.json';
import dashboardPtBr from './translations/pt-br/dashboard.json';
import habitPtBr from './translations/pt-br/habit.json';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  'pt-BR': {
    common: commonPtBr,
    dashboard: dashboardPtBr,
    habit: habitPtBr
  },
  en: {
    common: commonPtBr,
    dashboard: dashboardPtBr,
    habit: habitPtBr
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // Changed to pt-BR to test
    fallbackLng: 'en',
    debug: true, // Enable debug mode
    ns: ['common', 'dashboard'],
    defaultNS: 'dashboard',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

// Add a listener to log when language changes
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
});

// Log initial state
console.log('Current language:', i18n.language);
console.log('Available languages:', i18n.languages);
console.log('Translation resources:', i18n.options.resources);

export default i18n;