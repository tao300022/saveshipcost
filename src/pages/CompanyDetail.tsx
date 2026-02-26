import React from 'react';
import { Card, Descriptions, Button, Tag, Typography, Space, List, Divider } from 'antd';
import { PhoneOutlined, EnvironmentOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompanyById } from '../data/companyData';
import { airFreightData } from '../data/airFreightData';
import { seaFreightData } from '../data/seaFreightData';
import FreightCalculator from '../components/FreightCalculator';

const { Title, Paragraph, Text } = Typography;

const CompanyDetail: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();

  const company = getCompanyById(companyId || '');

  if (!company) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>公司信息不存在</Title>
        <Button onClick={() => navigate('/')}>返回首页</Button>
      </div>
    );
  }

  // Filter prices for this company
  const airPrices = airFreightData.filter(item => item.company === company.name);
  const seaPrices = seaFreightData.filter(item => item.company === company.name);

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          style={{ marginBottom: 16 }}
        >
          返回首页
        </Button>

        {/* Company Info */}
        <Card>
          <Title level={2} style={{ marginBottom: 16 }}>{company.name}</Title>
          <Descriptions column={{ xs: 1, sm: 2 }} bordered>
            <Descriptions.Item label="联系电话">
              <Space><PhoneOutlined />{company.phone}</Space>
            </Descriptions.Item>
            <Descriptions.Item label="收件人">
              {company.recipient}
            </Descriptions.Item>
            {company.postcode && (
              <Descriptions.Item label="邮编">{company.postcode}</Descriptions.Item>
            )}
            <Descriptions.Item label="空运寄件地址" span={2}>
              <Space><EnvironmentOutlined />{company.airAddress}</Space>
            </Descriptions.Item>
            <Descriptions.Item label="海运寄件地址" span={2}>
              <Space><EnvironmentOutlined />{company.seaAddress}</Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Features */}
        <Card title="服务特点">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {company.features.map((feature, index) => (
              <Tag key={index} color="blue" style={{ fontSize: 14, padding: '6px 12px' }}>
                {feature}
              </Tag>
            ))}
          </div>
        </Card>

        {/* Air Freight Prices */}
        {airPrices.length > 0 && (
          <Card title="空运价格">
            <List
              dataSource={airPrices}
              renderItem={(item, index) => (
                <React.Fragment key={index}>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>{item.type}</Text>
                          {item.line && <Tag>{item.line}</Tag>}
                          <Tag color="green">时效: {item.transitTime}天</Tag>
                        </Space>
                      }
                      description={
                        <Space split={<Divider type="vertical" />}>
                          <Text>首重: ¥{item.firstWeight}/{item.firstWeightKg}kg</Text>
                          <Text>续重: {item.additionalWeight}</Text>
                          {item.remarks && <Text type="secondary">{item.remarks}</Text>}
                        </Space>
                      }
                    />
                  </List.Item>
                  {index < airPrices.length - 1 && <Divider style={{ margin: '12px 0' }} />}
                </React.Fragment>
              )}
            />
          </Card>
        )}

        {/* Sea Freight Prices */}
        {seaPrices.length > 0 && (
          <Card title="海运价格">
            <List
              dataSource={seaPrices}
              renderItem={(item, index) => (
                <React.Fragment key={index}>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>{item.type}</Text>
                          <Tag color="green">时效: {item.transitTime}天</Tag>
                        </Space>
                      }
                      description={
                        <Space split={<Divider type="vertical" />}>
                          <Text>首重: ¥{item.firstWeight}/{item.firstWeightKg || 21}kg</Text>
                          <Text>续重: {item.additionalWeight}</Text>
                          {item.remarks && <Text type="secondary">{item.remarks}</Text>}
                        </Space>
                      }
                    />
                  </List.Item>
                  {index < seaPrices.length - 1 && <Divider style={{ margin: '12px 0' }} />}
                </React.Fragment>
              )}
            />
          </Card>
        )}

        {/* Pickup Points */}
        <Card title="取货点">
          <List
            dataSource={company.pickupPoints}
            renderItem={(point, index) => (
              <List.Item key={index}>
                <Space>
                  <Tag color="purple">{index + 1}</Tag>
                  <Text>{point}</Text>
                </Space>
              </List.Item>
            )}
          />
        </Card>

        {/* Freight Calculator */}
        <FreightCalculator />

        {/* Notes */}
        {company.notes && (
          <Card title="注意事项" type="inner">
            <Paragraph style={{ marginBottom: 0 }}>
              {company.notes}
            </Paragraph>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default CompanyDetail;
