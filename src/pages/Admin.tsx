import React, { useState, useEffect } from 'react';
import {
  Card, Button, Input, Typography, Tabs, Table, Modal,
  Form, Select, Space, Tag, Popconfirm, message, Upload, AutoComplete,
} from 'antd';
import { LockOutlined, LogoutOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import {
  isAdminLoggedIn, adminLogin, adminLogout,
  saveDeliveryUpdates, DeliveryUpdate,
  fetchDeliveryUpdates, upsertDeliveryUpdate, deleteDeliveryUpdateRemote,
  getMerchants, saveMerchants, Merchant, ServiceItem,
  saveSscPosts, SscPost,
  fetchSscPosts, upsertSscPost,
  CityAnnouncement, fetchCityAnnouncements, upsertCityAnnouncement, deleteCityAnnouncementRemote,
} from '../services/sscData';

const { Title, Text } = Typography;

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const SERVICE_OPTIONS = [
  { label: '空普', value: 'air-general' },
  { label: '空敏', value: 'air-sensitive' },
  { label: '海普', value: 'sea-general' },
  { label: '海敏', value: 'sea-sensitive' },
];

const SERVICE_MAP: Record<string, ServiceItem> = {
  'air-general':   { id: 'air-general',   mode: 'air', cargo: 'general',   speed: 'standard', name: '空运普货',   etaMin: 7,  etaMax: 14 },
  'air-sensitive': { id: 'air-sensitive', mode: 'air', cargo: 'sensitive', speed: 'standard', name: '空运敏感货', etaMin: 7,  etaMax: 14 },
  'sea-general':   { id: 'sea-general',   mode: 'sea', cargo: 'general',   speed: 'standard', name: '海运普货',   etaMin: 30, etaMax: 45 },
  'sea-sensitive': { id: 'sea-sensitive', mode: 'sea', cargo: 'sensitive', speed: 'standard', name: '海运敏感货', etaMin: 30, etaMax: 45 },
};

const CITY_OPTIONS = [
  { value: 'Ottawa',    label: 'Ottawa 渥太华' },
  { value: 'Toronto',   label: 'Toronto 多伦多' },
  { value: 'Montreal',  label: 'Montreal 蒙特利尔' },
  { value: 'Vancouver', label: 'Vancouver 温哥华' },
  { value: 'Calgary',   label: 'Calgary 卡尔加里' },
  { value: 'Edmonton',  label: 'Edmonton 埃德蒙顿' },
  { value: 'Winnipeg',  label: 'Winnipeg 温尼伯' },
  { value: 'Halifax',   label: 'Halifax 哈利法克斯' },
];

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
  const [qrPreview, setQrPreview] = useState<string>('');

  // Post delete modal
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
  const [deletingPostId, setDeletingPostId]           = useState<string | null>(null);
  const [deleteReason, setDeleteReason]               = useState('');

  // City announcements
  const [announcements, setAnnouncements]                   = useState<CityAnnouncement[]>([]);
  const [annFilterCity, setAnnFilterCity]                   = useState<string>('Ottawa');
  const [annModalOpen, setAnnModalOpen]                     = useState(false);
  const [editingAnn, setEditingAnn]                         = useState<CityAnnouncement | null>(null);
  const [annImagePreview, setAnnImagePreview]               = useState<string>('');
  const [annForm] = Form.useForm();

  useEffect(() => {
    if (loggedIn) {
      fetchDeliveryUpdates().then(setDeliveries);
      setMerchants(getMerchants());
      fetchSscPosts().then(setPosts);
      fetchCityAnnouncements().then(setAnnouncements);
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
      const servicesList = (record.services || []).map((s) => ({
        type:        `${s.mode}-${s.cargo}`,
        firstWeight: s.firstWeight || '',
        priceCAD:    s.priceCAD    || '',
        priceCNY:    s.priceCNY    || '',
      }));
      setQrPreview(record.wechatQrUrl || '');
      merchantForm.setFieldsValue({
        name:        record.name,
        cities:      record.cities.join(','),
        intro:       record.intro,
        contact:     record.contact,
        wechatQrUrl: record.wechatQrUrl || '',
        services:    servicesList,
      });
    } else {
      merchantForm.resetFields();
      setQrPreview('');
    }
    setMerchantModalOpen(true);
  };

  const handleMerchantSave = (values: {
    name: string; cities: string; intro: string;
    contact: string; wechatQrUrl?: string;
    services: { type: string; firstWeight?: string; priceCAD?: string; priceCNY?: string }[];
  }) => {
    const parsedServices: ServiceItem[] = (values.services || [])
      .filter((item) => item?.type && SERVICE_MAP[item.type])
      .map((item) => ({
        ...SERVICE_MAP[item.type],
        id:          genId(),
        firstWeight: item.firstWeight || undefined,
        priceCAD:    item.priceCAD    || undefined,
        priceCNY:    item.priceCNY    || undefined,
      }));
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

  // ─── Announcement CRUD ────────────────────────────────────────────────────

  const openAnnModal = (record?: CityAnnouncement) => {
    setEditingAnn(record || null);
    if (record) {
      setAnnImagePreview(record.imageUrl || '');
      annForm.setFieldsValue({ city: record.city, companyName: record.companyName || '', content: record.content, imageUrl: record.imageUrl || '' });
    } else {
      annForm.resetFields();
      annForm.setFieldsValue({ city: annFilterCity });
      setAnnImagePreview('');
    }
    setAnnModalOpen(true);
  };

  const handleAnnSave = async (values: { city: string; companyName?: string; content: string; imageUrl?: string }) => {
    const item: CityAnnouncement = {
      id: editingAnn?.id || genId(),
      city: values.city,
      companyName: values.companyName || undefined,
      content: values.content,
      imageUrl: values.imageUrl || undefined,
      sortOrder: editingAnn?.sortOrder ?? 0,
      createdAt: editingAnn?.createdAt || new Date().toISOString(),
    };
    const err = await upsertCityAnnouncement(item);
    if (err) {
      message.error(`保存失败：${err}`);
      return;
    }
    const fresh = await fetchCityAnnouncements();
    setAnnouncements(fresh);
    setAnnFilterCity(item.city);
    setAnnModalOpen(false);
    annForm.resetFields();
    setAnnImagePreview('');
    message.success('公告已保存');
  };

  const handleAnnDelete = async (id: string) => {
    const err = await deleteCityAnnouncementRemote(id);
    if (err) { message.error(`删除失败：${err}`); return; }
    const fresh = await fetchCityAnnouncements();
    setAnnouncements(fresh);
    message.success('已删除');
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
    {
      key: 'announcements',
      label: '城市公告',
      children: (
        <div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <Select
              value={annFilterCity}
              onChange={setAnnFilterCity}
              style={{ width: 180 }}
              options={[{ value: '__all__', label: '全部城市' }, ...CITY_OPTIONS]}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openAnnModal()}>
              新增公告
            </Button>
            <Text type="secondary" style={{ fontSize: 12 }}>共 {announcements.length} 条</Text>
          </div>
          <Table
            dataSource={annFilterCity === '__all__' ? announcements : announcements.filter((a) => a.city === annFilterCity)}
            rowKey="id"
            size="small"
            pagination={false}
            columns={[
              {
                title: '城市', dataIndex: 'city', key: 'city', width: 110,
                render: (v: string) => <Tag color="blue">{v}</Tag>,
              },
              {
                title: '快递公司', dataIndex: 'companyName', key: 'companyName', width: 130,
                render: (v: string) => v ? <Tag color="purple">{v}</Tag> : <span style={{ color: '#bbb' }}>—</span>,
              },
              {
                title: '公告内容', dataIndex: 'content', key: 'content', ellipsis: true,
                render: (v: string) => <span style={{ whiteSpace: 'pre-wrap' }}>{v}</span>,
              },
              {
                title: '图片', dataIndex: 'imageUrl', key: 'imageUrl', width: 70,
                render: (v: string) => v
                  ? <img src={v} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                  : <span style={{ color: '#bbb' }}>无</span>,
              },
              {
                title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160,
                render: (v: string) => new Date(v).toLocaleString('zh-CN', { hour12: false }),
              },
              {
                title: '操作', key: 'action', width: 140,
                render: (_: unknown, record: CityAnnouncement) => (
                  <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => openAnnModal(record)}>编辑</Button>
                    <Popconfirm title="确认删除该公告？" onConfirm={() => handleAnnDelete(record.id)}>
                      <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        </div>
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
        <Form
          form={deliveryForm}
          layout="vertical"
          onFinish={handleDeliverySave}
          style={{ marginTop: 16 }}
          onValuesChange={(changed, all) => {
            if ('arrivalDate' in changed || 'departDate' in changed) {
              const depart = all.departDate?.trim();
              const arrival = all.arrivalDate?.trim();
              if (depart && arrival) {
                const d1 = new Date(depart);
                const d2 = new Date(arrival);
                if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
                  const days = Math.round((d2.getTime() - d1.getTime()) / 86400000);
                  if (days < 0) {
                    message.error('日期有误：到货日期早于起运日期，请重新检查');
                    deliveryForm.setFieldsValue({ departDate: '', arrivalDate: '', eta: '' });
                  } else {
                    deliveryForm.setFieldsValue({ eta: `${days}天` });
                  }
                }
              }
            }
          }}
        >
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
          <Form.Item name="arrivalDate" label="到货日期（可选）">
            <Input placeholder="2026-03-10" />
          </Form.Item>
          <Form.Item name="eta" label="时效" rules={[{ required: true, message: '请输入时效' }]}>
            <Input placeholder="7-10天（填入到货日期后自动计算）" />
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
        onCancel={() => { setMerchantModalOpen(false); merchantForm.resetFields(); setQrPreview(''); }}
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

          {/* 微信二维码上传 */}
          <Form.Item name="wechatQrUrl" label="微信二维码图片（可选）">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const dataUrl = e.target?.result as string;
                    setQrPreview(dataUrl);
                    merchantForm.setFieldsValue({ wechatQrUrl: dataUrl });
                  };
                  reader.readAsDataURL(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>点击上传图片</Button>
              </Upload>
              {qrPreview && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={qrPreview}
                    alt="微信二维码预览"
                    style={{ width: 100, height: 100, objectFit: 'contain', border: '1px solid #eee', borderRadius: 8 }}
                  />
                  <Button
                    size="small"
                    danger
                    onClick={() => { setQrPreview(''); merchantForm.setFieldsValue({ wechatQrUrl: '' }); }}
                  >
                    移除
                  </Button>
                </div>
              )}
            </Space>
          </Form.Item>

          {/* 服务信息 */}
          <Form.Item label="服务信息">
            <Form.List name="services">
              {(fields, { add, remove }) => (
                <>
                  {/* 表头 */}
                  {fields.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 12, color: '#888', paddingRight: 32 }}>
                      <div style={{ flex: '0 0 140px' }}>服务类型</div>
                      <div style={{ flex: '0 0 88px' }}>首重</div>
                      <div style={{ flex: '0 0 100px' }}>价格/加币</div>
                      <div style={{ flex: '0 0 100px' }}>价格/人民币</div>
                    </div>
                  )}
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                      <Form.Item {...restField} name={[name, 'type']} style={{ flex: '0 0 140px', marginBottom: 0 }}>
                        <Select placeholder="服务类型" options={SERVICE_OPTIONS} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'firstWeight']} style={{ flex: '0 0 88px', marginBottom: 0 }}>
                        <Input placeholder="如 0.5kg" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'priceCAD']} style={{ flex: '0 0 100px', marginBottom: 0 }}>
                        <Input placeholder="如 $15/kg" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'priceCNY']} style={{ flex: '0 0 100px', marginBottom: 0 }}>
                        <Input placeholder="如 ¥100/kg" />
                      </Form.Item>
                      <Button danger size="small" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                    </div>
                  ))}
                  <Button type="dashed" icon={<PlusOutlined />} onClick={() => add()} block>
                    添加服务
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setMerchantModalOpen(false); merchantForm.resetFields(); setQrPreview(''); }}>取消</Button>
              <Button type="primary" htmlType="submit">保存</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 城市公告 新增/编辑 Modal */}
      <Modal
        title={editingAnn ? '编辑公告' : '新增公告'}
        open={annModalOpen}
        onCancel={() => { setAnnModalOpen(false); annForm.resetFields(); setAnnImagePreview(''); }}
        footer={null}
        width={560}
        destroyOnClose
      >
        <Form form={annForm} layout="vertical" onFinish={handleAnnSave} style={{ marginTop: 16 }}>
          <Form.Item name="city" label="所属城市" rules={[{ required: true }]}>
            <Select options={CITY_OPTIONS} />
          </Form.Item>
          <Form.Item name="companyName" label="快递公司（可选）">
            <AutoComplete
              options={merchants.map((m) => ({ value: m.name }))}
              placeholder="选择或输入快递公司名称"
              filterOption={(input, option) =>
                (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
              }
              allowClear
            />
          </Form.Item>
          <Form.Item name="content" label="公告文字内容" rules={[{ required: true, message: '请输入公告内容' }]}>
            <Input.TextArea rows={4} placeholder="例：渥太华本周空运特价，首重仅需 $15！" />
          </Form.Item>
          <Form.Item name="imageUrl" label="配图（可选）">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const dataUrl = e.target?.result as string;
                    setAnnImagePreview(dataUrl);
                    annForm.setFieldsValue({ imageUrl: dataUrl });
                  };
                  reader.readAsDataURL(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>点击上传图片</Button>
              </Upload>
              {annImagePreview && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={annImagePreview}
                    alt="预览"
                    style={{ maxWidth: 200, maxHeight: 150, objectFit: 'contain', border: '1px solid #eee', borderRadius: 8 }}
                  />
                  <Button
                    size="small"
                    danger
                    onClick={() => { setAnnImagePreview(''); annForm.setFieldsValue({ imageUrl: '' }); }}
                  >
                    移除图片
                  </Button>
                </div>
              )}
            </Space>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setAnnModalOpen(false); annForm.resetFields(); setAnnImagePreview(''); }}>取消</Button>
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
