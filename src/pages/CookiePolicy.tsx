import React from 'react';
import { Typography, Card, Space, Table, Tag } from 'antd';

const { Title, Paragraph, Text } = Typography;

const cookieData = [
  {
    key: '1',
    name: 'cargo_current_user',
    type: '必要 Cookie',
    purpose: '记录当前登录用户信息，维持登录状态',
    duration: '会话结束后失效',
    canDisable: false,
  },
  {
    key: '2',
    name: 'cargo_users',
    type: '必要 Cookie',
    purpose: '本地存储已注册账号列表（仅存于用户本地）',
    duration: '手动清除前长期保存',
    canDisable: false,
  },
  {
    key: '3',
    name: '分析类 Cookie（预留）',
    type: '分析 Cookie',
    purpose: '统计页面访问量、用户行为等匿名数据，用于改善产品',
    duration: '最长 1 年',
    canDisable: true,
  },
];

const columns = [
  { title: 'Cookie 名称', dataIndex: 'name', key: 'name', width: 180 },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 110,
    render: (t: string) => (
      <Tag color={t.includes('必要') ? 'blue' : 'orange'}>{t}</Tag>
    ),
  },
  { title: '用途', dataIndex: 'purpose', key: 'purpose' },
  { title: '保存时长', dataIndex: 'duration', key: 'duration', width: 160 },
  {
    title: '可关闭',
    dataIndex: 'canDisable',
    key: 'canDisable',
    width: 70,
    render: (v: boolean) => (v ? <Tag color="green">可选</Tag> : <Tag>必需</Tag>),
  },
];

const CookiePolicy: React.FC = () => {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={1}>Cookie 使用说明</Title>
          <Text type="secondary">最后更新：2026年2月</Text>
        </div>

        <Card>
          <Title level={4} style={{ marginBottom: 8 }}>1. 什么是 Cookie</Title>
          <Paragraph style={{ color: '#444', lineHeight: 1.8, marginBottom: 0 }}>
            Cookie 是网站在您的浏览器中存储的小型文本文件，用于记录您的偏好、登录状态等信息，以便在您下次访问时提供更流畅的体验。除 Cookie 外，本平台还使用浏览器的 <Text code>localStorage</Text> 存储部分数据（如账号信息），其工作方式与 Cookie 类似。
          </Paragraph>
        </Card>

        <Card>
          <Title level={4} style={{ marginBottom: 12 }}>2. 我们使用的 Cookie 类型</Title>
          <Table
            dataSource={cookieData}
            columns={columns}
            pagination={false}
            size="small"
            scroll={{ x: 600 }}
          />
        </Card>

        <Card>
          <Title level={4} style={{ marginBottom: 8 }}>3. 必要 Cookie 说明</Title>
          <Paragraph style={{ color: '#444', lineHeight: 1.8, marginBottom: 0 }}>
            必要 Cookie 是本平台正常运行所必需的，包括维持您的登录会话。关闭必要 Cookie 将导致登录功能无法使用。这类 Cookie 不收集任何用于营销目的的个人数据。
          </Paragraph>
        </Card>

        <Card>
          <Title level={4} style={{ marginBottom: 8 }}>4. 如何管理或禁用 Cookie</Title>
          <Paragraph style={{ color: '#444', lineHeight: 1.8, marginBottom: 0 }}>
            您可以通过以下方式管理 Cookie：<br />
            ① <strong>浏览器设置</strong>：大多数浏览器允许您查看、删除或阻止特定 Cookie。请参阅您所使用浏览器的帮助文档；<br />
            ② <strong>清除本地存储</strong>：在浏览器开发者工具（F12）→「应用」→「本地存储」中可手动删除本平台存储的数据；<br />
            ③ <strong>隐私浏览模式</strong>：使用无痕/隐私窗口访问本平台，会话结束后所有本地数据将自动清除。<br /><br />
            请注意，禁用必要 Cookie 可能影响本平台的正常功能。
          </Paragraph>
        </Card>

        <Card>
          <Title level={4} style={{ marginBottom: 8 }}>5. 第三方追踪</Title>
          <Paragraph style={{ color: '#444', lineHeight: 1.8, marginBottom: 0 }}>
            本平台目前不主动嵌入第三方广告追踪脚本。如未来引入第三方分析工具（如 Google Analytics），将在本页面更新说明，并在符合适用法律的前提下向用户提供选择退出的选项。
          </Paragraph>
        </Card>

        <Card>
          <Title level={4} style={{ marginBottom: 8 }}>6. 政策更新</Title>
          <Paragraph style={{ color: '#444', lineHeight: 1.8, marginBottom: 0 }}>
            本 Cookie 使用说明可能随平台功能更新而修订，修订内容将在本页面及时反映。如有重大变化，我们将以显著方式通知您。
          </Paragraph>
        </Card>
      </Space>
    </div>
  );
};

export default CookiePolicy;
