import React from 'react';
import { Dropdown, Button } from 'antd';
import { GlobalOutlined, DownOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  LANG_LABELS,
  SUPPORTED_LANGS,
  isSupportedLang,
  type SupportedLang,
  DEFAULT_LANG,
} from '../i18n/config';

interface Props {
  /** Optional inline style overrides */
  style?: React.CSSProperties;
  /** Render mode — compact shows only a globe + code; full shows the localized label */
  variant?: 'compact' | 'full';
}

/**
 * Swaps the leading "/:lang" segment of the current URL to the chosen language,
 * preserving the rest of the path and any query string.
 */
const LanguageSwitcher: React.FC<Props> = ({ style, variant = 'compact' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  const currentLang: SupportedLang = isSupportedLang(i18n.language)
    ? (i18n.language as SupportedLang)
    : DEFAULT_LANG;

  const handleSelect = (lang: SupportedLang) => {
    if (lang === currentLang) return;
    // Replace the first path segment; if missing, prepend.
    const rest = location.pathname.replace(/^\/[^/]+/, '') || '';
    const target = `/${lang}${rest}${location.search}${location.hash}`;
    navigate(target);
  };

  const items = SUPPORTED_LANGS.map((lang) => ({
    key: lang,
    label: (
      <span style={{ fontWeight: lang === currentLang ? 700 : 400 }}>
        {LANG_LABELS[lang]}
        <span style={{ color: '#999', marginLeft: 6, fontSize: 12 }}>{lang.toUpperCase()}</span>
      </span>
    ),
    onClick: () => handleSelect(lang),
  }));

  return (
    <Dropdown menu={{ items, selectedKeys: [currentLang] }} placement="bottomRight" trigger={['click']}>
      <Button type="text" style={{ color: '#fff', ...style }} aria-label="Change language">
        <GlobalOutlined />
        {variant === 'full' ? LANG_LABELS[currentLang] : currentLang.toUpperCase()}
        <DownOutlined style={{ fontSize: 10 }} />
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
