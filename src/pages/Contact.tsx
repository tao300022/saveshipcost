import React, { useState } from 'react';
import {
  Form, Input, Select, Button, Card, Typography,
  Space, Row, Col, Modal, Divider,
} from 'antd';
import {
  MailOutlined, WechatOutlined, ClockCircleOutlined, SendOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const SUPPORT_EMAIL = 'support@example.com'; // TODO: 替换为真实邮箱

const contactInfo = [
  { icon: <MailOutlined style={{ color: '#667eea' }} />, label: '电子邮件', value: SUPPORT_EMAIL },
  { icon: <WechatOutlined style={{ color: '#52c41a' }} />, label: '微信 / WhatsApp', value: '请发邮件获取（占位符）' },
  { icon: <ClockCircleOutlined style={{ color: '#faad14' }} />, label: '工作时间', value: '周一至周五 09:00 – 18:00（北京时间）' },
];

const subjectOptions = [
  '用户咨询',
  '物流商入驻',
  '广告合作',
  '数据纠错',
  '其他',
];

interface FormValues {
  subject: string;
  name: string;
  email: string;
  trackingNo?: string;
  message: string;
}

const Contact: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  /**
   * 接后端时替换此函数：
   *   await api.post('/api/contact', values)
   * 位于 src/services/api.ts（待创建）
   */
  const onFinish = (values: FormValues) => {
    setSubmitting(true);
    console.log('[Contact Form Submitted]', values); // 接 API 前临时输出
    setTimeout(() => {
      setSubmitting(false);
      setSuccessModal(true);
      form.resetFields();
    }, 600);
  };

  const handleMailto = () => {
    const values = form.getFieldsValue();
    const subject = encodeURIComponent(
      `[${values.subject || '咨询'}] ${values.name || ''} - 跨境快递平台`
    );
    const body = encodeURIComponent(
      `姓名：${values.name || ''}\n邮箱：${values.email || ''}\n` +
      `运单号：${values.trackingNo || '无'}\n\n留言内容：\n${values.message || ''}`
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={1} style={{ marginBottom: 4 }}>联系我们 / 合作</Title>
          <Text type="secondary">
            无论您有运费咨询、物流商入驻申请、广告合作意向，还是发现数据有误，欢迎随时联系我们。
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* 联系方式 */}
          <Col xs={24} md={8}>
            <Card title="联系方式" style={{ height: '100%' }}>
              <Space direction="vertical" size={20} style={{ width: '100%' }}>
                {contactInfo.map((item) => (
                  <div key={item.label}>
                    <Space size={8}>
                      {item.icon}
                      <Text strong>{item.label}</Text>
                    </Space>
                    <div style={{ marginTop: 4, marginLeft: 22, color: '#555', fontSize: 13 }}>
                      {item.value}
                    </div>
                  </div>
                ))}
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ fontSize: 12, color: '#999' }}>
                  一般在 1–2 个工作日内回复，感谢您的耐心等待。
                </div>
              </Space>
            </Card>
          </Col>

          {/* 联系表单 */}
          <Col xs={24} md={16}>
            <Card title="发送留言">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="subject"
                      label="主题类型"
                      rules={[{ required: true, message: '请选择主题' }]}
                    >
                      <Select placeholder="请选择">
                        {subjectOptions.map((s) => (
                          <Option key={s} value={s}>{s}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label="姓名"
                      rules={[{ required: true, message: '请输入姓名' }]}
                    >
                      <Input placeholder="您的姓名" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="邮箱"
                      rules={[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入有效邮箱' },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="your@email.com" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="trackingNo" label="订单号 / 运单号（选填）">
                      <Input placeholder="如有请填写" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="message"
                  label="留言内容"
                  rules={[
                    { required: true, message: '请填写留言内容' },
                    { min: 10, message: '内容至少 10 个字符' },
                  ]}
                >
                  <TextArea
                    rows={5}
                    showCount
                    maxLength={1000}
                    placeholder="请详细描述您的问题或需求..."
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Space wrap>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                      icon={<SendOutlined />}
                    >
                      提交留言
                    </Button>
                    <Button onClick={handleMailto} icon={<MailOutlined />}>
                      用邮件发送
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Space>

      {/* 成功提示 Modal */}
      <Modal
        title="已收到您的留言"
        open={successModal}
        onOk={() => setSuccessModal(false)}
        onCancel={() => setSuccessModal(false)}
        cancelButtonProps={{ style: { display: 'none' } }}
        okText="好的"
      >
        <Paragraph>
          感谢您的联系！我们已收到您的留言，将在 <strong>1–2 个工作日</strong>内通过邮件与您取得联系。
        </Paragraph>
        <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
          如有紧急事项，请直接发送邮件至 {SUPPORT_EMAIL}
        </Paragraph>
      </Modal>
    </div>
  );
};

export default Contact;
