import React from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space } from 'antd';
import { UserOutlined, SendOutlined, GlobalOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const menuItems = [
    { key: '/', label: '首页', onClick: () => navigate('/') },
    { key: '/air-freight', label: '空运比价', onClick: () => navigate('/air-freight') },
    { key: '/sea-freight', label: '海运比价', onClick: () => navigate('/sea-freight') },
    { key: '/forum', label: '论坛', onClick: () => navigate('/forum') },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        <SendOutlined style={{ fontSize: 24, marginRight: 8 }} />
        <span style={{ fontSize: 20, fontWeight: 'bold' }}>海运空运比价</span>
      </div>

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

      <div>
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
            <Button
              type="text"
              onClick={() => navigate('/login')}
              style={{ color: '#fff' }}
            >
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
  );
};

export default Header;
