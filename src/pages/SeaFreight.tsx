import React, { useState, useMemo } from 'react';
import { Card, Table, Tag, Select, Button, Space, Typography, Row, Col, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { seaFreightData, SeaFreightPrice } from '../data/seaFreightData';
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
  const companies = useMemo(() => [...new Set(seaFreightData.map(item => item.company))], []);
  const types = useMemo(() => [...new Set(seaFreightData.map(item => item.type))], []);

  // Filter data
  const filteredData = useMemo(() => {
    return seaFreightData.filter(item => {
      if (selectedCompany && item.company !== selectedCompany) return false;
      if (selectedType && item.type !== selectedType) return false;
      return true;
    });
  }, [selectedCompany, selectedType]);

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
      title: '首重',
      key: 'firstWeight',
      render: (_: any, record: SeaFreightPrice) => (
        <span>{record.firstWeight}/{record.firstWeightKg || 21}kg</span>
      ),
    },
    {
      title: '续重',
      dataIndex: 'additionalWeight',
      key: 'additionalWeight',
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
          <Title level={2} style={{ marginBottom: 8 }}>海运比价</Title>
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
    </div>
  );
};

export default SeaFreight;
