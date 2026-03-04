import React, { useState, useEffect } from 'react';
import {
  Card, Button, Input, Typography, Tabs, Table, Modal,
  Form, Select, Space, Tag, Popconfirm, message,
} from 'antd';
import { LockOutlined, LogoutOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  isAdminLoggedIn, adminLogin, adminLogout,
  saveDeliveryUpdates, DeliveryUpdate,
  fetchDeliveryUpdates, upsertDeliveryUpdate, deleteDeliveryUpdateRemote,
  getMerchants, saveMerchants, Merchant, ServiceItem,
  saveSscPosts, SscPost,
  fetchSscPosts, upsertSscPost,
} from '../services/sscData';

const { Title, Text } = Typography;

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const AdminPage: React.FC = () => {
  const [loggedIn, setLoggedIn]       = useState(isAdminLoggedIn());
  const [password, setPassword]       = useState('');
  const [loginError, setLoginError]   = useState('');

  // Data
  const [deliveries, setDeliveries]   = useState<DeliveryUpdate[]>([]);
  const [merchants, setMerchants]     = useState<Merchant[]>([]);
  const [posts, setPosts]             = useState<SscPost[]>([]);

  // Delivery modal
  const [deliveryModalOpen, setDeliveryModalOpen]   = useState(false);
  const [editingDelivery, setEditingDelivery]         = useState<DeliveryUpdate | null>(null);
  const [deliveryForm] = Form.useForm();

  // Merchant modal
  const [merchantModalOpen, setMerchantModalOpen]   = useState(false);
  const [editingMerchant, setEditingMerchant]         = useState<Merchant | null>(null);
  const [merchantForm] = Form.useForm();

  // Post delete modal
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
  const [deletingPostId, setDeletingPostId]           = useState<string | null>(null);
  const [deleteReason, setDeleteReason]               = useState('');

  useEffect(() => {
    if (loggedIn) {
      fetchDeliveryUpdates().then(setDeliveries);
      setMerchants(getMerchants());
      fetchSscPosts().then(setPosts);
    }
  }, [loggedIn]);

  // ─── Login ────────────────────────────────────────────────────────────────

  const handleLogin = () => {
    if (adminLogin(password)) {
      setLoggedIn(true);
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('密码错误');
    }
  };

  const handleLogout = () => {
    adminLogout();
    setLoggedIn(false);
  };

  // ─── Delivery CRUD ────────────────────────────────────────────────────────

  const openDeliveryModal = (record?: DeliveryUpdate) => {
    setEditingDelivery(record || null);
    deliveryForm.setFieldsValue(record ? { ...record } : { route: 'CN->CA' });
    setDeliveryModalOpen(true);
  };

  const handleDeliverySave = async (values: Record<string, string>) => {
    let upsertItem: DeliveryUpdate;
    let updated: DeliveryUpdate[];
    if (editingDelivery) {
      upsertItem = { ...editingDelivery, ...values } as DeliveryUpdate;
      updated = deliveries.map((d) => d.id === editingDelivery.id ? upsertItem : d);
    } else {
      upsertItem = {
        ...(values as Omit<DeliveryUpdate, 'id' | 'createdAt'>),
        id: genId(),
        createdAt: new Date().toISOString(),
      };
      updated = [upsertItem, ...deliveries];
    }
    setDeliveries(updated);
    saveDeliveryUpdates(updated);
    await upsertDeliveryUpdate(upsertItem);
    setDeliveryModalOpen(false);
    deliveryForm.resetFields();
    message.success('保存成功');
  };

  const handleDeliveryDelete = async (id: string) => {
    const updated = deliveries.filter((d) => d.id !== id);
    setDeliveries(updated);
    saveDeliveryUpdates(updated);
    await deleteDeliveryUpdateRemote(id);
    message.success('已删除');
  };

  // ─── Merchant CRUD ────────────────────────────────────────────────────────

  const openMerchantModal = (record?: Merchant) => {
    setEditingMerchant(record || null);
    if (record) {
      merchantForm.setFieldsValue({
        name:         record.name,
        cities:       record.cities.join(','),
        intro:        record.intro,
        contact:      record.contact,
        wechatQrUrl:  record.wechatQrUrl || '',
        servicesJson: JSON.stringify(record.services || [], null, 2),
      });
    } else {
      merchantForm.resetFields();
      merchantForm.setFieldsValue({ servicesJson: '[]' });
    }
    setMerchantModalOpen(true);
  };

  const handleMerchantSave = (values: {
    name: string; cities: string; intro: string;
    contact: string; wechatQrUrl?: string; servicesJson: string;
  }) => {
    let parsedServices: ServiceItem[] = [];
    try {
      parsedServices = JSON.parse(values.servicesJson || '[]');
    } catch {
      message.error('服务列表 JSON 格式有误，请检查');
      return;
    }
    const data: Merchant = {
      id:          editingMerchant?.id || genId(),
      name:        values.name,
      cities:      values.cities.split(',').map((s) => s.trim()).filter(Boolean),
      intro:       values.intro,
      contact:     values.contact,
      wechatQrUrl: values.wechatQrUrl || '',
      services:    parsedServices,
    };
    const updated = editingMerchant
      ? merchants.map((m) => (m.id === editingMerchant.id ? data : m))
      : [...merchants, data];
    setMerchants(updated);
    saveMerchants(updated);
    setMerchantModalOpen(false);
    message.success('保存成功');
  };

  const handleMerchantDelete = (id: string) => {
    const updated = merchants.filter((m) => m.id !== id);
    setMerchants(updated);
    saveMerchants(updated);
    message.success('已删除');
  };

  // ─── Post Management ─────────────────────────────────────────────────────

  const openDeletePostModal = (id: string) => {
    setDeletingPostId(id);
    setDeleteReason('');
    setDeletePostModalOpen(true);
  };

  const handleDeletePost = async () => {
    if (!deletingPostId) return;
    const updated = posts.map((p) =>
      p.id === deletingPostId
        ? { ...p, status: 'deleted' as const, deleteReason }
        : p
    );
    setPosts(updated);
    saveSscPosts(updated);
    const target = updated.find((p) => p.id === deletingPostId)!;
    await upsertSscPost(target);
    setDeletePostModalOpen(false);
    setDeletingPostId(null);
    message.success('帖子已标记为删除');
  };

  const handleRestorePost = async (id: string) => {
    const updated = posts.map((p) =>
      p.id === id ? { ...p, status: 'active' as const, deleteReason: undefined } : p
    );
    setPosts(updated);
    saveSscPosts(updated);
    const target = updated.find((p) => p.id === id)!;
    await upsertSscPost(target);
    message.success('帖子已恢复');
  };

  // ─── Login Screen ─────────────────────────────────────────────────────────

  if (!loggedIn) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', padding: '20px',
      }}>
        <Card style={{ width: 360, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <LockOutlined style={{ fontSize: 40, color: '#667eea' }} />
            <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>管理员登录</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>仅限授权管理员访问</Text>
          </div>
          <Input.Password
            size="large"
            placeholder="请输入管理员密码"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
            onPressEnter={handleLogin}
            prefix={<LockOutlined style={{ color: '#aaa' }} />}
          />
          {loginError && (
            <div style={{ color: '#ff4d4f', fontSize: 13, marginTop: 8 }}>{loginError}</div>
          )}
          <Button
            type="primary"
            size="large"
            block
            onClick={handleLogin}
            style={{ marginTop: 16 }}
          >
            登录
          </Button>
        </Card>
      </div>
    );
  }

  // ─── Admin Panel ──────────────────────────────────────────────────────────

  const deliveryCols = [
    { title: '起运日期', dataIndex: 'departDate', key: 'departDate', width: 110 },
    {
      title: '线路', dataIndex: 'route', key: 'route', width: 100,
      render: (v: string) => <Tag color={v === 'CN->CA' ? 'blue' : 'green'}>{v}</Tag>,
    },
    {
      title: '运输方式', dataIndex: 'mode', key: 'mode', width: 90,
      render: (v: string) => v === 'sea' ? <Tag color="cyan">海运</Tag> : <Tag color="blue">空运</Tag>,
    },
    { title: '城市', dataIndex: 'city', key: 'city', width: 90 },
    { title: '货代', dataIndex: 'merchantName', key: 'merchantName' },
    { title: '到货日期', dataIndex: 'arrivalDate', key: 'arrivalDate', width: 110,
      render: (v: string) => v || <span style={{ color: '#bbb' }}>—</span> },
    { title: '时效', dataIndex: 'eta', key: 'eta', width: 90 },
    { title: '首重/价格', dataIndex: 'firstWeightPrice', key: 'firstWeightPrice', width: 110,
      render: (v: string) => v || <span style={{ color: '#bbb' }}>—</span> },
    { title: '续重价格', dataIndex: 'additionalWeightPrice', key: 'additionalWeightPrice', width: 100,
      render: (v: string) => v || <span style={{ color: '#bbb' }}>—</span> },
    {
      title: '操作', key: 'action', width: 150,
      render: (_: unknown, record: DeliveryUpdate) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openDeliveryModal(record)}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDeliveryDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const merchantCols = [
    { title: '商家名称', dataIndex: 'name', key: 'name' },
    {
      title: '覆盖城市', dataIndex: 'cities', key: 'cities',
      render: (v: string[]) => v.map((c) => <Tag key={c} color="blue">{c}</Tag>),
    },
    {
      title: '服务数', dataIndex: 'services', key: 'services', width: 70,
      render: (v: ServiceItem[]) => v.length,
    },
    {
      title: '操作', key: 'action', width: 150,
      render: (_: unknown, record: Merchant) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openMerchantModal(record)}>编辑</Button>
          <Popconfirm title="确认删除该商家？" onConfirm={() => handleMerchantDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const postCols = [
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '作者', dataIndex: 'authorName', key: 'authorName', width: 120 },
    {
      title: '时间', dataIndex: 'createdAt', key: 'createdAt', width: 160,
      render: (v: string) => new Date(v).toLocaleString('zh-CN', { hour12: false }),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (v: string) => (
        <Tag color={v === 'active' ? 'green' : 'red'}>{v === 'active' ? '正常' : '已删除'}</Tag>
      ),
    },
    {
      title: '操作', key: 'action', width: 120,
      render: (_: unknown, record: SscPost) => (
        record.status === 'active' ? (
          <Button size="small" danger onClick={() => openDeletePostModal(record.id)}>删帖</Button>
        ) : (
          <Button size="small" onClick={() => handleRestorePost(record.id)}>恢复</Button>
        )
      ),
    },
  ];

  const tabItems = [
    {
      key: 'delivery',
      label: '到货动态',
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openDeliveryModal()}>
              新增动态
            </Button>
          </div>
          <Table
            dataSource={deliveries}
            columns={deliveryCols}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: 'merchants',
      label: '商家管理',
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openMerchantModal()}>
              新增商家
            </Button>
          </div>
          <Table
            dataSource={merchants}
            columns={merchantCols}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: 'posts',
      label: '帖子审核',
      children: (
        <Table
          dataSource={posts}
          columns={postCols}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <Title level={3} style={{ margin: 0 }}>管理后台</Title>
        <Button icon={<LogoutOutlined />} onClick={handleLogout}>退出登录</Button>
      </div>

      <Card style={{ borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
        <Tabs items={tabItems} />
      </Card>

      {/* 到货动态 新增/编辑 Modal */}
      <Modal
        title={editingDelivery ? '编辑动态' : '新增动态'}
        open={deliveryModalOpen}
        onCancel={() => { setDeliveryModalOpen(false); deliveryForm.resetFields(); }}
        footer={null}
        destroyOnClose
      >
        <Form form={deliveryForm} layout="vertical" onFinish={handleDeliverySave} style={{ marginTop: 16 }}>
          <Form.Item name="departDate" label="起运日期" rules={[{ required: true, message: '请输入起运日期' }]}>
            <Input placeholder="2026-02-10" />
          </Form.Item>
          <Form.Item name="route" label="线路" rules={[{ required: true }]}>
            <Select options={[
              { value: 'CN->CA', label: 'CN→CA（中国发加拿大）' },
              { value: 'CA->CN', label: 'CA→CN（加拿大发中国）' },
            ]} />
          </Form.Item>
          <Form.Item name="city" label="城市" rules={[{ required: true, message: '请输入城市' }]}>
            <Input placeholder="Ottawa" />
          </Form.Item>
          <Form.Item name="merchantName" label="货代名称" rules={[{ required: true, message: '请输入货代名称' }]}>
            <Input placeholder="铭创优国际快递" />
          </Form.Item>
          <Form.Item name="merchantId" label="货代ID（可选）">
            <Input placeholder="m001" />
          </Form.Item>
          <Form.Item name="eta" label="时效" rules={[{ required: true, message: '请输入时效' }]}>
            <Input placeholder="7-10天" />
          </Form.Item>
          <Form.Item name="arrivalDate" label="到货日期（可选）">
            <Input placeholder="2026-03-10" />
          </Form.Item>
          <Form.Item name="mode" label="运输方式" initialValue="air" rules={[{ required: true }]}>
            <Select options={[
              { label: '空运', value: 'air' },
              { label: '海运', value: 'sea' },
            ]} />
          </Form.Item>
          <Form.Item name="firstWeightPrice" label="首重/价格（可选）">
            <Input placeholder="例：189/0.5kg" />
          </Form.Item>
          <Form.Item name="additionalWeightPrice" label="续重价格（可选）">
            <Input placeholder="例：49/kg" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setDeliveryModalOpen(false); deliveryForm.resetFields(); }}>取消</Button>
              <Button type="primary" htmlType="submit">保存</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 商家 新增/编辑 Modal */}
      <Modal
        title={editingMerchant ? '编辑商家' : '新增商家'}
        open={merchantModalOpen}
        onCancel={() => { setMerchantModalOpen(false); merchantForm.resetFields(); }}
        footer={null}
        width={680}
        destroyOnClose
      >
        <Form form={merchantForm} layout="vertical" onFinish={handleMerchantSave} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="商家名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="cities" label="覆盖城市（英文逗号分隔）" rules={[{ required: true }]}>
            <Input placeholder="Ottawa,Toronto" />
          </Form.Item>
          <Form.Item name="intro" label="商家简介" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="contact" label="联系方式（支持换行）" rules={[{ required: true }]}>
            <Input.TextArea
              rows={4}
              placeholder={'微信：xxx\n电话：+1-...\n邮箱：...\n网站：...'}
            />
          </Form.Item>
          <Form.Item name="wechatQrUrl" label="微信二维码图片 URL（可选）">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item
            name="servicesJson"
            label='服务列表（JSON，可为 []）'
            rules={[{ required: true }]}
            extra='格式: [{"id":"s1","mode":"air","cargo":"general","speed":"fast","name":"空运快线","etaMin":5,"etaMax":7}]'
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setMerchantModalOpen(false); merchantForm.resetFields(); }}>取消</Button>
              <Button type="primary" htmlType="submit">保存</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 帖子删帖确认 Modal */}
      <Modal
        title="确认删帖"
        open={deletePostModalOpen}
        onCancel={() => { setDeletePostModalOpen(false); setDeletingPostId(null); }}
        onOk={handleDeletePost}
        okText="确认删除"
        okButtonProps={{ danger: true }}
      >
        <div style={{ marginBottom: 12 }}>
          <Text type="secondary">删除原因（选填）：</Text>
        </div>
        <Input.TextArea
          rows={3}
          placeholder="如：广告引流 / 违规内容 / 其他..."
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default AdminPage;
