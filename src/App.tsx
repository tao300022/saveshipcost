import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
  Outlet,
} from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import type { Locale } from 'antd/es/locale';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import frFR from 'antd/locale/fr_FR';
import esES from 'antd/locale/es_ES';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HreflangTags from './components/HreflangTags';

import { DEFAULT_LANG, SITE_ORIGIN, isSupportedLang, type SupportedLang } from './i18n/config';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AirFreight from './pages/AirFreight';
import SeaFreight from './pages/SeaFreight';
import CompanyDetail from './pages/CompanyDetail';
import Forum from './pages/Forum';
import Contact from './pages/Contact';
import Disclaimer from './pages/Disclaimer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import CookiePolicy from './pages/CookiePolicy';
import CorrectionsAdmin from './pages/CorrectionsAdmin';
import Ottawa from './pages/Ottawa';
import MerchantDetail from './pages/MerchantDetail';
import AdminPage from './pages/Admin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import FAQ from './pages/FAQ';

const { Content } = Layout;

const ANTD_LOCALES: Record<SupportedLang, Locale> = {
  zh: zhCN,
  en: enUS,
  fr: frFR,
  es: esES,
};

function detectInitialLang(): SupportedLang {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  const stored = window.localStorage.getItem('i18nextLng');
  if (isSupportedLang(stored ?? undefined)) return stored as SupportedLang;
  const nav = (navigator.language || '').toLowerCase();
  if (nav.startsWith('zh')) return 'zh';
  if (nav.startsWith('fr')) return 'fr';
  if (nav.startsWith('es')) return 'es';
  if (nav.startsWith('en')) return 'en';
  return DEFAULT_LANG;
}

/** Wraps every localized route: validates :lang, keeps i18next in sync, emits canonical + hreflang. */
function LocalizedLayout() {
  const { lang } = useParams<{ lang: string }>();
  const { pathname } = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (isSupportedLang(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
      document.documentElement.lang = lang;
    }
  }, [lang, i18n]);

  if (!isSupportedLang(lang)) {
    return <Navigate to={`/${DEFAULT_LANG}`} replace />;
  }

  // Path without the leading "/:lang" — used to build hreflang siblings for other languages.
  const subPath = pathname.replace(/^\/[^/]+/, '') || '/';

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${SITE_ORIGIN}/${lang}${subPath === '/' ? '' : subPath}`} />
      </Helmet>
      <HreflangTags subPath={subPath} />
      <Outlet />
    </>
  );
}

/** Catches legacy unprefixed URLs (e.g. /air-freight) and redirects to the detected language. */
function LegacyRedirect() {
  const { pathname, search } = useLocation();
  const lang = detectInitialLang();
  return <Navigate to={`/${lang}${pathname}${search}`} replace />;
}

function AppShell() {
  const { i18n } = useTranslation();
  const currentLang = isSupportedLang(i18n.language) ? i18n.language : DEFAULT_LANG;

  return (
    <ConfigProvider locale={ANTD_LOCALES[currentLang]}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Content style={{ background: '#f0f2f5', flex: 1 }}>
          <Routes>
            {/* Root → detected language */}
            <Route path="/" element={<Navigate to={`/${detectInitialLang()}`} replace />} />

            {/* All localized routes */}
            <Route path="/:lang" element={<LocalizedLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="air-freight" element={<AirFreight />} />
              <Route path="sea-freight" element={<SeaFreight />} />
              <Route path="company/:companyId" element={<CompanyDetail />} />
              <Route path="forum" element={<Forum />} />
              <Route path="contact" element={<Contact />} />
              <Route path="disclaimer" element={<Disclaimer />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-of-use" element={<TermsOfUse />} />
              <Route path="cookie-policy" element={<CookiePolicy />} />
              <Route path="corrections" element={<CorrectionsAdmin />} />
              <Route path="ottawa" element={<Ottawa />} />
              <Route path="merchant/:merchantId" element={<MerchantDetail />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="faq" element={<FAQ />} />
            </Route>

            {/* Legacy unprefixed paths — fallback client-side redirect (Vercel 301s handle this server-side too). */}
            <Route path="*" element={<LegacyRedirect />} />
          </Routes>
        </Content>
        <Footer />
      </Layout>
    </ConfigProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  );
}

export default App;
