import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, Table, Tag, Select, Button, Space, Typography, Row, Col, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { airFreightData, AirFreightPrice } from '../data/airFreightData';
import { fetchDeliveryUpdates, fetchMerchants } from '../services/sscData';
import { getCompanyByName } from '../data/companyData';
import AdSlot from '../components/AdSlot';
import { AD_CONFIG } from '../config/ads';
import CorrectionModal, { CorrectionFormValues } from '../components/CorrectionModal';
import { saveCorrection } from '../services/corrections';

const { Title } = Typography;

const AirFreight: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>();
  const [selectedType, setSelectedType]       = useState<string | undefined>();
  const [corrOpen, setCorrOpen]               = useState(false);
  const [corrRecord, setCorrRecord]           = useState<AirFreightPrice | null>(null);
  const [dynAirRows, setDynAirRows] = useState<AirFreightPrice[]>([]);

  useEffect(() => {
    const parseNum = (s?: string) => parseFloat((s || '').replace(/[^\d.]/g, '')) || 0;
    Promise.all([fetchDeliveryUpdates(), fetchMerchants()]).then(([updates, merchants]) => {
      // 到货动态（兼容旧字段）
      const deliveryRows: AirFreightPrice[] = updates
        .filter((d) => d.mode === 'air' && (d as any).firstWeightPrice)
        .map((d) => {
          const priceStr = (d as any).firstWeightPrice as string;
          const price = parseFloat(priceStr) || 0;
          const kgMatch = priceStr.match(/\/\s*(\d+\.?\d*)/);
          const kg = kgMatch ? parseFloat(kgMatch[1]) : 0.5;
          return {
            company: d.merchantName, type: '空运', line: d.route,
            firstWeight: price, firstWeightKg: kg,
            additionalWeight: (d as any).additionalWeightPrice || '-',
            transitTime: d.eta, remarks: d.city,
          };
        });
      // 商家管理空运服务
      const merchantRows: AirFreightPrice[] = [];
      merchants.forEach((m) => {
        (m.services || []).filter((s) => s.mode === 'air').forEach((s) => {
          merchantRows.push({
            company:          m.name,
            type:             s.cargo === 'general' ? '空普' : '空敏',
            line:             '-',
            firstWeight:      parseNum(s.priceCAD),
            firstWeightKg:    parseNum(s.firstWeight) || 0.5,
            additionalWeight: s.additionalWeight || '-',
            transitTime:      `${s.etaMin}-${s.etaMax}`,
            remarks:          s.remark || m.cities.join('/'),
            priceCAD:         s.priceCAD  || undefined,
            priceCNY:         s.priceCNY  || undefined,
          });
        });
      });
      setDynAirRows([...deliveryRows, ...merchantRows]);
    });
  }, []);

  const handleCorrSubmit = (values: CorrectionFormValues) => {
    if (!corrRecord) return;
    saveCorrection({
      source: 'air',
      company: corrRecord.company,
      originalRecord: corrRecord as unknown as Record<string, unknown>,
      ...values,
    });
    message.success('已收到纠错建议，谢谢！');
    setCorrOpen(false);
  };

  // Get unique companies and types
  const allAirData = useMemo(() => [...airFreightData, ...dynAirRows], [dynAirRows]);
  const companies = useMemo(() => [...new Set(allAirData.map(item => item.company))], [allAirData]);
  const types = useMemo(() => [...new Set(allAirData.map(item => item.type))], [allAirData]);

  // Filter data
  const filteredData = useMemo(() => {
    return allAirData.filter(item => {
      if (selectedCompany && item.company !== selectedCompany) return false;
      if (selectedType && item.type !== selectedType) return false;
      return true;
    });
  }, [selectedCompany, selectedType, allAirData]);

  const handleReset = () => {
    setSelectedCompany(undefined);
    setSelectedType(undefined);
  };

  const handleCompanyClick = (companyName: string) => {
    const company = getCompanyByName(companyName);
    if (company) {
      navigate(`/company/${company.id}`);
    }
  };

  const columns = [
    {
      title: '公司名称',
      dataIndex: 'company',
      key: 'company',
      render: (text: string) => (
        <Button type="link" onClick={() => handleCompanyClick(text)} style={{ padding: 0 }}>
          {text}
        </Button>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => <Tag color={text === '空普' ? 'blue' : 'orange'}>{text}</Tag>,
    },
    {
      title: '线路',
      dataIndex: 'line',
      key: 'line',
      render: (text: string) => text || '-',
    },
    {
      title: '首重(加币)',
      key: 'firstWeight',
      render: (_: any, record: AirFreightPrice) =>
        record.priceCAD
          ? <span>{record.priceCAD}</span>
          : <span>{record.firstWeight}/{record.firstWeightKg}kg</span>,
    },
    {
      title: '续重 / 人民币',
      key: 'additionalWeight',
      render: (_: any, record: AirFreightPrice) => {
        const parts = [record.additionalWeight !== '-' ? record.additionalWeight : '', record.priceCNY || ''].filter(Boolean);
        return <span>{parts.join(' / ') || '-'}</span>;
      },
    },
    {
      title: '时效(天)',
      dataIndex: 'transitTime',
      key: 'transitTime',
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (text: string) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 72,
      fixed: 'right' as const,
      render: (_: unknown, record: AirFreightPrice) => (
        <Button
          size="small"
          type="link"
          onClick={() => { setCorrRecord(record); setCorrOpen(true); }}
        >
          纠错
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      <Helmet>
        <title>加拿大空运比价 – 中国寄加拿大最便宜空运价格 | SaveShipCost</title>
        <meta name="description" content="对比加拿大多家华人货代空运报价，查看首重续重、时效天数。支持渥太华、温哥华、多伦多发货，普货敏感货均可，5–10 天到达，找到最优惠的中加空运方案。" />
        <meta name="keywords" content="加拿大空运比价, 中国寄加拿大空运, 华人货代空运, 最便宜空运, air freight Canada China, Ottawa air freight, 急件寄中国, 敏感货空运" />
      </Helmet>
      <Row gutter={[24, 0]}>
        {/* 主内容区 */}
        <Col xs={24} md={18}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header */}
            <div>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/')}
                style={{ marginBottom: 16 }}
              >
                返回首页
              </Button>
              <Title level={2} style={{ marginBottom: 8 }}>空运比价</Title>
              <p style={{ color: '#666' }}>比较多家公司的空运价格和服务时效</p>
            </div>

            {/* Filters */}
            <Card>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>筛选公司</label>
                  <Select
                    placeholder="选择公司"
                    allowClear
                    style={{ width: '100%' }}
                    value={selectedCompany}
                    onChange={setSelectedCompany}
                    options={companies.map(c => ({ label: c, value: c }))}
                  />
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>筛选类型</label>
                  <Select
                    placeholder="选择类型"
                    allowClear
                    style={{ width: '100%' }}
                    value={selectedType}
                    onChange={setSelectedType}
                    options={types.map(t => ({ label: t, value: t }))}
                  />
                </Col>
                <Col xs={24} sm={24} md={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button onClick={handleReset}>重置筛选</Button>
                </Col>
              </Row>
            </Card>

            {/* Results */}
            <Card title={`共 ${filteredData.length} 条结果`}>
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey={(record, index) => `${record.company}-${record.type}-${index}`}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
              />
            </Card>

            {/* ③ 表格下方 Infeed 广告位 */}
            <AdSlot slotId="airfreight_infeed" variant="infeed" enabled={AD_CONFIG.airfreight_infeed} />
          </Space>
        </Col>

        {/* ② 右侧 Sidebar 广告位 */}
        <Col xs={24} md={6}>
          <div style={{ position: 'sticky', top: 24 }}>
            <AdSlot slotId="airfreight_sidebar" variant="sidebar" enabled={AD_CONFIG.airfreight_sidebar} />
          </div>
        </Col>
      </Row>

      {/* 纠错弹窗（放在 Row 外，避免布局影响） */}
      {corrRecord && (
        <CorrectionModal
          open={corrOpen}
          onClose={() => setCorrOpen(false)}
          record={corrRecord as unknown as Record<string, unknown>}
          source="air"
          onSubmit={handleCorrSubmit}
        />
      )}

      {/* SEO 内容区 */}
      <div style={{ background: '#f7f9ff', borderTop: '1px solid #e8edf5', padding: '40px 24px', marginTop: 16 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0d1b4b', marginBottom: 8 }}>
            加拿大空运比价 – 中国寄加拿大最便宜空运价格查询
          </h2>
          <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.9, marginBottom: 16 }}>
            SaveShipCost 整合多家华人货代的<strong>中加空运报价</strong>，支持<strong>普货</strong>与<strong>敏感货空运</strong>（电子产品、化妆品、锂电池等），5–10 天送达加拿大。适合<strong>急件寄中国</strong>、小包裹、留学生行李托运，覆盖渥太华（Ottawa/Nepean/Kanata）、温哥华、多伦多、卡尔加里全境。
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>普货空运</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>衣物、书籍、日用品等普通货物，价格最低，通关顺畅，是<strong>中国寄加拿大空运</strong>最常见选择。</p>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>敏感货空运</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>电子产品、锂电池、液体、化妆品等<strong>敏感货空运</strong>需走特殊渠道，我们整合了支持敏感货的货代报价供您比较。</p>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>急件寄中国</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>有<strong>急件寄中国</strong>需求？空运最快 5 天送达，比较各家价格后选择速度最快、费用最合理的方案。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirFreight;
