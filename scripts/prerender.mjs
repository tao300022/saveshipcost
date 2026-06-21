/**
 * Post-build SEO prerender — pure Node, no browser.
 *
 * For every route in public/sitemap.xml, clones the built dist/index.html shell
 * and injects the per-language SEO head: <html lang>, canonical, hreflang
 * alternates (+ x-default), and localized <title>/description/keywords for pages
 * that define them. Writes dist/<path>/index.html so Googlebot receives correct,
 * JS-independent canonical/hreflang — fixing the GSC "Google chose a different
 * canonical" report on the i18n SPA.
 *
 * Why not render the React app? The app needs browser globals + Supabase env at
 * runtime; running it headless on the Vercel build image is unreliable (missing
 * Chromium system libs). The canonical/hreflang/title are fully derivable from
 * the route + i18n JSON, so we template them directly — 100% reproducible.
 *
 * Body content stays the empty #root shell; Googlebot still renders it via JS as
 * before. Only the head SEO signals are made static (the part that was failing).
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const ORIGIN = 'https://www.saveshipcost.com';

// Mirror of src/i18n/config.ts (kept in sync manually — small + stable).
const LANGS = ['zh', 'en', 'fr', 'es'];
const HREFLANG = { zh: 'zh-CN', en: 'en', fr: 'fr', es: 'es' };
const DEFAULT_LANG = 'en';

// subPath (without lang prefix) -> dotted path in the i18n JSON holding the meta
// object ({ title, description, keywords? }).
const META_PATH = {
  '/': 'home.meta',
  '/air-freight': 'airFreight.meta',
  '/sea-freight': 'seaFreight.meta',
  '/ottawa': 'pageMeta.ottawa',
  '/faq': 'pageMeta.faq',
  '/forum': 'pageMeta.forum',
  '/contact': 'pageMeta.contact',
  '/privacy-policy': 'pageMeta.privacyPolicy',
  '/terms-of-use': 'pageMeta.termsOfUse',
  '/disclaimer': 'pageMeta.disclaimer',
  '/cookie-policy': 'pageMeta.cookiePolicy',
};

// Default city for the static /ottawa snapshot (page supports ?city= at runtime).
const OTTAWA_CITY = { zh: '渥太华' };

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function routesFromSitemap() {
  const xml = readFileSync(join(ROOT, 'public', 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
  const paths = locs
    .filter((u) => u.startsWith(ORIGIN))
    .map((u) => u.slice(ORIGIN.length) || '/');
  return [...new Set(paths)];
}

// Lazy-load + cache each language's translation JSON.
const localeCache = {};
function meta(lang, path) {
  if (!path) return null;
  if (!localeCache[lang]) {
    const file = join(ROOT, 'src', 'i18n', 'locales', lang, 'common.json');
    localeCache[lang] = JSON.parse(readFileSync(file, 'utf8'));
  }
  return path.split('.').reduce((o, k) => o?.[k], localeCache[lang]) ?? null;
}

function buildHead(route) {
  const seg = route.split('/').filter(Boolean); // ["en"] or ["en","air-freight"]
  const lang = seg[0];
  const subPath = '/' + seg.slice(1).join('/'); // "/" or "/air-freight"
  const tail = subPath === '/' ? '' : subPath;
  const canonical = `${ORIGIN}/${lang}${tail}`;

  const links = LANGS.map(
    (l) => `<link rel="alternate" hreflang="${HREFLANG[l]}" href="${ORIGIN}/${l}${tail}" />`
  );
  links.push(
    `<link rel="alternate" hreflang="x-default" href="${ORIGIN}/${DEFAULT_LANG}${tail}" />`
  );
  const headLinks =
    `\n    <link rel="canonical" href="${canonical}" />\n    ` + links.join('\n    ') + '\n  ';

  let m = meta(lang, META_PATH[subPath]);
  if (m && subPath === '/ottawa') {
    const city = OTTAWA_CITY[lang] ?? 'Ottawa';
    m = Object.fromEntries(
      Object.entries(m).map(([k, v]) => [k, String(v).replace(/\{\{city\}\}/g, city)])
    );
  }
  return { lang, canonical, headLinks, m };
}

function inject(shell, route) {
  const { lang, canonical, headLinks, m } = buildHead(route);
  let html = shell;

  // <html lang="...">
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${HREFLANG[lang]}">`);

  // Localized title / description / keywords (only the 3 pages that define meta).
  if (m?.title) html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(m.title)}</title>`);
  if (m?.description)
    html = html.replace(
      /<meta name="description" content="[\s\S]*?"\s*\/?>/,
      `<meta name="description" content="${esc(m.description)}" />`
    );
  if (m?.keywords && !/name="keywords"/.test(html))
    html = html.replace(
      /(<meta name="description"[^>]*>)/,
      `$1\n    <meta name="keywords" content="${esc(m.keywords)}" />`
    );

  // Point Open Graph at this route's canonical URL.
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canonical}" />`
  );

  // Inject canonical + hreflang just before </head>.
  html = html.replace('</head>', `${headLinks}</head>`);
  return html;
}

function main() {
  const shell = readFileSync(join(DIST, 'index.html'), 'utf8');
  const routes = routesFromSitemap();
  let n = 0;
  for (const route of routes) {
    const outFile = join(DIST, route, 'index.html');
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, inject(shell, route), 'utf8');
    n++;
  }
  console.log(`[prerender] injected SEO head into ${n} static pages`);
}

main();
