/**
 * Post-build prerender.
 *
 * Launches the built SPA in a real headless browser, waits for react-helmet to
 * inject the per-language <link rel="canonical"> / hreflang tags, then snapshots
 * the fully-rendered HTML into dist/<path>/index.html. Googlebot then receives
 * static HTML with correct canonical/hreflang/title without executing JS.
 *
 * Route list is parsed from public/sitemap.xml — single source of truth.
 *
 * Designed to NEVER break the deploy: any failure (e.g. Chromium unavailable on
 * the build host) is logged and the script exits 0, leaving the normal SPA build
 * intact as a fallback.
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = join(ROOT, 'dist');
const ORIGIN = 'https://www.saveshipcost.com';
const PORT = 4178;

/** Extract route paths (e.g. "/en", "/zh/air-freight") from the sitemap. */
function routesFromSitemap() {
  const xml = readFileSync(join(ROOT, 'public', 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
  const paths = locs
    .filter((u) => u.startsWith(ORIGIN))
    .map((u) => u.slice(ORIGIN.length) || '/');
  return [...new Set(paths)];
}

async function main() {
  const routes = routesFromSitemap();
  console.log(`[prerender] ${routes.length} routes from sitemap`);

  // Serve dist/ with SPA fallback so unrendered routes still resolve.
  const { preview } = await import('vite');
  const server = await preview({
    root: ROOT,
    preview: { port: PORT, strictPort: true },
  });

  const puppeteer = (await import('puppeteer')).default;
  const launchOpts = {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };
  let browser;
  try {
    browser = await puppeteer.launch(launchOpts);
  } catch (err) {
    // Chromium not present (e.g. Vercel skipped puppeteer's postinstall on a
    // cached build). Install it on demand, then retry once.
    console.warn(`[prerender] Chromium missing — installing… (${err.message})`);
    const { execSync } = await import('node:child_process');
    execSync('npx --yes puppeteer browsers install chrome', { stdio: 'inherit' });
    browser = await puppeteer.launch(launchOpts);
  }

  let ok = 0;
  for (const route of routes) {
    const page = await browser.newPage();
    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });
      // Wait until the app has rendered AND helmet injected the canonical tag.
      await page.waitForSelector('link[rel="canonical"]', { timeout: 15000 });
      await page.waitForFunction(
        () => document.querySelector('#root')?.children.length > 0,
        { timeout: 15000 }
      );

      const html = '<!DOCTYPE html>\n' + (await page.content());
      const outFile = join(DIST, route, 'index.html');
      mkdirSync(dirname(outFile), { recursive: true });
      writeFileSync(outFile, html, 'utf8');
      ok++;
      console.log(`[prerender] ✓ ${route}`);
    } catch (err) {
      console.warn(`[prerender] ✗ ${route} — ${err.message} (SPA fallback kept)`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  await server.httpServer.close();
  console.log(`[prerender] done: ${ok}/${routes.length} pages snapshotted`);
}

main().catch((err) => {
  console.warn(`[prerender] skipped — ${err.message}`);
  console.warn('[prerender] deploy continues with standard SPA build.');
  process.exit(0);
});
