import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Typography, Tag, Table } from 'antd';
import { SendOutlined, GlobalOutlined, RightOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdSlot from '../components/AdSlot';
import { AD_CONFIG } from '../config/ads';
import heroImage from '../assets/55.jpg';
import { getDeliveryUpdates, DeliveryUpdate } from '../services/sscData';
import ChargeableWeightCard from '../components/ChargeableWeightCard';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [deliveryUpdates, setDeliveryUpdates] = useState<DeliveryUpdate[]>([]);
  const calcRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDeliveryUpdates(getDeliveryUpdates());
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const scrollToCalc = () => {
    if (calcRef.current) {
      calcRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        const input = calcRef.current?.querySelector('input');
        if (input) input.focus();
      }, 400);
    }
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
        background: '#fff',
        padding: '80px 20px',
        borderBottom: '1px solid #eef1fb',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'start',
        }}>
          {/* 左侧文案 */}
          <div>
            <div style={{
              fontSize: 12,
              color: '#aab4cc',
              letterSpacing: 3,
              marginBottom: 18,
              fontWeight: 500,
            }}>
              —— CHINA · CANADA SHIPPING
            </div>

            <Title level={1} style={{
              color: '#0d1b4b',
              fontWeight: 800,
              fontSize: 42,
              lineHeight: 1.25,
              marginBottom: 16,
              marginTop: 0,
            }}>
              找到最优<br />跨境运费<br />
              <span style={{ color: '#667eea' }}>一键省钱</span>
            </Title>

            <Paragraph style={{
              fontSize: 15,
              color: '#7a8ca8',
              marginBottom: 32,
              lineHeight: 1.9,
              maxWidth: 420,
            }}>
              整合加拿大多家华人快递货代报价，海运 · 空运全覆盖，
              价格透明、时效清晰，让每一票货都走最划算的路线。
            </Paragraph>

            {/* CTA 按钮 */}
            <Button
              type="primary"
              size="large"
              onClick={scrollToCalc}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                height: 46,
                paddingLeft: 28,
                paddingRight: 28,
                marginBottom: 32,
                boxShadow: '0 6px 20px rgba(102,126,234,0.35)',
              }}
            >
              计费试算 →
            </Button>

            {/* 空运 / 海运 入口卡 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                onClick={() => handleNavigate('/air-freight')}
                style={{
                  background: '#f7f9ff',
                  borderRadius: 14,
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                  border: '1.5px solid #e4ebf8',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 18, flexShrink: 0,
                }}>
                  <SendOutlined />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#0d1b4b', fontSize: 14 }}>空运比价</div>
                  <div style={{ fontSize: 12, color: '#8a9bb8', marginTop: 2 }}>快速比较多家公司空运价格和时效</div>
                </div>
                <RightOutlined style={{ color: '#667eea', fontSize: 12 }} />
              </div>

              <div
                onClick={() => handleNavigate('/sea-freight')}
                style={{
                  background: '#f7f9ff',
                  borderRadius: 14,
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                  border: '1.5px solid #e4ebf8',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 18, flexShrink: 0,
                }}>
                  <GlobalOutlined />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#0d1b4b', fontSize: 14 }}>海运比价</div>
                  <div style={{ fontSize: 12, color: '#8a9bb8', marginTop: 2 }}>海运价格透明，服务多样化</div>
                </div>
                <RightOutlined style={{ color: '#11998e', fontSize: 12 }} />
              </div>
            </div>
          </div>

          {/* RightHeroFinal refined: better balance */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 660, minHeight: 520 }}>

            {/* Frame background */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 28,
              background: 'linear-gradient(135deg, #f8fafc 0%, #fff 50%, #f1f5f9 100%)',
              border: '1px solid rgba(203,213,225,0.6)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }} />

            {/* Animated glow blobs */}
            <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 28 }}>
              <div className="animate-sscGlow1" style={{
                position: 'absolute', top: -96, left: -96,
                height: 360, width: 360, borderRadius: '50%',
                opacity: 0.30, filter: 'blur(48px)',
                background: 'radial-gradient(circle at center, rgba(99,102,241,0.55), rgba(59,130,246,0.18), transparent 70%)',
              }} />
              <div className="animate-sscGlow2" style={{
                position: 'absolute', bottom: -112, right: -112,
                height: 420, width: 420, borderRadius: '50%',
                opacity: 0.26, filter: 'blur(48px)',
                background: 'radial-gradient(circle at center, rgba(168,85,247,0.45), rgba(59,130,246,0.16), transparent 70%)',
              }} />
            </div>

            {/* Watermark images */}
            <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 28 }}>
{/* hero — mid watermark, barely lifted */}
              <img
                src={heroImage}
                alt=""
                loading="lazy"
                draggable={false}
                style={{
                  position: 'absolute', bottom: 0,
                  left: '50%', transform: 'translateX(-50%) translateY(4px)',
                  zIndex: 10, opacity: 0.62,
                  width: '92%', maxWidth: 720, maxHeight: 400,
                  objectFit: 'contain',
                }}
              />
              {/* Bottom fade mask — thinner, lighter */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: 120, zIndex: 20,
                background: 'linear-gradient(to top, #fff 0%, rgba(255,255,255,0.4) 60%, transparent 100%)',
              }} />
            </div>

            {/* Foreground card — shifted down for visual balance */}
            <div style={{ position: 'relative', zIndex: 30, paddingTop: 24, paddingLeft: 24, paddingRight: 24, transform: 'translateY(24px)' }}>
              <div
                ref={calcRef}
                style={{
                  marginLeft: 'auto',
                  width: '100%', maxWidth: 580,
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(203,213,225,0.7)',
                  boxShadow: '0 20px 48px rgba(0,0,0,0.10)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 28px 64px rgba(0,0,0,0.14)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 48px rgba(0,0,0,0.10)';
                }}
              >
                <ChargeableWeightCard />
              </div>
              <div style={{ marginTop: 16, marginLeft: 'auto', width: '100%', maxWidth: 580, fontSize: 11, color: '#94a3b8' }}>
                * 计费重量为参考值，具体以商家实时报价为准
              </div>
            </div>
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
