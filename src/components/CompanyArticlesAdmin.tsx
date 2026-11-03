import { useEffect, useState } from 'react';
import { Alert, Button, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Merchant } from '../services/sscData';
import { companyData } from '../data/companyData';
import { articlePath, CompanyArticle, listArticles, saveArticle } from '../services/companyArticles';
import { SITE_ORIGIN } from '../i18n/config';

export default function CompanyArticlesAdmin({ merchants }: { merchants: Merchant[] }) {
  const [allowed, setAllowed] = useState(false);
  const [rows, setRows] = useState<CompanyArticle[]>([]);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<CompanyArticle | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const companies = [...merchants.map(m => ({ value: `merchant:${m.id}`, label: `${m.name}（商家）`, name: m.name })), ...companyData.map(c => ({ value: `company:${c.id}`, label: `${c.name}（运价公司）`, name: c.name }))];
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      const canEdit = data.user?.app_metadata?.article_admin === true;
      if (active) setAllowed(canEdit);
      if (canEdit) listArticles(undefined, true).then(values => { if (active) setRows(values); }).catch(() => { if (active) setError('文章服务尚未就绪或读取失败，请检查数据库配置后刷新。'); });
    });
    return () => { active = false; };
  }, []);
  const edit = (article?: CompanyArticle) => {
    setEditing(article ?? null); form.resetFields();
    form.setFieldsValue(article ? { ...article, company: `${article.company_type}:${article.company_id}` } : { language: 'zh', status: 'draft' });
    setOpen(true);
  };
  if (!allowed) return <Alert type="info" message="文章管理需要已获文章编辑权限的网站账号" description={<><Link to="/zh/login">登录网站账号</Link>后返回此页面。后台管理口令不能代替文章编辑权限。</>} />;
  return <>
    {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
    <Button type="primary" onClick={() => edit()} style={{ marginBottom: 16 }}>写公司文章</Button>
    <Table rowKey="id" dataSource={rows} columns={[
      { title: '标题', dataIndex: 'title' }, { title: '快递公司', dataIndex: 'company_name' },
      { title: '状态', dataIndex: 'status', render: value => <Tag>{value === 'published' ? '已发布' : '草稿'}</Tag> },
      { title: '操作', render: (_, row) => <Space wrap><Button onClick={() => edit(row)}>编辑</Button>{row.status === 'published' && <><a href={articlePath(row)} target="_blank" rel="noreferrer">阅读文章</a><Button onClick={async () => { try { await navigator.clipboard.writeText(SITE_ORIGIN + articlePath(row)); message.success('链接已复制'); } catch { Modal.info({ title: '复制文章链接', content: <Input readOnly value={SITE_ORIGIN + articlePath(row)} onFocus={e => e.target.select()} /> }); } }}>复制链接</Button></>}</Space> },
    ]} />
    <Modal title={editing ? '编辑公司文章' : '写公司文章'} open={open} width={800} confirmLoading={saving} okText="保存" cancelText="取消" onCancel={() => { if (!saving) setOpen(false); }} onOk={() => form.submit()}>
      <Form form={form} layout="vertical" onFinish={async values => {
        const company = companies.find(c => c.value === values.company);
        if (!company) { message.error('请选择有效的快递公司'); return; }
        const split = values.company.indexOf(':');
        const now = new Date().toISOString();
        const article: CompanyArticle = { id: editing?.id ?? crypto.randomUUID(), company_type: values.company.slice(0, split), company_id: values.company.slice(split + 1), company_name: company.name, title: values.title.trim(), content: values.content.trim(), language: values.language, status: values.status, created_at: editing?.created_at ?? now, updated_at: now };
        setSaving(true);
        try {
          const saved = await saveArticle(article);
          setRows(old => [saved, ...old.filter(item => item.id !== saved.id)]);
          setError(''); setOpen(false); message.success(saved.status === 'published' ? '已发布，可以复制文章链接分享' : '草稿已保存，访客不可见');
        } catch { message.error('保存失败，文章尚未保存。请检查网络或文章编辑权限后重试。'); }
        finally { setSaving(false); }
      }}>
        <Form.Item name="company" label="快递公司" rules={[{ required: true }]}><Select showSearch optionFilterProp="label" options={companies} /></Form.Item>
        <Form.Item name="title" label="文章标题" rules={[{ required: true, whitespace: true }, { max: 200 }]}><Input maxLength={200} /></Form.Item>
        <Form.Item name="language" label="文章语言" rules={[{ required: true }]}><Select disabled={!!editing} options={[{ value: 'zh', label: '中文' }, { value: 'en', label: 'English' }, { value: 'fr', label: 'Français' }, { value: 'es', label: 'Español' }]} /></Form.Item>
        <Form.Item name="content" label="正文" rules={[{ required: true, whitespace: true }, { min: 5, max: 50000 }]}><Input.TextArea rows={14} maxLength={50000} showCount /></Form.Item>
        <Form.Item name="status" label="发布状态" rules={[{ required: true }]}><Select options={[{ value: 'draft', label: '草稿（不公开）' }, { value: 'published', label: '发布（任何人可通过链接阅读）' }]} /></Form.Item>
      </Form>
    </Modal>
  </>;
}
