// Builds /sitemap.xml from the prerendered pages, so it always agrees with them: one <url> per
// canonical URL, with the page's language alternates and, for blog posts, the last update date.
// Pages marked noindex (the 404 page) are left out. Runs in postbuild.mjs.

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const LINK_TAG = /<link\b[^>]*>/gi;
const attr = (tag, name) => new RegExp(`\\s${name}="([^"]*)"`, 'i').exec(tag)?.[1];
const meta = (html, property) =>
  new RegExp(`<meta\\b[^>]*\\sproperty="${property}"[^>]*\\scontent="([^"]*)"`, 'i').exec(
    html,
  )?.[1];
const escapeXml = (text) =>
  text.replace(
    /[&<>"']/g,
    (c) => `&${{ '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', "'": 'apos' }[c]};`,
  );

function htmlFiles(dir, root = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path, root);
    return entry.name.endsWith('.html') ? [relative(root, path).split(sep).join('/')] : [];
  });
}

/** What the sitemap needs from one page, or null when it does not belong there. */
export function readPage(html) {
  if (/<meta\b[^>]*\sname="robots"[^>]*\scontent="[^"]*noindex/i.test(html)) return null;
  const links = [...html.matchAll(LINK_TAG)].map(([tag]) => tag);
  const canonical = links.find((tag) => attr(tag, 'rel') === 'canonical');
  if (!canonical) return null;
  return {
    loc: attr(canonical, 'href'),
    alternates: links
      .filter((tag) => attr(tag, 'rel') === 'alternate' && attr(tag, 'hreflang'))
      .map((tag) => ({ hreflang: attr(tag, 'hreflang'), href: attr(tag, 'href') })),
    lastmod: meta(html, 'article:modified_time') ?? meta(html, 'article:published_time'),
  };
}

export function buildSitemap(siteDir) {
  const pages = new Map();
  for (const file of htmlFiles(siteDir)) {
    const page = readPage(readFileSync(join(siteDir, file), 'utf8'));
    if (page) pages.set(page.loc, page);
  }
  const urls = [...pages.values()]
    .sort((a, b) => a.loc.localeCompare(b.loc))
    .map(({ loc, alternates, lastmod }) => {
      const lines = [`    <loc>${escapeXml(loc)}</loc>`];
      if (lastmod) lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
      for (const { hreflang, href } of alternates) {
        lines.push(
          `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}"/>`,
        );
      }
      return `  <url>\n${lines.join('\n')}\n  </url>\n`;
    });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('')}</urlset>
`;
}
