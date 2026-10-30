import { supabase } from '../lib/supabase';

export interface CompanyArticle {
  id: string;
  company_type: 'merchant' | 'company';
  company_id: string;
  company_name: string;
  title: string;
  content: string;
  language: 'zh' | 'en' | 'fr' | 'es';
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export async function listArticles(company?: { type: string; id: string }, admin = false) {
  let query = supabase.from('company_articles').select('*').order('created_at', { ascending: false });
  if (!admin) query = query.eq('status', 'published');
  if (company) query = query.eq('company_type', company.type).eq('company_id', company.id);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as CompanyArticle[];
}

export async function getArticle(id: string) {
  const { data, error } = await supabase.from('company_articles').select('*').eq('id', id).eq('status', 'published').maybeSingle();
  if (error) throw error;
  return data as CompanyArticle | null;
}

export async function saveArticle(article: CompanyArticle) {
  const { data, error } = await supabase.from('company_articles').upsert(article).select().single();
  if (error) throw error;
  return data as CompanyArticle;
}

export const articlePath = (article: Pick<CompanyArticle, 'id' | 'language'>) => `/${article.language}/articles/${encodeURIComponent(article.id)}`;
