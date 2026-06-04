export const SUPPORTED_LANGS = ['zh', 'en', 'fr', 'es'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: SupportedLang = 'en';

export const LANG_LABELS: Record<SupportedLang, string> = {
  zh: '中文',
  en: 'English',
  fr: 'Français',
  es: 'Español',
};

// Used in <link rel="alternate" hreflang="..."> — must be valid BCP 47 tags.
export const HREFLANG_MAP: Record<SupportedLang, string> = {
  zh: 'zh-CN',
  en: 'en',
  fr: 'fr',
  es: 'es',
};

export const SITE_ORIGIN = 'https://www.saveshipcost.com';

export function isSupportedLang(value: string | undefined): value is SupportedLang {
  return !!value && (SUPPORTED_LANGS as readonly string[]).includes(value);
}
