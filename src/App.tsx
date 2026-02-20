import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';

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

const { Content } = Layout;

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <Router>
          <Layout style={{ minHeight: '100vh' }}>
            <Header />
            <Content style={{ background: '#f0f2f5', flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/air-freight" element={<AirFreight />} />
                <Route path="/sea-freight" element={<SeaFreight />} />
                <Route path="/company/:companyId" element={<CompanyDetail />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/corrections" element={<CorrectionsAdmin />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Content>
            <Footer />
          </Layout>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
