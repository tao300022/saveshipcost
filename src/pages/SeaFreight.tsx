import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, Table, Tag, Select, Button, Space, Typography, Row, Col, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { seaFreightData, SeaFreightPrice } from '../data/seaFreightData';
import { fetchDeliveryUpdates, fetchMerchants } from '../services/sscData';
import { getCompanyByName } from '../data/companyData';
import CorrectionModal, { CorrectionFormValues } from '../components/CorrectionModal';
import { saveCorrection } from '../services/corrections';

const { Title } = Typography;

const SeaFreight: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>();
  const [selectedType, setSelectedType]       = useState<string | undefined>();
  const [corrOpen, setCorrOpen]               = useState(false);
  const [corrRecord, setCorrRecord]           = useState<SeaFreightPrice | null>(null);
  const [dynSeaRows, setDynSeaRows]           = useState<SeaFreightPrice[]>([]);

  useEffect(() => {
    const parseNum = (s?: string) => parseFloat((s || '').replace(/[^\d.]/g, '')) || 0;
    Promise.all([fetchDeliveryUpdates(), fetchMerchants()]).then(([updates, merchants]) => {
      // 到货动态（兼容旧字段）
      const deliveryRows: SeaFreightPrice[] = updates
        .filter((d) => d.mode === 'sea' && (d as any).firstWeightPrice)
        .map((d) => {
          const priceStr = (d as any).firstWeightPrice as string;
          const price = parseFloat(priceStr) || 0;
          const kgMatch = priceStr.match(/\/\s*(\d+\.?\d*)/);
          const kg = kgMatch ? parseFloat(kgMatch[1]) : 21;
          return {
            company: d.merchantName, type: '海运', line: d.route,
            firstWeight: price, firstWeightKg: kg,
            additionalWeight: (d as any).additionalWeightPrice || '-',
            transitTime: d.eta, remarks: d.city,
          };
        });
      // 商家管理海运服务
      const merchantRows: SeaFreightPrice[] = [];
      merchants.forEach((m) => {
        (m.services || []).filter((s) => s.mode === 'sea').forEach((s) => {
          merchantRows.push({
            company:          m.name,
            type:             s.cargo === 'general' ? '海普' : '海敏',
            line:             '-',
            firstWeight:      parseNum(s.priceCAD),
            firstWeightKg:    parseNum(s.firstWeight) || 21,
            additionalWeight: s.additionalWeight || '-',
            transitTime:      `${s.etaMin}-${s.etaMax}`,
            remarks:          s.remark || m.cities.join('/'),
            priceCAD:         s.priceCAD || undefined,
            priceCNY:         s.priceCNY || undefined,
          });
        });
      });
      setDynSeaRows([...deliveryRows, ...merchantRows]);
    });
  }, []);

  const handleCorrSubmit = (values: CorrectionFormValues) => {
    if (!corrRecord) return;
    saveCorrection({
      source: 'sea',
      company: corrRecord.company,
      originalRecord: corrRecord as unknown as Record<string, unknown>,
      ...values,
    });
    message.success('已收到纠错建议，谢谢！');
    setCorrOpen(false);
  };

  // Get unique companies and types
  const allSeaData = useMemo(() => [...seaFreightData, ...dynSeaRows], [dynSeaRows]);
  const companies = useMemo(() => [...new Set(allSeaData.map(item => item.company))], [allSeaData]);
  const types = useMemo(() => [...new Set(allSeaData.map(item => item.type))], [allSeaData]);

  // Filter data
  const filteredData = useMemo(() => {
    return allSeaData.filter(item => {
      if (selectedCompany && item.company !== selectedCompany) return false;
      if (selectedType && item.type !== selectedType) return false;
      return true;
    });
  }, [selectedCompany, selectedType, allSeaData]);

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
      render: (text: string) => {
        const color = text.includes('普') ? 'blue' : 'orange';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '线路',
      dataIndex: 'line',
      key: 'line',
      width: 100,
      render: (text: string) => text || '-',
    },
    {
      title: '首重(加币)',
      key: 'firstWeight',
      render: (_: any, record: SeaFreightPrice) =>
        record.priceCAD
          ? <span>{record.priceCAD}</span>
          : <span>{record.firstWeight}/{record.firstWeightKg || 21}kg</span>,
    },
    {
      title: '续重 / 人民币',
      key: 'additionalWeight',
      render: (_: any, record: SeaFreightPrice) => {
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
      render: (_: unknown, record: SeaFreightPrice) => (
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
        <title>加拿大海运比价 – 中国寄加拿大拼柜整柜最低价 | SaveShipCost</title>
        <meta name="description" content="对比加拿大多家华人货代海运报价，支持拼柜（LCL）和整柜（FCL），覆盖渥太华、温哥华、多伦多。适合搬家家具、大件货物，20–40 天到达，价格最省。" />
        <meta name="keywords" content="加拿大海运比价, 中国寄加拿大海运, 拼柜价格, 整柜价格, sea freight Canada, cheapest sea freight to Canada from China, sea freight cost Canada, how long does sea freight from China to Canada take, LCL FCL Canada China, 温哥华海运搬家, 加拿大搬家海运, 家具海运, shipping cost from china to canada sea" />
      </Helmet>
      {corrRecord && (
        <CorrectionModal
          open={corrOpen}
          onClose={() => setCorrOpen(false)}
          record={corrRecord as unknown as Record<string, unknown>}
          source="sea"
          onSubmit={handleCorrSubmit}
        />
      )}
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
          <Title level={1} style={{ marginBottom: 8, fontSize: 30 }}>海运比价</Title>
          <p style={{ color: '#666' }}>比较多家公司的海运价格和服务时效</p>
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
      </Space>
      {/* SEO 内容区 */}
      <div style={{ background: '#f7f9ff', borderTop: '1px solid #e8edf5', padding: '40px 24px', marginTop: 16 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0d1b4b', marginBottom: 8 }}>
            加拿大海运比价 – 中国寄加拿大拼柜整柜最低价格
          </h2>
          <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.9, marginBottom: 16 }}>
            SaveShipCost 整合多家华人货代的<strong>中加海运报价</strong>，支持<strong>拼柜（LCL）</strong>和<strong>整柜（FCL）</strong>，20–40 天送达加拿大。适合<strong>搬家家具海运</strong>、大件货物、留学生回国行李整箱托运，价格比空运节省高达 60%。覆盖渥太华、温哥华（Richmond/Burnaby）、多伦多全境。
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>拼柜海运（LCL）</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>货物不足一个集装箱时，选择<strong>LCL 拼柜</strong>按体积计费，适合小批量货物，与其他客户共享舱位，经济实惠。</p>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>整柜海运（FCL）</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}><strong>FCL 整柜</strong>适合大量货物或<strong>加拿大搬家家具海运</strong>，独享集装箱，安全性高，单价更低。</p>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>温哥华海运搬家</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>温哥华是加拿大最大海运港口，<strong>温哥华海运搬家比价</strong>是我们的核心服务之一，对比多家报价轻松找到最优方案。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeaFreight;
