import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Typography } from 'antd';
import { EnvironmentOutlined, RightOutlined, NotificationOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMerchants, Merchant, fetchCityAnnouncements, CityAnnouncement } from '../services/sscData';

const { Title, Paragraph } = Typography;

const CITY_LABELS: Record<string, string> = {
  Ottawa:    'Ottawa · 渥太华',
  Toronto:   'Toronto · 多伦多',
  Montreal:  'Montreal · 蒙特利尔',
  Vancouver: 'Vancouver · 温哥华',
};

const Ottawa: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCity = searchParams.get('city') || 'Ottawa';
  const cityLabel = CITY_LABELS[currentCity] ?? currentCity;

  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [announcements, setAnnouncements] = useState<CityAnnouncement[]>([]);

  useEffect(() => {
    const all = getMerchants();
    setMerchants(all.filter((m) => m.cities.includes(currentCity)));
    fetchCityAnnouncements(currentCity).then(setAnnouncements);
  }, [currentCity]);

  const cityName = cityLabel.split('·')[1]?.trim() ?? currentCity;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 20px' }}>
      <Helmet>
        <title>{cityLabel} 华人快递货代商家 | SaveShipCost</title>
        <meta name="description" content={`查看${cityName}地区华人快递货代商家列表，了解各商家联系方式、服务范围与运费报价，轻松找到靠谱的中加跨境物流服务。`} />
      </Helmet>

      {/* 页面标题 */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <EnvironmentOutlined style={{ fontSize: 28, color: '#667eea' }} />
          <Title level={2} style={{ margin: 0 }}>{cityLabel}</Title>
        </div>
        <Paragraph style={{ color: '#666', marginBottom: 0 }}>
          以下为覆盖{cityLabel.split('·')[1]?.trim() ?? currentCity}地区的快递货代商家，点击进入查看详情、联系方式与服务报价
        </Paragraph>
      </div>

      {/* 公告栏 */}
      {announcements.length > 0 && (
        <div style={{
          background: '#fffbe6',
          border: '1px solid #ffe58f',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}>
          <NotificationOutlined style={{ color: '#faad14', fontSize: 18, marginTop: 2, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            {announcements.map((ann, i) => (
              <div key={ann.id} style={{
                borderBottom: i < announcements.length - 1 ? '1px solid #ffe58f' : 'none',
                paddingBottom: i < announcements.length - 1 ? 10 : 0,
                paddingTop: i > 0 ? 10 : 0,
              }}>
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
            ))}
          </div>
        </div>
      )}

      {/* 商家按钮网格 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 20,
        marginBottom: 40,
      }}>
        {merchants.map((merchant) => (
          <div
            key={merchant.id}
            onClick={() => navigate(`/merchant/${merchant.id}`)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 16,
              padding: '28px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(102,126,234,0.25)',
              minHeight: 120,
              textAlign: 'center',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 32px rgba(102,126,234,0.42)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(102,126,234,0.25)';
            }}
          >
            <span style={{ fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
              {merchant.name}
            </span>
            <RightOutlined style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }} />
          </div>
        ))}

        {merchants.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            color: '#aaa',
            padding: '60px 0',
          }}>
            暂无 {currentCity} 地区商家信息
          </div>
        )}
      </div>

      {/* 广告位 — 商家网格下方 */}
      {/* [AD_SLOT: ottawa_below_merchants] */}
      <div style={{
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
    </div>
  );
};

export default Ottawa;
