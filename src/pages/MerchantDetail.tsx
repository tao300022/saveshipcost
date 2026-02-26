import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Tag, Typography, Space, Table } from 'antd';
import { ArrowLeftOutlined, WechatOutlined } from '@ant-design/icons';
import { getMerchantById, Merchant, ServiceItem } from '../services/sscData';

const { Title, Paragraph, Text } = Typography;

const modeLabel  = (v: string) => v === 'air' ? '✈️ 空运' : '🚢 海运';
const cargoLabel = (v: string) => v === 'general' ? '普货' : '敏货';
const speedLabel = (v: string) => v === 'fast' ? '快线' : '慢线';

const MerchantDetail: React.FC = () => {
  const { merchantId } = useParams<{ merchantId: string }>();
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<Merchant | undefined>();

  useEffect(() => {
    if (merchantId) setMerchant(getMerchantById(merchantId));
  }, [merchantId]);

  if (!merchant) {
    return (
      <div style={{ maxWidth: 800, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <Text type="secondary" style={{ fontSize: 16 }}>商家信息不存在或已下架</Text>
        <br />
        <Button type="link" onClick={() => navigate('/ottawa')} style={{ marginTop: 12 }}>
          ← 返回 Ottawa 商家列表
        </Button>
      </div>
    );
  }

  const serviceColumns = [
    {
      title: '运输方式',
      dataIndex: 'mode',
      key: 'mode',
      render: (v: string) => (
        <Tag color={v === 'air' ? 'blue' : 'cyan'}>{modeLabel(v)}</Tag>
      ),
    },
    {
      title: '货物类型',
      dataIndex: 'cargo',
      key: 'cargo',
      render: (v: string) => (
        <Tag color={v === 'general' ? 'default' : 'orange'}>{cargoLabel(v)}</Tag>
      ),
    },
    {
      title: '线路',
      dataIndex: 'speed',
      key: 'speed',
      render: (v: string) => (
        <Tag color={v === 'fast' ? 'red' : 'green'}>{speedLabel(v)}</Tag>
      ),
    },
    {
      title: '服务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '时效（天）',
      key: 'eta',
      render: (_: unknown, row: ServiceItem) => `${row.etaMin} - ${row.etaMax}`,
    },
  ];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>

      <Button
        icon={<ArrowLeftOutlined />}
        type="text"
        onClick={() => navigate('/ottawa')}
        style={{ marginBottom: 20, paddingLeft: 0 }}
      >
        返回 Ottawa 商家列表
      </Button>

      {/* 商家名称 + 简介 */}
      <Card style={{ borderRadius: 16, marginBottom: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, color: '#fff', flexShrink: 0,
          }}>
            🚚
          </div>
          <div>
            <Title level={3} style={{ margin: 0 }}>{merchant.name}</Title>
            <Space style={{ marginTop: 4 }}>
              {merchant.cities.map((c) => (
                <Tag key={c} color="blue">{c}</Tag>
              ))}
            </Space>
          </div>
        </div>
        <Paragraph style={{ color: '#555', lineHeight: 1.8, margin: 0 }}>
          {merchant.intro}
        </Paragraph>
      </Card>

      {/* 联系方式 */}
      <Card
        title="联系方式"
        style={{ borderRadius: 16, marginBottom: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
          <pre style={{
            fontFamily: 'inherit',
            margin: 0,
            color: '#444',
            lineHeight: 2,
            fontSize: 14,
            whiteSpace: 'pre-wrap',
          }}>
            {merchant.contact}
          </pre>

          {/* 微信二维码 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {merchant.wechatQrUrl ? (
              <img
                src={merchant.wechatQrUrl}
                alt="微信二维码"
                style={{
                  width: 140, height: 140, borderRadius: 12,
                  objectFit: 'cover', border: '1px solid #eee',
                }}
              />
            ) : (
              <div style={{
                width: 140, height: 140, borderRadius: 12,
                background: '#f5f5f5', border: '1px dashed #d9d9d9',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: '#bbb', gap: 8,
              }}>
                <WechatOutlined style={{ fontSize: 32 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>微信二维码</Text>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 服务信息 */}
      {merchant.services.length > 0 && (
        <Card
          title="服务信息"
          style={{ borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}
        >
          <Table
            dataSource={merchant.services}
            columns={serviceColumns}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>
      )}
    </div>
  );
};

export default MerchantDetail;
