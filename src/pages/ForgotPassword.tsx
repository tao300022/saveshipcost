import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const { Title } = Typography;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async ({ email }: { email: string }) => {
    setLoading(true);
    const origin = window.location.origin;
    const redirectTo = `${origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    // 排查日志（仅开发/控制台可见，不泄露给用户）
    console.log('[ForgotPassword]', { error, origin, redirectTo });
    if (error) console.error('[ForgotPassword] Supabase error:', error.message);

    setLoading(false);
    setSubmitted(true); // 无论成功/失败都显示相同提示，不暴露账号是否存在
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
          <p style={{ color: '#666' }}>输入注册邮箱，接收重置链接</p>
        </div>

        {!submitted ? (
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
                发送重置邮件
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Alert
            type="success"
            showIcon
            message="请检查你的邮箱"
            description="如果该邮箱已注册，你将收到一封密码重置邮件（如未收到请检查垃圾箱）。"
            style={{ marginBottom: 16 }}
          />
        )}

        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <a onClick={() => navigate('/login')} style={{ color: '#667eea', cursor: 'pointer' }}>
            返回登录
          </a>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
