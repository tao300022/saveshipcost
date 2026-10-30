import { useEffect, useState } from 'react';
import { Alert, Card, Empty, List, Spin } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { articlePath, CompanyArticle, listArticles } from '../services/companyArticles';

export default function CompanyArticles({ type, id }: { type: 'merchant' | 'company'; id: string }) {
  const { lang } = useParams();
  const title = ({ zh: '公司文章', en: 'Company articles', fr: 'Articles de cette entreprise', es: 'Artículos de la empresa' } as Record<string, string>)[lang ?? 'en'] ?? 'Company articles';
  const [articles, setArticles] = useState<CompanyArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(false); setArticles([]);
    listArticles({ type, id }).then(rows => { if (active) setArticles(rows); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [type, id]);
  return <Card title={title} style={{ marginTop: 24 }}>
    {loading ? <Spin /> : error ? <Alert type="warning" message={lang === 'zh' ? '文章暂时无法加载，请稍后重试。' : 'Articles are temporarily unavailable. Please try again later.'} /> : articles.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={lang === 'zh' ? '暂无已发布文章' : 'No published articles'} /> : <List dataSource={articles} renderItem={article => <List.Item><List.Item.Meta title={<Link to={articlePath(article)}>{article.title}</Link>} description={article.content.slice(0, 160)} /></List.Item>} />}
  </Card>;
}
