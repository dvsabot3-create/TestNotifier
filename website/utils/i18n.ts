import { appWithTranslation } from 'next-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// Initialize i18next for client-side
const initI18n = () => {
  if (typeof window !== 'undefined' && !i18next.isInitialized) {
    i18next
      .use(HttpApi)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        supportedLngs: ['en', 'cy', 'pl', 'ur'],
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',

        interpolation: {
          escapeValue: false,
        },

        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },

        detection: {
          order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
          caches: ['localStorage', 'cookie'],
          cookieMinutes: 10080, // 7 days
          htmlTag: document.documentElement,
          cookieOptions: { path: '/', sameSite: 'strict' },
        },

        react: {
          useSuspense: false,
          transSupportBasicHtmlNodes: true,
          transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
        },

        // Custom pluralization rules
        pluralSeparator: '_',
        contextSeparator: '_',
        keySeparator: '.',
        nsSeparator: ':',
      });
  }
};

export { initI18n };
export const withTranslation = appWithTranslation;