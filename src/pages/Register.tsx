import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = (values: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    setTimeout(() => {
      const result = register(values.email, values.username, values.password);
      if (result === 'ok') {
        message.success('注册成功！请登录');
        navigate('/login');
      } else {
        message.error('该邮箱已注册，请直接登录');
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Card style={{ width: 420, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>注册</Title>
          <p style={{ color: '#666' }}>创建您的账号</p>
        </div>
        <Form name="register" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入昵称' },
              { min: 2, message: '昵称至少 2 个字符' },
              { max: 20, message: '昵称最多 20 个字符' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="昵称（论坛显示名）" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码至少 8 位' },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                message: '密码须包含字母和数字',
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码（至少 8 位，含字母和数字）" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              注册
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', color: '#666' }}>
          已有账号？<a onClick={() => navigate('/login')}>立即登录</a>
        </div>
      </Card>
    </div>
  );
};

export default Register;
