import React, { useEffect, useState } from 'react';
import { Card, Button, Typography, Tag, Table } from 'antd';
import { SendOutlined, GlobalOutlined, RightOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdSlot from '../components/AdSlot';
import { AD_CONFIG } from '../config/ads';
import heroImage from '../assets/55.jpg';
import { getDeliveryUpdates, DeliveryUpdate } from '../services/sscData';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [deliveryUpdates, setDeliveryUpdates] = useState<DeliveryUpdate[]>([]);

  useEffect(() => {
    setDeliveryUpdates(getDeliveryUpdates());
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const deliveryColumns = [
    {
      title: '起运日期',
      dataIndex: 'departDate',
      key: 'departDate',
      width: 110,
    },
    {
      title: '线路',
      dataIndex: 'route',
      key: 'route',
      width: 100,
      render: (v: string) => (
        <Tag color={v === 'CN->CA' ? 'blue' : 'green'}>{v}</Tag>
      ),
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: 100,
      render: (v: string) => (
        <span>
          <EnvironmentOutlined style={{ color: '#667eea', marginRight: 4 }} />
          {v}
        </span>
      ),
    },
    {
      title: '快递公司',
      dataIndex: 'merchantName',
      key: 'merchantName',
    },
    {
      title: '空运/海运',
      dataIndex: 'mode',
      key: 'mode',
      width: 100,
      render: (v: string | undefined) => {
        if (!v) return <span style={{ color: '#bbb' }}>—</span>;
        return <Tag color={v === 'air' ? 'blue' : 'cyan'}>{v === 'air' ? '空运' : '海运'}</Tag>;
      },
    },
    {
      title: '时效',
      dataIndex: 'eta',
      key: 'eta',
      width: 100,
      render: (v: string) => <Tag color="orange">{v}</Tag>,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: '#f0f4ff',
        padding: '80px 20px',
        borderBottom: '1px solid #dde5f5',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}>
          {/* 左侧文案 */}
          <div>
            <div style={{
              display: 'inline-block',
              background: '#dde8fc',
              color: '#3d5bd9',
              fontSize: 13,
              fontWeight: 600,
              padding: '5px 16px',
              borderRadius: 20,
              marginBottom: 24,
              letterSpacing: 1,
            }}>
              全球跨境物流比价平台
            </div>

            <Title level={1} style={{
              color: '#0d1b4b',
              fontWeight: 800,
              fontSize: 46,
              lineHeight: 1.2,
              marginBottom: 16,
              marginTop: 0,
            }}>
              运费试算器
            </Title>

            <Paragraph style={{
              fontSize: 17,
              color: '#5a6a8a',
              marginBottom: 36,
              lineHeight: 1.9,
              maxWidth: 480,
            }}>
              整合多家货代公司价格信息，为您提供最优质的
              海运、空运物流服务，价格透明，一键比较。
            </Paragraph>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* 空运比价 */}
              <div
                onClick={() => handleNavigate('/air-freight')}
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  boxShadow: '0 4px 20px rgba(67,97,184,0.10)',
                  cursor: 'pointer',
                  border: '1.5px solid #e4ebf8',
                }}
              >
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 20, flexShrink: 0,
                }}>
                  <SendOutlined />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#0d1b4b', fontSize: 15 }}>空运比价</div>
                  <div style={{ fontSize: 13, color: '#8a9bb8', marginTop: 2 }}>快速比较多家公司空运价格和时效</div>
                </div>
                <RightOutlined style={{ color: '#667eea', fontSize: 13 }} />
              </div>

              {/* 海运比价 */}
              <div
                onClick={() => handleNavigate('/sea-freight')}
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  boxShadow: '0 4px 20px rgba(17,153,142,0.10)',
                  cursor: 'pointer',
                  border: '1.5px solid #e4ebf8',
                }}
              >
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 20, flexShrink: 0,
                }}>
                  <GlobalOutlined />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#0d1b4b', fontSize: 15 }}>海运比价</div>
                  <div style={{ fontSize: 13, color: '#8a9bb8', marginTop: 2 }}>海运价格透明，服务多样化</div>
                </div>
                <RightOutlined style={{ color: '#11998e', fontSize: 13 }} />
              </div>
            </div>
          </div>

          {/* 右侧图片 */}
          <div style={{
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(13,27,75,0.16)',
            lineHeight: 0,
          }}>
            <img
              src={heroImage}
              alt="物流服务"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </div>

      {/* 广告位 — 首页 Hero 下方 */}
      {/* [AD_SLOT: home_hero_bottom] */}
      <div style={{ padding: '12px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <AdSlot slotId="home_top_banner" variant="banner" enabled={AD_CONFIG.home_top_banner} />
      </div>

      {/* 快递到货动态 */}
      <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <Title level={2} style={{ margin: 0 }}>快递到货动态</Title>
          <Button type="link" onClick={() => handleNavigate('/ottawa')}>
            查看 Ottawa 商家 →
          </Button>
        </div>
        <Card style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <Table
            dataSource={deliveryUpdates}
            columns={deliveryColumns}
            rowKey="id"
            pagination={{ pageSize: 5, size: 'small' }}
            size="small"
            locale={{ emptyText: '暂无到货动态，请等待管理员更新' }}
          />
        </Card>
      </div>
    </div>
  );
};

export default Home;
