import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import { EnvironmentOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMerchants, Merchant } from '../services/sscData';

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

  useEffect(() => {
    const all = getMerchants();
    setMerchants(all.filter((m) => m.cities.includes(currentCity)));
  }, [currentCity]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 20px' }}>

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
