"""Read-only HTML audit. Public URLs only; never executes ads or queries Supabase."""
import argparse
import concurrent.futures
import datetime as dt
import json
import pathlib
import subprocess
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parents[1]
ORIGIN = 'https://www.saveshipcost.com'

class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ''
        self.in_title = False
        self.meta = {}
        self.canonicals = []
        self.alternates = {}
        self.h1 = 0
        self.lang = ''
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'title': self.in_title = True
        if tag == 'html': self.lang = a.get('lang', '')
        if tag == 'h1': self.h1 += 1
        if tag == 'meta': self.meta[a.get('name', a.get('property', ''))] = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'canonical': self.canonicals.append(a.get('href'))
        if tag == 'link' and a.get('rel') == 'alternate': self.alternates[a.get('hreflang')] = a.get('href')
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
    def handle_data(self, data):
        if self.in_title: self.title += data

def audit(url, dist=None):
    row = {'url': url, 'status': None, 'title': '', 'description': '', 'canonical': '', 'issues': [], 'raw_h1': None}
    try:
        if dist:
            html = (pathlib.Path(dist) / urlparse(url).path.lstrip('/') / 'index.html').read_text()
            row['status'] = 200
        else:
            result = subprocess.run(['curl', '-L', '-sS', '--max-time', '20', '--max-redirs', '3', '--proto', '=https', '--proto-redir', '=https', '-w', '\n%{http_code}', url], capture_output=True, text=True, check=True)
            html, status = result.stdout.rsplit('\n', 1)
            row['status'] = int(status)
        h = Head(); h.feed(html)
        row.update(title=h.title, description=h.meta.get('description', ''), canonical=';'.join(h.canonicals), raw_h1=h.h1)
        if row['status'] != 200: row['issues'].append('HTTP 状态异常')
        if not h.title: row['issues'].append('缺少 title')
        if not row['description']: row['issues'].append('缺少 description')
        if h.canonicals != [url]: row['issues'].append('canonical 缺失、重复或不匹配')
        if 'noindex' in h.meta.get('robots', '').lower(): row['issues'].append('可索引页面含 noindex')
        tail = '/' + '/'.join(urlparse(url).path.strip('/').split('/')[1:])
        tail = '' if tail == '/' else tail
        for lang, code in [('en','en'),('zh','zh-CN'),('fr','fr'),('es','es'),('en','x-default')]:
            if h.alternates.get(code) != f'{ORIGIN}/{lang}{tail}': row['issues'].append(f'hreflang {code} 不匹配')
        for prefix in ['og', 'twitter']:
            if h.meta.get(prefix + ':title') != h.title: row['issues'].append(prefix + ' 标题与页面不一致')
            if h.meta.get(prefix + ':description') != row['description']: row['issues'].append(prefix + ' 描述与页面不一致')
    except (OSError, ValueError, subprocess.SubprocessError) as exc:
        row['issues'].append('读取失败: ' + type(exc).__name__)
    return row

def main():
    p = argparse.ArgumentParser(); p.add_argument('--output', required=True); p.add_argument('--dist'); args = p.parse_args()
    xml = ET.parse(ROOT / 'public/sitemap.xml')
    urls = sorted(set(n.text.strip() for n in xml.iter() if n.tag.endswith('}loc') or n.tag == 'loc'))
    if not urls or any(urlparse(u).netloc != 'www.saveshipcost.com' or urlparse(u).scheme != 'https' for u in urls):
        raise SystemExit('Sitemap contains unexpected or missing URLs')
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        pages = list(pool.map(lambda u: audit(u, args.dist), urls))
    report = {'checked_at': dt.datetime.now(dt.timezone.utc).isoformat(), 'mode': 'local-build' if args.dist else 'live-http', 'scope': '原始HTML；不代表Google已收录、排名或渲染后正文', 'pages': pages, 'issue_pages': sum(bool(r['issues']) for r in pages)}
    out = pathlib.Path(args.output); out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps({'pages':len(pages), 'issue_pages':report['issue_pages'], 'output':str(out)}, ensure_ascii=False))
    return 1 if report['issue_pages'] else 0

if __name__ == '__main__': raise SystemExit(main())
