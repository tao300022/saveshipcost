import React, { useState, useEffect } from 'react';
import {
  Typography, Table, Button, Space, Tag, Card, Empty, Tooltip,
} from 'antd';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { listCorrections, Correction } from '../services/corrections';

const { Title, Text } = Typography;

const CorrectionsAdmin: React.FC = () => {
  const [data, setData] = useState<Correction[]>([]);

  const reload = () => setData(listCorrections());

  useEffect(() => {
    reload();
  }, []);

  const handleExport = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `corrections-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: '提交时间',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      width: 160,
      render: (v: string) => new Date(v).toLocaleString('zh-CN', { hour12: false }),
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 70,
      render: (v: string) => (
        <Tag color={v === 'air' ? 'blue' : 'green'}>{v === 'air' ? '空运' : '海运'}</Tag>
      ),
    },
    {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
      width: 140,
    },
    {
      title: '纠错类型',
      dataIndex: 'correctionType',
      key: 'correctionType',
      width: 110,
    },
    {
      title: '建议新值',
      dataIndex: 'suggestedValue',
      key: 'suggestedValue',
      width: 120,
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: '备注说明',
      dataIndex: 'notes',
      key: 'notes',
      render: (v: string) => (
        <Tooltip title={v}>
          <Text style={{ maxWidth: 200 }} ellipsis>{v}</Text>
        </Tooltip>
      ),
    },
    {
      title: '联系邮箱',
      dataIndex: 'contactEmail',
      key: 'contactEmail',
      width: 170,
      render: (v?: string) => v || <Text type="secondary">—</Text>,
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>纠错记录管理</Title>
            <Text type="secondary">共 {data.length} 条记录（本地暂存）</Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={reload}>刷新</Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExport}
              disabled={data.length === 0}
            >
              导出 JSON
            </Button>
          </Space>
        </div>

        <Card>
          {data.length === 0 ? (
            <Empty description="暂无纠错记录" />
          ) : (
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 20, showSizeChanger: false }}
              scroll={{ x: 900 }}
            />
          )}
        </Card>

        <Text type="secondary" style={{ fontSize: 12 }}>
          ℹ️ 数据存储于浏览器 localStorage，清除浏览器数据后将丢失。接后端前请定期导出 JSON 备份。
        </Text>
      </Space>
    </div>
  );
};

export default CorrectionsAdmin;
