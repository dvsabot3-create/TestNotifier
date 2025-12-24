const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'cy', 'pl', 'ur'],
    localePath: path.resolve('./public/locales'),
  },
  fallbackLng: {
    default: ['en'],
    cy: ['en'],
    pl: ['en'],
    ur: ['en'],
  },
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  keySeparator: '.',
  nsSeparator: ':',
  pluralSeparator: '_',
  contextSeparator: '_',
  debug: process.env.NODE_ENV === 'development',
  saveMissing: true,
  strictMode: false,
  react: {
    useSuspense: false,
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
  },
  detection: {
    order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
    caches: ['localStorage', 'cookie'],
    cookieMinutes: 10080, // 7 days
    cookieDomain: '',
    htmlTag: document.documentElement,
    cookieOptions: { path: '/', sameSite: 'strict' },
  },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    addPath: '/locales/{{lng}}/{{ns}}.missing.json',
    multiSeparator: '+',
  },
  ns: ['common', 'home', 'auth', 'dashboard', 'extension', 'analytics', 'notifications'],
  defaultNS: 'common',
  partialBundledLanguages: true,
};