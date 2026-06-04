import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import zhCommon from './locales/zh/common.json';
import enCommon from './locales/en/common.json';
import frCommon from './locales/fr/common.json';
import esCommon from './locales/es/common.json';

import { DEFAULT_LANG, SUPPORTED_LANGS } from './config';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh: { common: zhCommon },
      en: { common: enCommon },
      fr: { common: frCommon },
      es: { common: esCommon },
    },
    fallbackLng: DEFAULT_LANG,
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    defaultNS: 'common',
    ns: ['common'],
    interpolation: { escapeValue: false },
    detection: {
      // URL path wins; we override i18n.language from the route, so detector is only used for the first visit to "/".
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    react: { useSuspense: false },
  });

export default i18n;
