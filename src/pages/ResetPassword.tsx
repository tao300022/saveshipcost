import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const { Title } = Typography;

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'ready' | 'invalid'>('loading');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase reads the #access_token hash from the URL and fires PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('[ResetPassword] auth event:', event);
      if (event === 'PASSWORD_RECOVERY') {
        setStatus('ready');
      }
    });

    // Fallback: if no access_token in hash at all, mark invalid immediately
    if (!window.location.hash.includes('access_token')) {
      // Give Supabase 1.2s to fire the event in case of PKCE flow
      const t = setTimeout(() => {
        setStatus((prev) => (prev === 'loading' ? 'invalid' : prev));
      }, 1200);
      return () => { subscription.unsubscribe(); clearTimeout(t); };
    }

    return () => subscription.unsubscribe();
  }, []);

  const onFinish = async ({ newPassword }: { newPassword: string }) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    console.log('[ResetPassword] updateUser error:', error);
    setLoading(false);

    if (error) {
      message.error('更新失败：' + error.message);
    } else {
      setDone(true);
      message.success('密码已更新，即将跳转到登录页');
      await supabase.auth.signOut();
      setTimeout(() => navigate('/login'), 2000);
    }
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
          <Title level={2} style={{ margin: 0 }}>设置新密码</Title>
        </div>

        {status === 'loading' && (
          <p style={{ textAlign: 'center', color: '#999' }}>验证中…</p>
        )}

        {status === 'invalid' && (
          <div>
            <Alert
              type="error"
              showIcon
              message="链接无效或已过期"
              description="请重新发送重置邮件获取新链接。"
              style={{ marginBottom: 16 }}
            />
            <Button block onClick={() => navigate('/forgot-password')}>
              重新获取重置链接
            </Button>
          </div>
        )}

        {status === 'ready' && !done && (
          <Form onFinish={onFinish} autoComplete="off" size="large">
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 8, message: '密码至少 8 位' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="新密码（至少 8 位）" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                    return Promise.reject(new Error('两次密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                保存新密码
              </Button>
            </Form.Item>
          </Form>
        )}

        {done && (
          <Alert type="success" showIcon message="密码已更新，正在跳转到登录页…" />
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
