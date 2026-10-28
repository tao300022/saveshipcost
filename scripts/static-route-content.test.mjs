import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderStaticBody } from './static-route-content.mjs';

for (const lang of ['en', 'zh', 'fr', 'es']) {
  const locale = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${lang}/common.json`, import.meta.url)));
  for (const path of ['', '/air-freight']) {
    test(`${lang}${path}: visible body and localized crawlable links survive without JS`, () => {
      const route = `/${lang}${path}`;
      const html = renderStaticBody(route, locale);
      const built = readFileSync(new URL(`../dist${route}/index.html`, import.meta.url), 'utf8');
      assert.ok(built.includes(`<div id="root">${html}</div>`));
      assert.equal((html.match(/<h1>/g) || []).length, 1);
      assert.ok(!/<noscript|hidden|display:none/.test(html));
      for (const target of ['', '/air-freight', '/sea-freight', '/faq']) assert.ok(html.includes(`href="/${lang}${target}"`));
      assert.ok(built.includes(`href="https://www.saveshipcost.com${route}"`));
      assert.ok(!/noindex/i.test(built));
      assert.ok(built.includes('type="module"')); // interactive client still loads
    });
  }
  test(`${lang}: private and out-of-scope routes do not receive public content`, () => {
    for (const path of ['login', 'admin', 'corrections', 'faq', 'sea-freight']) assert.equal(renderStaticBody(`/${lang}/${path}`, locale), '');
  });
}

test('locale text is escaped rather than executed as HTML', () => {
  const locale = JSON.parse(readFileSync(new URL('../src/i18n/locales/en/common.json', import.meta.url)));
  locale.airFreight.seo.intro = '<script>alert(1)</script> <1>safe emphasis</1> & text';
  const html = renderStaticBody('/en/air-freight', locale);
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('<strong>safe emphasis</strong> &amp; text'));
});
