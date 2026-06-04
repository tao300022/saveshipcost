import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, Button, Typography, Tag, Table, Modal } from 'antd';
import { SendOutlined, GlobalOutlined, RightOutlined, EnvironmentOutlined, NotificationOutlined, MinusOutlined, CloseOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import AdSlot from '../components/AdSlot';
import { AD_CONFIG } from '../config/ads';
import heroImage from '../assets/55.jpg';
import { fetchDeliveryUpdates, DeliveryUpdate, fetchCityAnnouncements, CityAnnouncement, fetchPopupNotices, PopupNotice } from '../services/sscData';
import ChargeableWeightCard from '../components/ChargeableWeightCard';
import { DEFAULT_LANG, isSupportedLang, type SupportedLang } from '../i18n/config';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang: SupportedLang = isSupportedLang(i18n.language)
    ? (i18n.language as SupportedLang)
    : DEFAULT_LANG;
  const localized = (path: string) => `/${lang}${path}`;

  const [deliveryUpdates, setDeliveryUpdates] = useState<DeliveryUpdate[]>([]);
  const [modeFilter, setModeFilter] = useState<'all' | 'air' | 'sea'>('all');
  const [cityAnnouncements, setCityAnnouncements] = useState<{ city: string; count: number; latest: CityAnnouncement }[]>([]);
  const calcRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
    navigate(localized(path));
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
      title: t('home.delivery.col.departDate'),
      dataIndex: 'departDate',
      key: 'departDate',
      width: 110,
    },
    {
      title: t('home.delivery.col.route'),
      dataIndex: 'route',
      key: 'route',
      width: 100,
      render: (v: string) => (
        <Tag color={v === 'CN->CA' ? 'blue' : 'green'}>{v}</Tag>
      ),
    },
    {
      title: t('home.delivery.col.city'),
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
      title: t('home.delivery.col.merchant'),
      dataIndex: 'merchantName',
      key: 'merchantName',
    },
    {
      title: t('home.delivery.col.arrival'),
      dataIndex: 'arrivalDate',
      key: 'arrivalDate',
      width: 110,
      render: (v: string | undefined) => v || <span style={{ color: '#bbb' }}>—</span>,
    },
    {
      title: t('home.delivery.col.mode'),
      dataIndex: 'mode',
      key: 'mode',
      width: 100,
      render: (v: string | undefined) => {
        if (!v) return <span style={{ color: '#bbb' }}>—</span>;
        return <Tag color={v === 'air' ? 'blue' : 'cyan'}>{v === 'air' ? t('home.delivery.mode.air') : t('home.delivery.mode.sea')}</Tag>;
      },
    },
    {
      title: t('home.delivery.col.eta'),
      dataIndex: 'eta',
      key: 'eta',
      width: 100,
      render: (v: string) => <Tag color="orange">{v}</Tag>,
    },
  ];

  return (
    <div>
      <Helmet>
        <title>{t('home.meta.title')}</title>
        <meta name="description" content={t('home.meta.description')} />
        <meta name="keywords" content={t('home.meta.keywords')} />
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
          <div>
            <div style={{
              fontSize: 12,
              color: '#aab4cc',
              letterSpacing: 3,
              marginBottom: 18,
              fontWeight: 500,
            }}>
              {t('home.hero.kicker')}
            </div>

            <Title level={1} style={{
              color: '#0d1b4b',
              fontWeight: 800,
              fontSize: isMobile ? 28 : 42,
              lineHeight: 1.25,
              marginBottom: 16,
              marginTop: 0,
            }}>
              {t('home.hero.titleLine1')}<br />{t('home.hero.titleLine2')}<br />
              <span style={{ color: '#667eea' }}>{t('home.hero.titleHighlight')}</span>
            </Title>

            <Paragraph style={{
              fontSize: 15,
              color: '#7a8ca8',
              marginBottom: 32,
              lineHeight: 1.9,
              maxWidth: 420,
            }}>
              {t('home.hero.subtitle')}
            </Paragraph>

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
              {t('home.hero.calcCta')}
            </Button>

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
                  <div style={{ fontWeight: 700, color: '#0d1b4b', fontSize: 14 }}>{t('home.hero.airCard.title')}</div>
                  <div style={{ fontSize: 12, color: '#8a9bb8', marginTop: 2 }}>{t('home.hero.airCard.subtitle')}</div>
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
                  <div style={{ fontWeight: 700, color: '#0d1b4b', fontSize: 14 }}>{t('home.hero.seaCard.title')}</div>
                  <div style={{ fontSize: 12, color: '#8a9bb8', marginTop: 2 }}>{t('home.hero.seaCard.subtitle')}</div>
                </div>
                <RightOutlined style={{ color: '#11998e', fontSize: 12 }} />
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: 660, minHeight: isMobile ? 'auto' : 520 }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 28,
              background: 'linear-gradient(135deg, #f8fafc 0%, #fff 50%, #f1f5f9 100%)',
              border: '1px solid rgba(203,213,225,0.6)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }} />

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

            <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 28 }}>
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
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: 120, zIndex: 20,
                background: 'linear-gradient(to top, #fff 0%, rgba(255,255,255,0.4) 60%, transparent 100%)',
              }} />
            </div>

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
                {t('home.hero.calcFootnote')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* City announcements */}
      {cityAnnouncements.length > 0 && (
        <div style={{ padding: '20px 20px 4px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <NotificationOutlined style={{ color: '#9254de', fontSize: 15 }} />
            <span style={{ fontWeight: 700, fontSize: 15, color: '#0d1b4b' }}>{t('home.announcements.heading')}</span>
            <span style={{ fontSize: 12, color: '#aaa', marginLeft: 4 }}>{t('home.announcements.subtitle')}</span>
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
                        {t('home.announcements.countSuffix', { count })}
                      </span>
                    )}
                  </div>
                  {latest.companyName && (
                    <div style={{ marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: '#531dab', background: '#efdbff', padding: '1px 7px', borderRadius: 8 }}>
                        {latest.companyName}
                      </span>
                    </div>
                  )}
                  <div style={{
                    fontSize: 12, color: '#3d1a6e', lineHeight: 1.65,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {latest.content}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: '#9254de', fontWeight: 500 }}>
                    {t('home.announcements.viewDetail')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ad slot — below hero */}
      <div style={{ padding: '12px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <AdSlot slotId="home_top_banner" variant="banner" enabled={AD_CONFIG.home_top_banner} />
      </div>

      {/* Recent delivery updates */}
      <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Title level={2} style={{ margin: 0 }}>{t('home.delivery.heading')}</Title>
          <Button type="link" onClick={() => handleNavigate('/ottawa')}>
            {t('home.delivery.viewMore')}
          </Button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['all', 'air', 'sea'] as const).map((f) => {
            const label = t(`home.delivery.filter.${f}` as const);
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
            locale={{ emptyText: t('home.delivery.empty') }}
          />
        </Card>
      </div>

      {/* Floating popup */}
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
              title={t('home.popup.expand')}
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
            <div style={{
              background: '#fff',
              borderRadius: 14,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              border: '1px solid #e4ebf8',
              overflow: 'hidden',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '10px 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BellOutlined style={{ color: '#fff', fontSize: 14 }} />
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{t('home.popup.title')}</span>
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
                    title={t('home.popup.minimize')}
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
                    title={t('home.popup.close')}
                  >
                    <CloseOutlined />
                  </button>
                </div>
              </div>
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

      {/* SEO content section — localized */}
      <div style={{ background: '#f7f9ff', borderTop: '1px solid #e8edf5', padding: '48px 20px 40px', marginTop: 16 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0d1b4b', marginBottom: 8 }}>
            {t('home.seo.heading')}
          </h2>
          <p style={{ fontSize: 14, color: '#5a6a8a', lineHeight: 1.9, marginBottom: 24 }}>
            <Trans i18nKey="home.seo.intro" components={{ 1: <strong /> }} />
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#667eea', marginBottom: 8 }}>{t('home.seo.air.title')}</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>
                <Trans i18nKey="home.seo.air.body" components={{ 1: <strong /> }} />
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#667eea', marginBottom: 8 }}>{t('home.seo.sea.title')}</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>
                <Trans i18nKey="home.seo.sea.body" components={{ 1: <strong /> }} />
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#667eea', marginBottom: 8 }}>{t('home.seo.student.title')}</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>
                <Trans i18nKey="home.seo.student.body" components={{ 1: <strong /> }} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ section — localized */}
      <div style={{ background: '#fff', borderTop: '1px solid #e8edf5', padding: '48px 20px 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0d1b4b', marginBottom: 8 }}>
            {t('home.seoFaq.heading')}
          </h2>
          <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.9, marginBottom: 24 }}>
            <Trans i18nKey="home.seoFaq.intro" components={{ 1: <strong /> }} />
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            <div style={{ background: '#f7f9ff', borderRadius: 10, padding: '18px 20px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>{t('home.seoFaq.time.title')}</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8, margin: 0 }}>
                <Trans i18nKey="home.seoFaq.time.body" components={{ 1: <strong />, br: <br /> }} />
              </p>
            </div>
            <div style={{ background: '#f7f9ff', borderRadius: 10, padding: '18px 20px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>{t('home.seoFaq.cost.title')}</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8, margin: 0 }}>
                <Trans i18nKey="home.seoFaq.cost.body" components={{ 1: <strong />, br: <br /> }} />
              </p>
            </div>
            <div style={{ background: '#f7f9ff', borderRadius: 10, padding: '18px 20px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>{t('home.seoFaq.us.title')}</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8, margin: 0 }}>
                <Trans i18nKey="home.seoFaq.us.body" components={{ 1: <strong /> }} />
              </p>
            </div>
          </div>
        </div>
      </div>

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
            alt={t('home.popup.preview')}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8 }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Home;
