import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Typography } from 'antd';
import { EnvironmentOutlined, RightOutlined, NotificationOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchMerchants, Merchant, fetchCityAnnouncements, CityAnnouncement } from '../services/sscData';

const { Title, Paragraph } = Typography;

const CITY_LABELS: Record<string, string> = {
  Ottawa:    'Ottawa · 渥太华',
  Toronto:   'Toronto · 多伦多',
  Montreal:  'Montreal · 蒙特利尔',
  Vancouver: 'Vancouver · 温哥华',
  Calgary:   'Calgary · 卡尔加里',
  Edmonton:  'Edmonton · 埃德蒙顿',
  Winnipeg:  'Winnipeg · 温尼伯',
  Halifax:   'Halifax · 哈利法克斯',
};

const Ottawa: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCity = searchParams.get('city') || 'Ottawa';
  const cityLabel = CITY_LABELS[currentCity] ?? currentCity;

  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [announcements, setAnnouncements] = useState<CityAnnouncement[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    fetchMerchants().then((all) => setMerchants(all.filter((m) => m.cities.includes(currentCity))));
    fetchCityAnnouncements(currentCity).then(setAnnouncements);
  }, [currentCity]);

  const cityName = cityLabel.split('·')[1]?.trim() ?? currentCity;
  // zh meta reads better with the Chinese city name; other languages use the English name.
  const metaCity = i18n.language === 'zh' ? cityName : currentCity;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 20px' }}>
      <Helmet>
        <title>{t('pageMeta.ottawa.title', { city: metaCity })}</title>
        <meta name="description" content={t('pageMeta.ottawa.description', { city: metaCity })} />
        <meta name="keywords" content={t('pageMeta.ottawa.keywords', { city: metaCity })} />
      </Helmet>

      {/* 页面标题 */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <EnvironmentOutlined style={{ fontSize: 28, color: '#667eea' }} />
          <Title level={1} style={{ margin: 0, fontSize: 28 }}>{cityLabel}</Title>
        </div>
        <Paragraph style={{ color: '#666', marginBottom: 0 }}>
          以下为覆盖{cityName}地区的快递货代商家，点击进入查看详情、联系方式与服务报价
        </Paragraph>
      </div>

      {/* 左右布局 */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 24,
        alignItems: 'flex-start',
      }}>

        {/* 左：公告栏 */}
        <div style={{ flex: '0 0 55%', width: isMobile ? '100%' : undefined }}>
          <div style={{
            background: '#fffbe6',
            border: '1px solid #ffe58f',
            borderRadius: 12,
            padding: '16px 18px',
            minHeight: 120,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <NotificationOutlined style={{ color: '#faad14', fontSize: 16 }} />
              <span style={{ fontWeight: 600, fontSize: 15, color: '#ad6800' }}>最新公告</span>
            </div>

            {announcements.length === 0 ? (
              <p style={{ color: '#bbb', fontSize: 14, margin: 0 }}>暂无公告</p>
            ) : (
              announcements.map((ann, i) => (
                <div key={ann.id} style={{
                  borderBottom: i < announcements.length - 1 ? '1px solid #ffe58f' : 'none',
                  paddingBottom: i < announcements.length - 1 ? 14 : 0,
                  paddingTop: i > 0 ? 14 : 0,
                }}>
                  {ann.companyName && (
                    <p style={{ margin: '0 0 4px 0', fontSize: 13, fontWeight: 600, color: '#d46b08' }}>
                      {ann.companyName}
                    </p>
                  )}
                  {ann.content && (
                    <p style={{ margin: 0, fontSize: 14, color: '#595959', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                      {ann.content}
                    </p>
                  )}
                  {ann.imageUrl && (
                    <img
                      src={ann.imageUrl}
                      alt="公告图片"
                      style={{ maxWidth: '100%', marginTop: ann.content ? 8 : 0, borderRadius: 6, display: 'block' }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 右：快递公司列表 */}
        <div style={{ flex: 1, width: isMobile ? '100%' : undefined }}>
          <div style={{
            background: '#f8f7ff',
            border: '1px solid #e8e4ff',
            borderRadius: 12,
            padding: '16px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>🚚</span>
              <span style={{ fontWeight: 600, fontSize: 15, color: '#4a3aaa' }}>快递公司</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {merchants.map((merchant) => (
                <div
                  key={merchant.id}
                  onClick={() => navigate(`/merchant/${merchant.id}`)}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 12,
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(102,126,234,0.2)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(102,126,234,0.38)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 10px rgba(102,126,234,0.2)';
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
                    {merchant.name}
                  </span>
                  <RightOutlined style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }} />
                </div>
              ))}

              {merchants.length === 0 && (
                <div style={{ textAlign: 'center', color: '#aaa', padding: '40px 0', fontSize: 14 }}>
                  暂无 {currentCity} 地区商家信息
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 广告位 */}
      <div style={{
        marginTop: 32,
        border: '1px dashed #d9d9d9',
        borderRadius: 8,
        padding: '16px',
        textAlign: 'center',
        color: '#bbb',
        fontSize: 13,
        background: '#fafafa',
      }}>
        广告位
      </div>

      {/* SEO 内容区 */}
      <div style={{ background: '#f7f9ff', borderTop: '1px solid #e8edf5', padding: '40px 20px', marginTop: 16 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0d1b4b', marginBottom: 8 }}>
            渥太华华人快递推荐 – 寄中国最便宜货代比价
          </h2>
          <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.9, marginBottom: 16 }}>
            SaveShipCost 整合<strong>渥太华华人快递货代</strong>报价，覆盖 <strong>Nepean</strong>、<strong>Kanata</strong>、<strong>Gloucester</strong>、Orleans 等渥太华大区所有社区。无论是<strong>渥太华寄中国包裹</strong>、<strong>留学生行李托运</strong>，还是搬家货物，均可一键比价，找到最划算的中加跨境物流方案。
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>Nepean / Kanata 发货</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>居住在 <strong>Nepean</strong> 或 <strong>Kanata</strong> 的华人用户，可通过 SaveShipCost 查询本地上门取件的货代报价，无需自行送货。</p>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>留学生行李托运</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>卡尔顿大学、渥太华大学<strong>留学生</strong>寄回国行李，比较多家货代的<strong>超重行李海运/空运</strong>价格，轻松省钱。</p>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>渥太华寄中国最便宜</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}><strong>渥太华寄中国最便宜快递</strong>怎么找？对比本页列出的华人货代价格，空运低至 $8/kg，海运拼柜更省钱。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ottawa;
