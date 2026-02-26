import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { validateResetToken, resetPassword } from '../services/storage';

const { Title } = Typography;

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [tokenStatus, setTokenStatus] = useState<'ok' | 'invalid' | 'expired' | 'checking'>('checking');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) { setTokenStatus('invalid'); return; }
    setTokenStatus(validateResetToken(token));
  }, [token]);

  const onFinish = ({ newPassword }: { newPassword: string }) => {
    setLoading(true);
    setTimeout(() => {
      const result = resetPassword(token, newPassword);
      if (result === 'ok') {
        setDone(true);
        message.success('密码已更新，即将跳转到登录页');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        message.error(result === 'expired' ? '链接已过期，请重新发送重置邮件' : '链接无效，请重新发送重置邮件');
        setTokenStatus(result);
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
          <Title level={2} style={{ margin: 0 }}>设置新密码</Title>
        </div>

        {tokenStatus === 'checking' && <p style={{ textAlign: 'center', color: '#999' }}>验证中…</p>}

        {(tokenStatus === 'invalid' || tokenStatus === 'expired') && (
          <div>
            <Alert
              type="error"
              message={tokenStatus === 'expired' ? '链接已过期' : '链接无效'}
              description="请重新发送重置邮件获取新链接。"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Button block onClick={() => navigate('/forgot-password')}>
              重新获取重置链接
            </Button>
          </div>
        )}

        {tokenStatus === 'ok' && !done && (
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
          <Alert type="success" message="密码已更新，正在跳转到登录页…" showIcon />
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
