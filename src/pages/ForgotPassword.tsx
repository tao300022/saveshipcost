import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../services/storage';

const { Title } = Typography;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  const onFinish = ({ email }: { email: string }) => {
    setLoading(true);
    setTimeout(() => {
      const result = requestPasswordReset(email);
      if (result !== 'not_found') {
        const url = `${window.location.origin}/reset-password?token=${(result as { token: string }).token}`;
        setResetUrl(url);
      } else {
        // 统一提示，不暴露账号是否存在
        setResetUrl('__not_found__');
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Card style={{ width: 420, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>找回密码</Title>
          <p style={{ color: '#666' }}>输入注册邮箱，获取重置链接</p>
        </div>

        {!resetUrl ? (
          <Form onFinish={onFinish} autoComplete="off" size="large">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="注册邮箱" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                获取重置链接
              </Button>
            </Form.Item>
          </Form>
        ) : resetUrl === '__not_found__' ? (
          <Alert
            type="success"
            message="如果该邮箱已注册，重置链接将显示在此处。"
            description="请确认邮箱地址是否正确。"
            showIcon
            style={{ marginBottom: 16 }}
          />
        ) : (
          <Alert
            type="success"
            message="重置链接已生成"
            description={
              <div>
                <p style={{ marginBottom: 8 }}>点击下方链接设置新密码（1小时内有效）：</p>
                <a href={resetUrl} style={{ wordBreak: 'break-all', fontSize: 13 }}>{resetUrl}</a>
              </div>
            }
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <a onClick={() => navigate('/login')} style={{ color: '#667eea', cursor: 'pointer' }}>
            返回登录
          </a>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
