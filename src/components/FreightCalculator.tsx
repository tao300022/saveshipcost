import React, { useState } from 'react';
import { Card, Form, InputNumber, Select, Row, Col, Typography, Divider } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';

const { Text } = Typography;

const FreightCalculator: React.FC = () => {
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [actualWeight, setActualWeight] = useState<number>(0);
  const [divisor, setDivisor] = useState<number>(6000);

  const volumetricWeight = Math.round((length * width * height / divisor) * 100) / 100;  // 体积重计算
  const chargeableWeight = Math.max(volumetricWeight, actualWeight);                      // 计费重量取大值

  const hasInput = length > 0 && width > 0 && height > 0 && actualWeight > 0;
  const isVolumetric = volumetricWeight >= actualWeight;

  return (
    <Card
      title={
        <span>
          <CalculatorOutlined style={{ marginRight: 8, color: '#667eea' }} />
          运费试算计算器
        </span>
      }
    >
      <Form layout="vertical">
        <Row gutter={8}>
          <Col span={6}>
            <Form.Item label="长 (CM)">
              <InputNumber
                min={0}
                precision={1}
                style={{ width: '100%' }}
                placeholder="0"
                onChange={(v) => setLength(v ?? 0)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="宽 (CM)">
              <InputNumber
                min={0}
                precision={1}
                style={{ width: '100%' }}
                placeholder="0"
                onChange={(v) => setWidth(v ?? 0)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="高 (CM)">
              <InputNumber
                min={0}
                precision={1}
                style={{ width: '100%' }}
                placeholder="0"
                onChange={(v) => setHeight(v ?? 0)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="重量 (KG)">
              <InputNumber
                min={0}
                precision={2}
                style={{ width: '100%' }}
                placeholder="0"
                onChange={(v) => setActualWeight(v ?? 0)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col xs={24} sm={8}>
            <Form.Item label="体积系数">
              <Select
                value={divisor}
                onChange={setDivisor}
                style={{ width: '100%' }}
                options={[
                  { label: '6000（海运/陆运）', value: 6000 },
                  { label: '5000（空运）', value: 5000 },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider style={{ margin: '8px 0 16px' }} />

      <Row gutter={16}>
        <Col xs={8} style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>体积重</Text>
          <Text style={{ fontSize: 20, fontWeight: 500 }}>
            {hasInput ? volumetricWeight : '—'}
          </Text>
          {hasInput && <Text type="secondary" style={{ fontSize: 12 }}> kg</Text>}
        </Col>
        <Col xs={8} style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>实际重量</Text>
          <Text style={{ fontSize: 20, fontWeight: 500 }}>
            {actualWeight > 0 ? actualWeight : '—'}
          </Text>
          {actualWeight > 0 && <Text type="secondary" style={{ fontSize: 12 }}> kg</Text>}
        </Col>
        <Col xs={8} style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>计费重量</Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: hasInput ? '#667eea' : undefined,
            }}
          >
            {hasInput ? chargeableWeight : '—'}
          </Text>
          {hasInput && <Text type="secondary" style={{ fontSize: 12 }}> kg</Text>}
          {hasInput && (
            <Text
              type="secondary"
              style={{ fontSize: 11, display: 'block', marginTop: 2 }}
            >
              按{isVolumetric ? '体积重' : '实重'}计费
            </Text>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default FreightCalculator;
