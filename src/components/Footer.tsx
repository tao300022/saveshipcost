import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LANG, isSupportedLang, type SupportedLang } from '../i18n/config';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang: SupportedLang = isSupportedLang(i18n.language)
    ? (i18n.language as SupportedLang)
    : DEFAULT_LANG;
  const localized = (path: string) => `/${lang}${path}`;

  const footerLinks = [
    { labelKey: 'footer.contact',         path: '/contact' },
    { labelKey: 'footer.disclaimer',      path: '/disclaimer' },
    { labelKey: 'footer.privacyPolicy',   path: '/privacy-policy' },
    { labelKey: 'footer.termsOfUse',      path: '/terms-of-use' },
    { labelKey: 'footer.cookiePolicy',    path: '/cookie-policy' },
    { labelKey: 'footer.corrections',     path: '/corrections' },
  ];

  return (
    <AntFooter style={{ textAlign: 'center', background: '#f0f2f5', padding: '24px 20px' }}>
      <Space direction="vertical" size={8}>
        <Space split={<Divider type="vertical" />} wrap>
          {footerLinks.map((link) => (
            <Link
              key={link.path}
              to={localized(link.path)}
              style={{ color: '#888', fontSize: 13 }}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </Space>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('footer.copyright')}
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('footer.slogan')}
        </Text>
      </Space>
    </AntFooter>
  );
};

export default Footer;
