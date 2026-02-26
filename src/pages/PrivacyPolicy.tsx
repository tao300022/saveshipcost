import React from 'react';
import { Typography, Card, Space, Table } from 'antd';

const { Title, Paragraph, Text } = Typography;

const dataTypes = [
  { key: '1', type: '账号注册信息', detail: '用户名、密码（加密存储）', purpose: '账号创建与登录认证' },
  { key: '2', type: '使用日志', detail: '页面访问记录、操作时间戳、IP地址', purpose: '安全审计、故障排查' },
  { key: '3', type: 'Cookie 与本地存储', detail: '会话状态、用户偏好', purpose: '维持登录状态、功能个性化' },
  { key: '4', type: '统计分析数据', detail: '访问来源、设备类型、浏览行为（匿名）', purpose: '改善用户体验、优化产品' },
];

const columns = [
  { title: '数据类型', dataIndex: 'type', key: 'type', width: 160 },
  { title: '具体内容', dataIndex: 'detail', key: 'detail' },
  { title: '使用目的', dataIndex: 'purpose', key: 'purpose' },
];

const PrivacyPolicy: React.FC = () => {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={1}>隐私政策</Title>
          <Text type="secondary">最后更新：2026年2月</Text>
        </div>
        <Paragraph style={{ fontSize: 15, color: '#444' }}>
          本隐私政策说明本平台如何收集、使用、存储及保护您的个人信息。使用本平台即表示您同意本政策。如您不同意，请停止使用本平台。
        </Paragraph>

        <Card>
          <Title level={4} style={{ marginBottom: 12 }}>1. 我们收集哪些数据</Title>
          <Table
            dataSource={dataTypes}
            columns={columns}
            pagination={false}
            size="small"
            style={{ marginBottom: 12 }}
          />
          <Paragraph style={{ marginBottom: 0, color: '#666', fontSize: 13 }}>
            我们仅收集提供服务所必需的最少量数据，不会在未经授权的情况下收集敏感个人信息（如身份证号、银行卡信息）。
          </Paragraph>
        </Card>

        <Card>
          <Title level={4} style={{ marginBottom: 8 }}>2. 信息使用目的</Title>
          <Paragraph style={{ color: '#444', lineHeight: 1.8, marginBottom: 0 }}>
            我们将您的信息用于以下目的：<br />
            ① 账号管理：创建和维护您的用户账号；<br />
            ② 服务提供：展示运费信息、保存您的试算记录；<br />
            ③ 安全与风控：识别异常访问、防止滥用；<br />
            ④ 产品改善：通过匿名统计数据优化平台功能与体验；<br />
            ⑤ 营销通知（可选）：在您明确同意的情况下，向您发送活动或价格更新通知。您可随时退订。
          </Paragraph>
        </Card>

        <Card>
          <Title level={4} style={{ marginBottom: 8 }}>3. 数据共享与披露</Title>
          <Paragraph style={{ color: '#444', lineHeight: 1.8, marginBottom: 0 }}>
            我们承诺：<strong>不会出售您的个人数据</strong>。<br />
            我们仅在以下情形下共享您的数据：<br />
            ① 向提供托管、分析等技术服务的必要合作方披露（合作方须遵守同等保密标准）；<br />
            ② 法律法规要求、政府机关合法要求或保护平台合法权益时；<br />
            ③ 您明确同意的情形。
          </Paragraph>
        </Card>

        <Card>
          <Title level={4} style={{ marginBottom: 8 }}>4. 数据保存期限与您的权利</Title>
          <Paragraph style={{ color: '#444', lineHeight: 1.8, marginBottom: 0 }}>
            账号数据：自账号注销后 90 天内删除。<br />
            日志数据：保存 180 天后自动清除。<br />
            统计数据：以匿名聚合形式长期保存，无法追溯到个人。<br /><br />
            您享有以下权利：<br />
            ① <strong>查阅权</strong>：申请查看我们持有的您的个人数据；<br />
            ② <strong>更正权</strong>：要求更正不准确的个人数据；<br />
            ③ <strong>删除权</strong>：在法律允许范围内申请删除您的账号及相关数据；<br />
            ④ <strong>导出权</strong>：申请以通用格式导出您的数据。<br /><br />
            如需行使上述权利，请通过页脚"联系我们"入口提交申请，我们将在 30 个工作日内响应。
          </Paragraph>
        </Card>

        <Card>
          <Title level={4} style={{ marginBottom: 8 }}>5. Cookie 使用</Title>
          <Paragraph style={{ color: '#444', lineHeight: 1.8, marginBottom: 0 }}>
            我们使用 Cookie 及类似技术维持登录状态和用户偏好。详细说明请参阅
            <a href="/cookie-policy" style={{ marginLeft: 4 }}>Cookie 使用说明</a>。
          </Paragraph>
        </Card>

        <Card>
          <Title level={4} style={{ marginBottom: 8 }}>6. 未成年人保护</Title>
          <Paragraph style={{ color: '#444', lineHeight: 1.8, marginBottom: 0 }}>
            本平台不面向 13 周岁以下未成年人。若您为未满 18 周岁的未成年人，请在监护人的陪同下阅读并使用本平台。如我们发现误收了未成年人数据，将立即予以删除。若您是监护人并发现此类情形，请及时联系我们。
          </Paragraph>
        </Card>

        <Card>
          <Title level={4} style={{ marginBottom: 8 }}>7. 联系我们</Title>
          <Paragraph style={{ color: '#444', lineHeight: 1.8, marginBottom: 0 }}>
            如对本隐私政策有任何疑问或需行使数据权利，请通过以下方式联系我们：<br />
            电子邮件：<Text code>contact@example.com</Text>（占位符，待更新）<br />
            本政策如有修订，将在本页面更新并注明日期，重大变更将以显著方式通知您。
          </Paragraph>
        </Card>
      </Space>
    </div>
  );
};

export default PrivacyPolicy;
