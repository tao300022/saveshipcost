import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, Table, Tag, Select, Button, Space, Typography, Row, Col, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { airFreightData, AirFreightPrice } from '../data/airFreightData';
import { fetchDeliveryUpdates, fetchMerchants } from '../services/sscData';
import { getCompanyByName } from '../data/companyData';
import AdSlot from '../components/AdSlot';
import { AD_CONFIG } from '../config/ads';
import CorrectionModal, { CorrectionFormValues } from '../components/CorrectionModal';
import { saveCorrection } from '../services/corrections';
import { DEFAULT_LANG, isSupportedLang, type SupportedLang } from '../i18n/config';

const { Title } = Typography;

const AirFreight: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang: SupportedLang = isSupportedLang(i18n.language)
    ? (i18n.language as SupportedLang)
    : DEFAULT_LANG;
  const localized = (path: string) => `/${lang}${path}`;

  const [selectedCompany, setSelectedCompany] = useState<string | undefined>();
  const [selectedType, setSelectedType]       = useState<string | undefined>();
  const [corrOpen, setCorrOpen]               = useState(false);
  const [corrRecord, setCorrRecord]           = useState<AirFreightPrice | null>(null);
  const [dynAirRows, setDynAirRows] = useState<AirFreightPrice[]>([]);

  useEffect(() => {
    const parseNum = (s?: string) => parseFloat((s || '').replace(/[^\d.]/g, '')) || 0;
    Promise.all([fetchDeliveryUpdates(), fetchMerchants()]).then(([updates, merchants]) => {
      const deliveryRows: AirFreightPrice[] = updates
        .filter((d) => d.mode === 'air' && (d as any).firstWeightPrice)
        .map((d) => {
          const priceStr = (d as any).firstWeightPrice as string;
          const price = parseFloat(priceStr) || 0;
          const kgMatch = priceStr.match(/\/\s*(\d+\.?\d*)/);
          const kg = kgMatch ? parseFloat(kgMatch[1]) : 0.5;
          return {
            company: d.merchantName, type: t('airFreight.cargoType.air'), line: d.route,
            firstWeight: price, firstWeightKg: kg,
            additionalWeight: (d as any).additionalWeightPrice || '-',
            transitTime: d.eta, remarks: d.city,
          };
        });
      const merchantRows: AirFreightPrice[] = [];
      merchants.forEach((m) => {
        (m.services || []).filter((s) => s.mode === 'air').forEach((s) => {
          merchantRows.push({
            company:          m.name,
            type:             s.cargo === 'general' ? t('airFreight.cargoType.general') : t('airFreight.cargoType.sensitive'),
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
  }, [t]);

  const handleCorrSubmit = (values: CorrectionFormValues) => {
    if (!corrRecord) return;
    saveCorrection({
      source: 'air',
      company: corrRecord.company,
      originalRecord: corrRecord as unknown as Record<string, unknown>,
      ...values,
    });
    message.success(t('airFreight.correction.success'));
    setCorrOpen(false);
  };

  const allAirData = useMemo(() => [...airFreightData, ...dynAirRows], [dynAirRows]);
  const companies = useMemo(() => [...new Set(allAirData.map(item => item.company))], [allAirData]);
  const types = useMemo(() => [...new Set(allAirData.map(item => item.type))], [allAirData]);

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
      navigate(localized(`/company/${company.id}`));
    }
  };

  const generalLabel = t('airFreight.cargoType.general');

  const columns = [
    {
      title: t('airFreight.table.company'),
      dataIndex: 'company',
      key: 'company',
      render: (text: string) => (
        <Button type="link" onClick={() => handleCompanyClick(text)} style={{ padding: 0 }}>
          {text}
        </Button>
      ),
    },
    {
      title: t('airFreight.table.type'),
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => <Tag color={text === generalLabel ? 'blue' : 'orange'}>{text}</Tag>,
    },
    {
      title: t('airFreight.table.line'),
      dataIndex: 'line',
      key: 'line',
      render: (text: string) => text || '-',
    },
    {
      title: t('airFreight.table.firstWeight'),
      key: 'firstWeight',
      render: (_: any, record: AirFreightPrice) =>
        record.priceCAD
          ? <span>{record.priceCAD}</span>
          : <span>{record.firstWeight}/{record.firstWeightKg}kg</span>,
    },
    {
      title: t('airFreight.table.additionalWeight'),
      key: 'additionalWeight',
      render: (_: any, record: AirFreightPrice) => {
        const parts = [record.additionalWeight !== '-' ? record.additionalWeight : '', record.priceCNY || ''].filter(Boolean);
        return <span>{parts.join(' / ') || '-'}</span>;
      },
    },
    {
      title: t('airFreight.table.transitTime'),
      dataIndex: 'transitTime',
      key: 'transitTime',
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
    {
      title: t('airFreight.table.remarks'),
      dataIndex: 'remarks',
      key: 'remarks',
      render: (text: string) => text || '-',
    },
    {
      title: t('airFreight.table.action'),
      key: 'action',
      width: 72,
      fixed: 'right' as const,
      render: (_: unknown, record: AirFreightPrice) => (
        <Button
          size="small"
          type="link"
          onClick={() => { setCorrRecord(record); setCorrOpen(true); }}
        >
          {t('airFreight.table.correct')}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      <Helmet>
        <title>{t('airFreight.meta.title')}</title>
        <meta name="description" content={t('airFreight.meta.description')} />
        <meta name="keywords" content={t('airFreight.meta.keywords')} />
      </Helmet>
      <Row gutter={[24, 0]}>
        <Col xs={24} md={18}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(localized('/'))}
                style={{ marginBottom: 16 }}
              >
                {t('common.backHome')}
              </Button>
              <Title level={1} style={{ marginBottom: 8, fontSize: 30 }}>{t('airFreight.title')}</Title>
              <p style={{ color: '#666' }}>{t('airFreight.subtitle')}</p>
            </div>

            <Card>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{t('airFreight.filter.company')}</label>
                  <Select
                    placeholder={t('airFreight.filter.selectCompany')}
                    allowClear
                    style={{ width: '100%' }}
                    value={selectedCompany}
                    onChange={setSelectedCompany}
                    options={companies.map(c => ({ label: c, value: c }))}
                  />
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{t('airFreight.filter.type')}</label>
                  <Select
                    placeholder={t('airFreight.filter.selectType')}
                    allowClear
                    style={{ width: '100%' }}
                    value={selectedType}
                    onChange={setSelectedType}
                    options={types.map(typ => ({ label: typ, value: typ }))}
                  />
                </Col>
                <Col xs={24} sm={24} md={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button onClick={handleReset}>{t('airFreight.filter.reset')}</Button>
                </Col>
              </Row>
            </Card>

            <Card title={t('airFreight.filter.resultsCount', { count: filteredData.length })}>
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey={(record, index) => `${record.company}-${record.type}-${index}`}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
              />
            </Card>

            <AdSlot slotId="airfreight_infeed" variant="infeed" enabled={AD_CONFIG.airfreight_infeed} />
          </Space>
        </Col>

        <Col xs={24} md={6}>
          <div style={{ position: 'sticky', top: 24 }}>
            <AdSlot slotId="airfreight_sidebar" variant="sidebar" enabled={AD_CONFIG.airfreight_sidebar} />
          </div>
        </Col>
      </Row>

      {corrRecord && (
        <CorrectionModal
          open={corrOpen}
          onClose={() => setCorrOpen(false)}
          record={corrRecord as unknown as Record<string, unknown>}
          source="air"
          onSubmit={handleCorrSubmit}
        />
      )}

      <div style={{ background: '#f7f9ff', borderTop: '1px solid #e8edf5', padding: '40px 24px', marginTop: 16 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0d1b4b', marginBottom: 8 }}>
            {t('airFreight.seo.heading')}
          </h2>
          <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.9, marginBottom: 16 }}>
            <Trans i18nKey="airFreight.seo.intro" components={{ 1: <strong /> }} />
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>{t('airFreight.seo.general.title')}</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>
                <Trans i18nKey="airFreight.seo.general.body" components={{ 1: <strong /> }} />
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>{t('airFreight.seo.sensitive.title')}</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>
                <Trans i18nKey="airFreight.seo.sensitive.body" components={{ 1: <strong /> }} />
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#667eea', marginBottom: 6 }}>{t('airFreight.seo.urgent.title')}</h3>
              <p style={{ fontSize: 13, color: '#5a6a8a', lineHeight: 1.8 }}>
                <Trans i18nKey="airFreight.seo.urgent.body" components={{ 1: <strong /> }} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirFreight;
