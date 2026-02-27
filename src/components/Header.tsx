import React from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header: AntHeader } = Layout;

const CITIES = [
  { key: 'Ottawa',    label: 'Ottawa 渥太华',     path: '/ottawa' },
  { key: 'Toronto',   label: 'Toronto 多伦多',    path: '/ottawa?city=Toronto' },
  { key: 'Montreal',  label: 'Montreal 蒙特利尔', path: '/ottawa?city=Montreal' },
  { key: 'Vancouver', label: 'Vancouver 温哥华',  path: '/ottawa?city=Vancouver' },
];

/* 内联 SVG S Logo */
const SLogo = () => (
  <svg width="34" height="34" viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="sscSFlow" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#a5b4fc" />
        <stop offset="1" stopColor="#e0e7ff" />
      </linearGradient>
      <filter id="sscShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
      </filter>
    </defs>
    <path
      d="M49 18.5c0-6.4-6.5-11.5-17-11.5C21 7 14 11.7 14 19c0 6 4.4 9.4 11.2 10.9l9.3 2.1c4.6 1 7 2.2 7 4.8 0 3.2-3.8 5.6-9.8 5.6-5.8 0-10.1-2.2-11.1-6.6"
      stroke="url(#sscSFlow)"
      strokeWidth="6.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#sscShadow)"
    />
    <path
      d="M15 45.5c0 6.4 6.5 11.5 17 11.5 11 0 18-4.7 18-12 0-6-4.4-9.4-11.2-10.9l-9.3-2.1c-4.6-1-7-2.2-7-4.8 0-3.2 3.8-5.6 9.8-5.6 5.8 0 10.1 2.2 11.1 6.6"
      stroke="url(#sscSFlow)"
      strokeWidth="6.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.95"
    />
  </svg>
);

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const showAdminEntry = searchParams.get('admin') === '1';
  const activeCity = searchParams.get('city') || (location.pathname === '/ottawa' ? 'Ottawa' : '');

  const menuItems = [
    { key: '/',            label: '首页',     onClick: () => navigate('/') },
    { key: '/air-freight', label: '空运比价', onClick: () => navigate('/air-freight') },
    { key: '/sea-freight', label: '海运比价', onClick: () => navigate('/sea-freight') },
    { key: '/forum',       label: '首重拼邮', onClick: () => navigate('/forum') },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userMenuItems = [
    { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout },
  ];

  return (
    <>
      {/* 主导航栏 */}
      <AntHeader
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
          onClick={() => navigate('/')}
        >
          <SLogo />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: 0.5 }}>
              Saveshipcost
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: 1 }}>
              跨境快递
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            flex: 1,
            minWidth: 0,
            justifyContent: 'center',
            background: 'transparent',
            borderBottom: 'none',
          }}
        />

        {/* 右侧操作区 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {showAdminEntry && (
            <Button
              type="text"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => navigate('/admin')}
              style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}
            >
              管理员
            </Button>
          )}

          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" style={{ color: '#fff' }}>
                <Space>
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#fff' }} />
                  <span>{user?.username}</span>
                </Space>
              </Button>
            </Dropdown>
          ) : (
            <Space>
              <Button type="text" onClick={() => navigate('/login')} style={{ color: '#fff' }}>
                登录
              </Button>
              <Button
                type="primary"
                onClick={() => navigate('/register')}
                style={{ background: '#fff', color: '#764ba2', borderColor: '#fff' }}
              >
                注册
              </Button>
            </Space>
          )}
        </div>
      </AntHeader>

      {/* 城市入口栏 */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e8edf5',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        height: 42,
        overflowX: 'auto',
      }}>
        <span style={{ fontSize: 12, color: '#aaa', marginRight: 6, flexShrink: 0 }}>城市：</span>
        {CITIES.map((city) => {
          const isActive = activeCity === city.key;
          return (
            <button
              key={city.key}
              onClick={() => navigate(city.path)}
              style={{
                padding: '4px 14px',
                borderRadius: 20,
                border: isActive ? '1.5px solid #667eea' : '1.5px solid #e4ebf8',
                background: isActive ? '#eef1ff' : '#f7f9ff',
                color: isActive ? '#4361b8' : '#5a6a8a',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#667eea';
                  (e.currentTarget as HTMLButtonElement).style.color = '#4361b8';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#e4ebf8';
                  (e.currentTarget as HTMLButtonElement).style.color = '#5a6a8a';
                }
              }}
            >
              {city.label}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Header;
