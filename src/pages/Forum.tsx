import React, { useState, useEffect } from 'react';
import {
  Card, Button, Modal, Form, Input, List, Typography,
  Space, Tag, Empty, Alert, Avatar,
} from 'antd';
import {
  EditOutlined, UserOutlined, ClockCircleOutlined,
  LockOutlined, InfoCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSscPosts, createSscPost, SscPost } from '../services/sscData';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const TITLE_MAX   = 100;
const CONTENT_MIN = 5;
const CONTENT_MAX = 1000;

const formatTime = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleString('zh-CN', { hour12: false });
};

const Forum: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts]           = useState<SscPost[]>([]);
  const [modalOpen, setModalOpen]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [contentLen, setContentLen] = useState(0);

  useEffect(() => {
    // 前台只展示 status === 'active' 的帖子
    setPosts(getSscPosts().filter((p) => p.status === 'active'));
  }, []);

  const handleSubmit = (values: { title: string; content: string }) => {
    if (!user) return;
    setSubmitting(true);
    setTimeout(() => {
      const newPost = createSscPost(user, values.title, values.content);
      setPosts((prev) => [newPost, ...prev]);
      form.resetFields();
      setContentLen(0);
      setModalOpen(false);
      setSubmitting(false);
    }, 300);
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>
      {/* 页面头 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <Title level={2} style={{ margin: 0 }}>首重拼邮 · 留言板</Title>
        {isAuthenticated ? (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setModalOpen(true)}
          >
            发帖
          </Button>
        ) : (
          <Space>
            <Text type="secondary">登录后可发帖</Text>
            <Button onClick={() => navigate('/login')}>去登录</Button>
          </Space>
        )}
      </div>

      {/* 发帖规则卡片 */}
      <Card
        style={{
          background: '#f8f9fa',
          border: '1px solid #e8e8e8',
          borderRadius: 10,
          marginBottom: 20,
        }}
        bodyStyle={{ padding: '14px 20px' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <InfoCircleOutlined style={{ color: '#888', marginTop: 3, flexShrink: 0 }} />
          <div>
            <Text strong style={{ fontSize: 13, color: '#555' }}>发帖须知：</Text>
            <ol style={{
              margin: '6px 0 0 0',
              paddingLeft: 18,
              color: '#666',
              fontSize: 13,
              lineHeight: 1.9,
            }}>
              <li>禁止发布违反加拿大及中国法律法规内容</li>
              <li>禁止广告刷屏、引流欺诈、垃圾信息</li>
              <li>内容需与跨境运输 / 拼邮 / 邮寄经验相关</li>
              <li>管理员有权隐藏或删除不合规帖子</li>
            </ol>
          </div>
        </div>
      </Card>

      {/* 广告位 — 首重拼邮帖子列表上方 */}
      {/* [AD_SLOT: forum_above_posts] */}
      <div style={{
        border: '1px dashed #d9d9d9',
        borderRadius: 8,
        padding: '12px 16px',
        textAlign: 'center',
        color: '#bbb',
        fontSize: 13,
        marginBottom: 20,
        background: '#fafafa',
      }}>
        广告位
      </div>

      {/* 未登录提示 */}
      {!isAuthenticated && (
        <Alert
          icon={<LockOutlined />}
          message="请登录后参与讨论"
          description={
            <Space>
              <Button size="small" type="primary" onClick={() => navigate('/login')}>登录</Button>
              <Button size="small" onClick={() => navigate('/register')}>注册</Button>
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* 帖子列表 */}
      {posts.length === 0 ? (
        <Empty description="暂无帖子，成为第一个发帖的人吧！" style={{ marginTop: 60 }} />
      ) : (
        <List
          dataSource={posts}
          renderItem={(post) => (
            <List.Item key={post.id} style={{ padding: 0, marginBottom: 16 }}>
              <Card style={{ width: '100%' }} hoverable>
                <div style={{ marginBottom: 8 }}>
                  <Text strong style={{ fontSize: 16 }}>
                    {post.title}
                  </Text>
                </div>
                <Paragraph style={{
                  color: '#444',
                  marginBottom: 12,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {post.content}
                </Paragraph>
                <Space size="middle" wrap>
                  <Space size={4}>
                    <Avatar size={20} icon={<UserOutlined />} style={{ background: '#667eea' }} />
                    <Text type="secondary" style={{ fontSize: 13 }}>{post.authorName}</Text>
                  </Space>
                  <Space size={4}>
                    <ClockCircleOutlined style={{ color: '#aaa', fontSize: 13 }} />
                    <Text type="secondary" style={{ fontSize: 13 }}>{formatTime(post.createdAt)}</Text>
                  </Space>
                  <Tag color="blue" style={{ fontSize: 11 }}>
                    {post.authorEmail.split('@')[0]}@***
                  </Tag>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      )}

      {/* 发帖 Modal */}
      <Modal
        title="发布新帖"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); setContentLen(0); }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="标题"
            rules={[
              { required: true, message: '请输入标题' },
              { min: 2, message: '标题至少 2 个字符' },
              { max: TITLE_MAX, message: `标题最多 ${TITLE_MAX} 个字符` },
            ]}
          >
            <Input placeholder="帖子标题" showCount maxLength={TITLE_MAX} />
          </Form.Item>
          <Form.Item
            name="content"
            label={
              <span>
                内容
                <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                  {contentLen}/{CONTENT_MAX}
                </Text>
              </span>
            }
            rules={[
              { required: true, message: '请输入内容' },
              { min: CONTENT_MIN, message: `内容至少 ${CONTENT_MIN} 个字符` },
              { max: CONTENT_MAX, message: `内容最多 ${CONTENT_MAX} 个字符` },
            ]}
          >
            <TextArea
              rows={5}
              placeholder="分享您的问题或经验..."
              maxLength={CONTENT_MAX}
              onChange={(e) => setContentLen(e.target.value.length)}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setModalOpen(false); form.resetFields(); setContentLen(0); }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                发布
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Forum;
