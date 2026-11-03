import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Button, Card, Input, Spin, Typography, message } from 'antd';
import { Helmet } from 'react-helmet-async';
import { articlePath, CompanyArticle as Article, getArticle } from '../services/companyArticles';
import { SITE_ORIGIN } from '../i18n/config';

export default function CompanyArticle() {
  const { articleId, lang } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [showLink, setShowLink] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true); setFailed(false); setArticle(null);
    getArticle(articleId ?? '').then(value => { if (active) setArticle(value); }).catch(() => { if (active) setFailed(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [articleId]);
  const zh = lang === 'zh';
  const url = article ? SITE_ORIGIN + articlePath(article) : '';
  return <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>
    <Helmet><title>{article ? `${article.title} | ${article.company_name} | SaveShipCost` : 'Article | SaveShipCost'}</title><meta name="robots" content={article ? 'index, follow' : 'noindex, follow'} />{article && <><meta name="description" content={article.content.slice(0, 160)} /><link rel="canonical" href={url} /><meta property="og:title" content={article.title} /><meta property="og:description" content={article.content.slice(0, 160)} /><meta property="og:url" content={url} /><meta property="og:type" content="article" /></>}</Helmet>
    {loading ? <Spin /> : failed ? <Alert type="error" message={zh ? '文章加载失败，请刷新重试。' : 'Unable to load the article. Please refresh to retry.'} /> : !article ? <Alert type="info" message={zh ? '文章不存在或尚未发布。' : 'This article is unavailable or unpublished.'} /> : <Card><article lang={article.language}>
      <Link to={`/${lang}/${article.company_type}/${encodeURIComponent(article.company_id)}`}>{article.company_name}</Link>
      <Typography.Title level={1}>{article.title}</Typography.Title>
      <Typography.Paragraph type="secondary">{new Date(article.created_at).toLocaleDateString(lang)} · {article.company_name}</Typography.Paragraph>
      <Button onClick={async () => { try { await navigator.clipboard.writeText(url); message.success(zh ? '链接已复制' : 'Link copied'); } catch { setShowLink(true); } }}>{zh ? '复制文章链接' : 'Copy article link'}</Button>
      {showLink && <Input aria-label="Article link" readOnly value={url} onFocus={e => e.target.select()} style={{ marginTop: 12 }} />}
      <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 17, lineHeight: 1.9, marginTop: 24 }}>{article.content}</div>
    </article></Card>}
  </div>;
}
