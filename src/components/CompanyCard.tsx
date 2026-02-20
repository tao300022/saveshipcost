import React from 'react';
import { Card, Tag, Space, Typography, Button } from 'antd';
import { PhoneOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface CompanyCardProps {
  id: string;
  name: string;
  phone: string;
  features: string[];
  onClick?: () => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  name,
  phone,
  features,
  onClick
}) => {
  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={{ height: '100%' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <Title level={4} style={{ margin: 0 }}>{name}</Title>
        <Space size={4} style={{ color: '#666' }}>
          <PhoneOutlined />
          <Text>{phone}</Text>
        </Space>
        <div>
          <Text type="secondary">服务特点:</Text>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {features.slice(0, 3).map((feature, index) => (
              <Tag key={index} color="blue">
                {feature}
              </Tag>
            ))}
            {features.length > 3 && (
              <Tag>+{features.length - 3}</Tag>
            )}
          </div>
        </div>
        {onClick && (
          <Button
            type="link"
            icon={<ArrowRightOutlined />}
            style={{ padding: 0 }}
          >
            查看详情
          </Button>
        )}
      </Space>
    </Card>
  );
};

export default CompanyCard;
