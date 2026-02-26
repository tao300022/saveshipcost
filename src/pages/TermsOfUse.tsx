import React from 'react';
import { Typography, Card, Space } from 'antd';

const { Title, Paragraph, Text } = Typography;

const sections = [
  {
    title: '1. 接受条款',
    content: `访问或使用本平台，即表示您已阅读、理解并同意受本使用条款的约束。如您不同意任何条款，请立即停止使用本平台。本平台保留随时修订本条款的权利，修订后的条款自发布时生效，用户继续使用本平台视为接受修订内容。`,
  },
  {
    title: '2. 服务说明',
    content: `本平台提供加拿大华人跨境快递/集运价格信息的展示与比较功能，以及运费试算工具，供用户参考。本平台不直接提供运输、仓储、清关或任何物流执行服务，不作为任何承运合同的当事方。平台所展示的公司信息、价格及时效均来源于合作方或公开渠道，仅供参考。`,
  },
  {
    title: '3. 用户账号责任',
    content: `用户注册账号时须提供真实、准确的信息，并负责维护账号及密码的安全。用户对账号下发生的所有活动承担全部责任。如发现账号被未经授权访问，请立即通知本平台。本平台对因用户未妥善保管账号信息而造成的损失不承担责任。`,
  },
  {
    title: '4. 禁止行为',
    content: `用户在使用本平台时不得从事以下行为：
① 发布虚假、误导性或违法信息；
② 以任何方式干扰、破坏或损害本平台的正常运营；
③ 未经授权抓取、复制或商业化使用本平台数据；
④ 利用本平台从事欺诈、洗钱或其他违法活动；
⑤ 冒充他人或虚报身份；
⑥ 规避或破坏本平台的安全机制。
违反上述规定的，本平台有权立即暂停或终止用户账号，并保留追究法律责任的权利。`,
  },
  {
    title: '5. 知识产权',
    content: `本平台的所有内容（包括但不限于文字、图片、图标、界面设计、数据编排及软件代码）均受知识产权法律保护，归本平台或其授权方所有。未经书面授权，用户不得复制、分发、修改或商业化使用上述内容。`,
  },
  {
    title: '6. 服务变更与终止',
    content: `本平台保留随时修改、暂停或终止全部或部分服务的权利，恕不另行通知。本平台亦保留因用户违反本条款而终止其账号的权利。服务终止不影响双方在终止前已产生的权利和义务。`,
  },
  {
    title: '7. 免责声明引用',
    content: `本使用条款与本平台的免责声明、隐私政策共同构成用户与本平台之间的完整协议。如有冲突，以最新发布的版本为准。有关本平台信息准确性、责任限制等事项，请参阅独立的「免责声明」页面。`,
  },
  {
    title: '8. 适用法律与争议解决',
    content: `本条款受加拿大安大略省法律管辖。因使用本平台产生的任何争议，双方应首先通过友好协商解决；协商不成的，提交安大略省有管辖权的法院裁决。`,
  },
];

const TermsOfUse: React.FC = () => {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={1}>使用条款</Title>
          <Text type="secondary">最后更新：2026年2月</Text>
        </div>
        <Paragraph style={{ fontSize: 15, color: '#444' }}>
          以下使用条款适用于所有访问或使用本平台的用户，请在使用前仔细阅读。
        </Paragraph>
        {sections.map((s, i) => (
          <Card key={i}>
            <Title level={4} style={{ marginBottom: 8 }}>{s.title}</Title>
            <Paragraph style={{ marginBottom: 0, color: '#444', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {s.content}
            </Paragraph>
          </Card>
        ))}
      </Space>
    </div>
  );
};

export default TermsOfUse;
