-- Separate article storage. Existing merchant, freight and delivery data is untouched.
begin;
create table public.company_articles (
  id uuid primary key,
  company_type text not null check (company_type in ('merchant', 'company')),
  company_id text not null check (length(company_id) between 1 and 200),
  company_name text not null check (length(trim(company_name)) between 1 and 200),
  title text not null check (length(trim(title)) between 1 and 200),
  content text not null check (length(trim(content)) between 5 and 50000),
  language text not null check (language in ('zh','en','fr','es')),
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.company_articles enable row level security;
grant select on public.company_articles to anon, authenticated;
grant insert, update on public.company_articles to authenticated;
create policy "Published articles are public" on public.company_articles for select to anon, authenticated using (status = 'published');
-- app_metadata is assigned by a trusted administrator, never user_metadata or localStorage.
create policy "Article admins read drafts" on public.company_articles for select to authenticated using ((auth.jwt()->'app_metadata'->>'article_admin') = 'true');
create policy "Article admins create" on public.company_articles for insert to authenticated with check ((auth.jwt()->'app_metadata'->>'article_admin') = 'true');
create policy "Article admins update" on public.company_articles for update to authenticated using ((auth.jwt()->'app_metadata'->>'article_admin') = 'true') with check ((auth.jwt()->'app_metadata'->>'article_admin') = 'true');
create index company_articles_company on public.company_articles(company_type, company_id, status, created_at desc);
commit;
