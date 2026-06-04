import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  SUPPORTED_LANGS,
  HREFLANG_MAP,
  SITE_ORIGIN,
  DEFAULT_LANG,
} from '../i18n/config';

interface Props {
  /** Path *without* the language prefix, e.g. "/air-freight" or "/". */
  subPath: string;
}

/**
 * Emits <link rel="alternate" hreflang="..." /> tags for every supported language
 * plus an x-default that points at the default language. Google uses these to
 * pick the right localized URL per user — required for proper i18n SEO.
 *
 * Reference: https://developers.google.com/search/docs/specialized/international/localized-versions
 */
const HreflangTags: React.FC<Props> = ({ subPath }) => {
  const normalized = subPath === '/' ? '' : subPath;

  return (
    <Helmet>
      {SUPPORTED_LANGS.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={HREFLANG_MAP[lang]}
          href={`${SITE_ORIGIN}/${lang}${normalized}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${SITE_ORIGIN}/${DEFAULT_LANG}${normalized}`}
      />
    </Helmet>
  );
};

export default HreflangTags;
