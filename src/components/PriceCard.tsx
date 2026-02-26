import React from 'react';
import { Card, Tag, Space, Typography } from 'antd';
import { ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface PriceCardProps {
  company: string;
  type: string;
  line?: string;
  firstWeight: number;
  firstWeightKg: number;
  additionalWeight: number | string;
  transitTime: string;
  remarks?: string;
  onClick?: () => void;
}

const PriceCard: React.FC<PriceCardProps> = ({
  company,
  type,
  line,
  firstWeight,
  firstWeightKg,
  additionalWeight,
  transitTime,
  remarks,
  onClick
}) => {
  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={{ height: '100%' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <div>
          <Text strong style={{ fontSize: 16 }}>{company}</Text>
        </div>
        <Space size={8}>
          <Tag color={type.includes('普') ? 'blue' : 'orange'}>{type}</Tag>
          {line && <Tag>{line}</Tag>}
        </Space>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size={4}>
            <DollarOutlined />
            <Text>首重: ¥{firstWeight}/{firstWeightKg}kg</Text>
          </Space>
          <Space size={4}>
            <ClockCircleOutlined />
            <Tag color="green">{transitTime}天</Tag>
          </Space>
        </div>
        <Text type="secondary">续重: {additionalWeight}</Text>
        {remarks && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {remarks}
          </Text>
        )}
      </Space>
    </Card>
  );
};

export default PriceCard;
