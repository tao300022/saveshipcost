import React from 'react';
import { Card, Row, Col, Button, Typography, Space, Tag } from 'antd';
import { SendOutlined, GlobalOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { companyData } from '../data/companyData';
import FreightCalculator from '../components/FreightCalculator';
import AdSlot from '../components/AdSlot';
import { AD_CONFIG } from '../config/ads';

const { Title, Paragraph, Text } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const features = [
    { icon: <SendOutlined />, title: '空运比价', desc: '快速比较多家公司空运价格和时效', path: '/air-freight' },
    { icon: <GlobalOutlined />, title: '海运比价', desc: '海运价格透明，服务多样化', path: '/sea-freight' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        color: '#fff'
      }}>
        <Title level={1} style={{ color: '#fff', marginBottom: 16 }}>
          运费试算器
        </Title>
        <Paragraph style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
          整合多家货代公司价格信息，为您提供最优质的海运、空运物流服务
        </Paragraph>
        <Space size={16}>
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            onClick={() => handleNavigate('/air-freight')}
          >
            空运比价
          </Button>
          <Button
            size="large"
            icon={<GlobalOutlined />}
            style={{ backgroundColor: '#fff', color: '#764ba2' }}
            onClick={() => handleNavigate('/sea-freight')}
          >
            海运比价
          </Button>
        </Space>
      </div>

      {/* ① 首页顶部 Banner 广告位 */}
      <div style={{ padding: '12px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <AdSlot slotId="home_top_banner" variant="banner" enabled={AD_CONFIG.home_top_banner} />
      </div>

      {/* Features Section */}
      <div style={{ padding: '60px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
          我们的服务
        </Title>
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                hoverable
                style={{ textAlign: 'center', height: '100%', cursor: 'pointer' }}
                onClick={() => handleNavigate(feature.path)}
              >
                <div style={{ fontSize: 48, color: '#667eea', marginBottom: 16 }}>
                  {feature.icon}
                </div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph style={{ color: '#666' }}>{feature.desc}</Paragraph>
              </Card>
            </Col>
          ))}
          <Col xs={24} sm={24} md={8}>
            <FreightCalculator />
          </Col>
        </Row>
      </div>

      {/* Companies Section */}
      <div style={{ padding: '60px 20px', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
            合作物流公司
          </Title>
          <Row gutter={[24, 24]}>
            {companyData.slice(0, 4).map((company, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  onClick={() => handleNavigate(`/company/${company.id}`)}
                >
                  <Title level={4} style={{ marginBottom: 8 }}>{company.name}</Title>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    {company.features.slice(0, 2).join(' | ')}
                  </Text>
                  <div style={{ marginTop: 16 }}>
                    {company.features.slice(0, 3).map((feature, i) => (
                      <Tag key={i} color="blue" style={{ marginBottom: 4 }}>{feature}</Tag>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Button
              type="link"
              size="large"
              icon={<RightOutlined />}
              onClick={() => handleNavigate('/air-freight')}
            >
              查看更多公司
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ padding: '80px 20px', textAlign: 'center', background: '#667eea', color: '#fff' }}>
        <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>
          开始比价，省钱省心
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginBottom: 32 }}>
          立即查看所有物流公司的价格和服务，选择最适合您的运输方案
        </Paragraph>
        <Button
          size="large"
          style={{ backgroundColor: '#fff', color: '#667eea', height: 48, fontSize: 16 }}
          onClick={() => handleNavigate('/air-freight')}
        >
          立即开始
        </Button>
      </div>
    </div>
  );
};

export default Home;
