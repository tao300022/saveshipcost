import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import { Link } from 'react-router-dom';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const footerLinks = [
  { label: '联系我们', path: '/contact' },
  { label: '免责声明', path: '/disclaimer' },
  { label: '隐私政策', path: '/privacy-policy' },
  { label: '使用条款', path: '/terms-of-use' },
  { label: 'Cookie 说明', path: '/cookie-policy' },
  { label: '纠错记录', path: '/corrections' },
];

const Footer: React.FC = () => {
  return (
    <AntFooter style={{ textAlign: 'center', background: '#f0f2f5', padding: '24px 20px' }}>
      <Space direction="vertical" size={8}>
        <Space split={<Divider type="vertical" />} wrap>
          {footerLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{ color: '#888', fontSize: 13 }}
            >
              {link.label}
            </Link>
          ))}
        </Space>
        <Text type="secondary" style={{ fontSize: 12 }}>
          © 2026 跨境快递比价平台. All Rights Reserved.
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          为加拿大华人提供优质物流比价服务
        </Text>
      </Space>
    </AntFooter>
  );
};

export default Footer;
