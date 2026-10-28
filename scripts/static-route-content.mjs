// Visible initial HTML, using the same locale strings as the React pages.
// createRoot replaces this content when the interactive application mounts.
const escape = (value) => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));
const paragraph = value => `<p>${escape(value).replace(/&lt;1&gt;/g, '<strong>').replace(/&lt;\/1&gt;/g, '</strong>')}</p>`;

export function renderStaticBody(route, locale) {
  const [, lang, ...segments] = route.split('/');
  const page = segments.join('/');
  if (!['en', 'zh', 'fr', 'es'].includes(lang) || !['', 'air-freight'].includes(page)) return '';
  const link = (path, label) => `<a href="/${lang}${path}">${escape(label)}</a>`;
  const nav = `<nav aria-label="SaveShipCost">${[
    link('', locale.nav.home), link('/air-freight', locale.nav.airFreight),
    link('/sea-freight', locale.nav.seaFreight), link('/faq', locale.nav.faq),
  ].join(' · ')}</nav>`;
  let content;
  if (page === '') {
    const hero = locale.home.hero;
    content = `<h1>${[hero.titleLine1, hero.titleLine2, hero.titleHighlight].map(escape).join(' ')}</h1>${paragraph(hero.subtitle)}`;
    for (const [path, card] of [['/air-freight', hero.airCard], ['/sea-freight', hero.seaCard]]) {
      content += `<section><h2>${link(path, card.title)}</h2>${paragraph(card.subtitle)}</section>`;
    }
  } else {
    const air = locale.airFreight;
    content = `<h1>${escape(air.title)}</h1>${paragraph(air.subtitle)}<h2>${escape(air.seo.heading)}</h2>${paragraph(air.seo.intro)}`;
    for (const key of ['general', 'sensitive', 'urgent']) {
      const section = air.seo[key];
      content += `<section><h3>${escape(section.title)}</h3>${paragraph(section.body)}</section>`;
    }
  }
  return `<main data-static-route="${escape(route)}" style="max-width:1000px;margin:0 auto;padding:32px 24px;line-height:1.8">${nav}${content}</main>`;
}
