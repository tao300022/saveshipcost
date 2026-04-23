import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, Button, Typography, Tag, Table, Modal } from 'antd';
import { SendOutlined, GlobalOutlined, RightOutlined, EnvironmentOutlined, NotificationOutlined, MinusOutlined, CloseOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdSlot from '../components/AdSlot';
import { AD_CONFIG } from '../config/ads';
import heroImage from '../assets/55.jpg';
import { fetchDeliveryUpdates, DeliveryUpdate, fetchCityAnnouncements, CityAnnouncement, fetchPopupNotices, PopupNotice } from '../services/sscData';
import ChargeableWeightCard from '../components/ChargeableWeightCard';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [deliveryUpdates, setDeliveryUpdates] = useState<DeliveryUpdate[]>([]);
  const [modeFilter, setModeFilter] = useState<'all' | 'air' | 'sea'>('all');
  const [cityAnnouncements, setCityAnnouncements] = useState<{ city: string; count: number; latest: CityAnnouncement }[]>([]);
  const calcRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Floating popup state
  const [popupNotices, setPopupNotices] = useState<PopupNotice[]>([]);
  const [popupMinimized, setPopupMinimized] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(() =>
    sessionStorage.getItem('ssc_popup_dismissed') === 'true'
  );
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const handlePopupClose = () => {
    setPopupDismissed(true);
    sessionStorage.setItem('ssc_popup_dismissed', 'true');
  };

  useEffect(() => {
    fetchDeliveryUpdates().then(setDeliveryUpdates);
    fetchPopupNotices().then((list) => setPopupNotices(list.filter((n) => n.isActive)));
    fetchCityAnnouncements().then((list) => {
      const map: Record<string, CityAnnouncement[]> = {};
      list.forEach((a) => {
        const key = a.city.charAt(0).toUpperCase() + a.city.slice(1);
        (map[key] = map[key] || []).push(a);
      });
      setCityAnnouncements(
        Object.entries(map).map(([city, items]) => ({ city, count: items.length, latest: items[0] }))
      );
    });
  }, []);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
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
      title: '到货日期',
      dataIndex: 'arrivalDate',
      key: 'arrivalDate',
      width: 110,
      render: (v: string | undefined) => v || <span style={{ color: '#bbb' }}>—</span>,
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
      <Helmet>
        <title>SaveShipCost | 加拿大华人快递比价 – 整合 FedEx/UPS/华人货代，一键省钱</title>
        <meta name="description" content="SaveShipCost 是加拿大首家华人快递比价平台。实时对比 FedEx、UPS、DHL 及多家华人货代报价，支持空运海运，覆盖渥太华、温哥华、多伦多全境。帮您寄往中国及全球时节省高达 60% 运费。" />
        <meta name="keywords" content="加拿大快递比价, 华人快递推荐, 国际运费查询, 渥太华寄中国, 温哥华海运, 留学生行李托运, 中国寄加拿大, 最便宜货运, SaveShipCost, ship to canada, cheapest shipping to canada from china, shipping cost from china to canada, how long does shipping take to canada, china canada freight, air freight canada, sea freight canada, shipping from china to canada, Ottawa shipping, international shipping comparison" />
      </Helmet>
      {/* Hero Section */}
      <div style={{
        background: '#fff',
        padding: isMobile ? '40px 16px' : '80px 20px',
        borderBottom: '1px solid #eef1fb',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 24 : 64,
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
              fontSize: isMobile ? 28 : 42,
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
          <div style={{ position: 'relative', width: '100%', maxWidth: 660, minHeight: isMobile ? 'auto' : 520 }}>

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
            <div style={{ position: 'relative', zIndex: 30, paddingTop: 24, paddingLeft: isMobile ? 0 : 24, paddingRight: isMobile ? 0 : 24, transform: isMobile ? 'none' : 'translateY(24px)' }}>
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

      {/* 城市公告 */}
      {cityAnnouncements.length > 0 && (
        <div style={{ padding: '20px 20px 4px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <NotificationOutlined style={{ color: '#9254de', fontSize: 15 }} />
            <span style={{ fontWeight: 700, fontSize: 15, color: '#0d1b4b' }}>城市公告</span>
            <span style={{ fontSize: 12, color: '#aaa', marginLeft: 4 }}>各城市最新优惠 · 点击查看详情</span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {cityAnnouncements.map(({ city, count, latest }) => {
              const displayCity = city.charAt(0).toUpperCase() + city.slice(1);
              const cityPath = city === 'Ottawa' || city.toLowerCase() === 'ottawa'
                ? '/ottawa' : `/ottawa?city=${displayCity}`;
              return (
                <div
                  key={city}
                  onClick={() => handleNavigate(cityPath)}
                  style={{
                    flex: '1 1 200px', maxWidth: 300, minWidth: 180,
                    background: '#f9f0ff', border: '1px solid #d3adf7',
                    borderRadius: 12, padding: '12px 14px',
                    cursor: 'pointer', transition: 'box-shadow 0.15s, transform 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(114,46,209,0.15)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  }}
                >
                  {/* 第一行：城市 + 数量 */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{
                      background: '#722ed1', color: '#fff',
                      fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 10,
                      whiteSpace: 'nowrap',
                    }}>
                      <EnvironmentOutlined style={{ fontSize: 10, marginRight: 3 }} />{displayCity}
                    </span>
                    {count > 1 && (
                      <span style={{ fontSize: 11, color: '#9254de', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        共{count}条
                      </span>
                    )}
                  </div>
                  {/* 第二行：公司名（若有） */}
                  {latest.companyName && (
                    <div style={{ marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: '#531dab', background: '#efdbff', padding: '1px 7px', borderRadius: 8 }}>
                        {latest.companyName}
                      </span>
                    </div>
                  )}
                  {/* 公告内容预览 */}
                  <div style={{
                    fontSize: 12, color: '#3d1a6e', lineHeight: 1.65,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {latest.content}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: '#9254de', fontWeight: 500 }}>
                    查看详情 →
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
          marginBottom: 16,
        }}>
          <Title level={2} style={{ margin: 0 }}>快递到货动态</Title>
          <Button type="link" onClick={() => handleNavigate('/ottawa')}>
            查看更多商家 →
          </Button>
        </div>
        {/* 运输方式筛选 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['all', 'air', 'sea'] as const).map((f) => {
            const label = f === 'all' ? '全部' : f === 'air' ? '空运' : '海运';
            const active = modeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setModeFilter(f)}
                style={{
                  padding: '4px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13,
                  border: active ? '1.5px solid #667eea' : '1.5px solid #e4ebf8',
                  background: active ? '#eef1ff' : '#f7f9ff',
                  color: active ? '#4361b8' : '#5a6a8a',
                  fontWeight: active ? 600 : 400,
                  outline: 'none',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
        <Card style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <Table
            dataSource={modeFilter === 'all' ? deliveryUpdates : deliveryUpdates.filter(d => d.mode === modeFilter)}
            columns={deliveryColumns}
            rowKey="id"
            pagination={{ pageSize: 5, size: 'small' }}
            size="small"
            scroll={{ x: 'max-content' }}
            locale={{ emptyText: '暂无到货动态，请等待管理员更新' }}
          />
        </Card>
      </div>

      {/* 浮动公告窗口 */}
      {!popupDismissed && popupNotices.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: popupMinimized ? 'auto' : (isMobile ? 'calc(100vw - 48px)' : 320),
          maxWidth: isMobile ? 'calc(100vw - 48px)' : 320,
        }}>
          {popupMinimized ? (
            /* 最小化状态：悬浮按钮 */
            <button
              onClick={() => setPopupMinimized(false)}
              style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(102,126,234,0.45)',
                color: '#fff', fontSize: 20,
                position: 'relative',
              }}
              title="展开公告"
            >
              <BellOutlined />
              <span style={{
                position: 'absolute', top: -2, right: -2,
                width: 16, height: 16, borderRadius: '50%',
                background: '#ff4d4f', border: '2px solid #fff',
                fontSize: 10, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, lineHeight: 1,
              }}>
                {popupNotices.length}
              </span>
            </button>
          ) : (
            /* 展开状态：公告卡片 */
            <div style={{
              background: '#fff',
              borderRadius: 14,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              border: '1px solid #e4ebf8',
              overflow: 'hidden',
            }}>
              {/* 标题栏 */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '10px 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BellOutlined style={{ color: '#fff', fontSize: 14 }} />
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>最新公告</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setPopupMinimized(true)}
                    style={{
                      width: 24, height: 24, borderRadius: 6,
                      background: 'rgba(255,255,255,0.2)', border: 'none',
                      cursor: 'pointer', color: '#fff', fontSize: 13,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    title="最小化"
                  >
                    <MinusOutlined />
                  </button>
                  <button
                    onClick={handlePopupClose}
                    style={{
                      width: 24, height: 24, borderRadius: 6,
                      background: 'rgba(255,255,255,0.2)', border: 'none',
                      cursor: 'pointer', color: '#fff', fontSize: 13,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    title="关闭"
                  >
                    <CloseOutlined />
                  </button>
                </div>
              </div>
              {/* 公告内容列表 */}
              <div style={{ maxHeight: 300, overflowY: 'auto', padding: '12px 14px' }}>
                {popupNotices.map((notice, idx) => (
                  <div
                    key={notice.id}
                    style={{
                      paddingBottom: idx < popupNotices.length - 1 ? 12 : 0,
                      marginBottom: idx < popupNotices.length - 1 ? 12 : 0,
                      borderBottom: idx < popupNotices.length - 1 ? '1px solid #f0f0f0' : 'none',
                    }}
                  >
                    {notice.title && (
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#0d1b4b', marginBottom: 4 }}>
                        {notice.title}
                      </div>
                    )}
                    <div style={{ fontSize: 13, color: '#444', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                      {notice.content}
                    </div>
                    {notice.imageUrls && notice.imageUrls.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                        {notice.imageUrls.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt=""
                            style={{
                              width: 72, height: 72,
                              objectFit: 'cover', borderRadius: 6,
                              border: '1px solid #eee', cursor: 'pointer',
                            }}
                            onClick={() => setPreviewImg(src)}
                          />
                        ))}
                      </div>
                    )}
                    {notice.linkUrl && (
                      <div style={{ marginTop: 8 }}>
                        {notice.linkText && (
                          <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{notice.linkText}</div>
                        )}
                        <a
                          href={notice.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 12,
                            color: '#667eea',
                            wordBreak: 'break-all',
                            textDecoration: 'underline',
                          }}
                        >
                          {notice.linkUrl}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SEO 关键词内容区 */}
      <div style={{ background: '#f7f9ff', borderTop: '1px solid #e8edf5', padding: '48px 20px 40px', marginTop: 16 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0d1b4b', marginBottom: 8 }}>
            加拿大华人快递比价平台 – 一键找到最便宜国际运费
          </h2>
          <p style={{ fontSize: 14, color: '#5a6a8a', lineHeight: 1.9, marginBottom: 24 }}>
            SaveShipCost 整合加拿大多家华人货代与主流快递（FedEx、UPS、DHL）的实时报价，帮助渥太华、温哥华、多伦多、蒙特利尔的华人用户快速完成<strong>国际运费比价</strong>。无论是<strong>中国寄加拿大空运</strong>、<strong>加拿大海运回国</strong>，还是<strong>留学生行李托运</strong>、<strong>搬家家具整柜</strong>，都能一键对比价格与时效，省去逐家询价的烦恼。
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#667eea', marginBottom: 8 }}>✈️ 空运比价</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>
                对比多家货代的<strong>中加空运价格</strong>，普货、敏感货均可查询，5–10 天送达，适合急件、小包裹。覆盖渥太华（Ottawa/Nepean/Kanata）、温哥华、多伦多全境。
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#667eea', marginBottom: 8 }}>🚢 海运比价</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>
                支持<strong>拼柜（LCL）</strong>和<strong>整柜（FCL）</strong>海运报价查询，适合搬家家具、大件货物，20–40 天到达，价格比空运节省高达 60%。
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#667eea', marginBottom: 8 }}>🎓 留学生专区</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>
                专为<strong>加拿大留学生行李托运</strong>设计，比较各货代<strong>超重行李</strong>、<strong>学习用品</strong>寄回国的价格，找到最划算方案。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* English SEO section – targeting "ship to canada" keyword cluster */}
      <div style={{ background: '#fff', borderTop: '1px solid #e8edf5', padding: '48px 20px 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0d1b4b', marginBottom: 8 }}>
            Cheapest Shipping from China to Canada – Compare Freight Forwarder Rates
          </h2>
          <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.9, marginBottom: 24 }}>
            SaveShipCost is Canada's #1 comparison platform for <strong>shipping from China to Canada</strong>. We aggregate live quotes from Chinese freight forwarders (货代) so you can find the <strong>cheapest shipping to Canada</strong> without calling every provider. Whether you need <strong>air freight</strong> (5–10 days) or <strong>sea freight</strong> (20–40 days), covering Ottawa, Vancouver, Toronto, Calgary and more.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            <div style={{ background: '#f7f9ff', borderRadius: 10, padding: '18px 20px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>How long does shipping take?</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8, margin: 0 }}>
                <strong>Air freight</strong>: 5–10 business days from China to Canada.<br />
                <strong>Sea freight LCL</strong>: 20–35 days.<br />
                <strong>Sea freight FCL</strong>: 25–40 days.<br />
                Express (DHL/FedEx): 3–7 days at premium cost.
              </p>
            </div>
            <div style={{ background: '#f7f9ff', borderRadius: 10, padding: '18px 20px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>How much does it cost to ship to Canada?</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8, margin: 0 }}>
                Air freight: <strong>$6–15 CAD/kg</strong>.<br />
                Sea freight LCL: <strong>$3–8 CAD/kg</strong> equivalent.<br />
                Chinese freight forwarders are 30–60% cheaper than DHL/FedEx for parcels over 5 kg.
              </p>
            </div>
            <div style={{ background: '#f7f9ff', borderRadius: 10, padding: '18px 20px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>Shipping from US to Canada</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8, margin: 0 }}>
                Need to ship from the US to Canada? Use USPS + Canada Post for small parcels, or a US forwarding address if a retailer doesn't ship cross-border. For <strong>China ↔ Canada</strong>, compare freight forwarders here on SaveShipCost.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 图片大图预览 Modal */}
      <Modal
        open={!!previewImg}
        footer={null}
        onCancel={() => setPreviewImg(null)}
        centered
        width="auto"
        styles={{ body: { padding: 0, textAlign: 'center' } }}
      >
        {previewImg && (
          <img
            src={previewImg}
            alt="预览"
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8 }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Home;
