import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

import { tempDir } from './temp-dir.mjs';

import { buildSitemap, readPage } from './sitemap.mjs';

const ORIGIN = 'https://brunogutierre.github.io';
const head = (path, extra = '') =>
  `<html><head><link rel="canonical" href="${ORIGIN}${path}">` +
  `<link rel="alternate" hreflang="en" href="${ORIGIN}${path}">` +
  `<link rel="alternate" hreflang="x-default" href="${ORIGIN}${path}">` +
  `<link rel="alternate" type="application/atom+xml" href="feed.xml">${extra}</head></html>`;

describe('readPage', () => {
  it('reads the canonical URL, the language alternates and the post dates', () => {
    const page = readPage(
      head(
        '/blog/a/',
        '<meta property="article:published_time" content="2026-01-10">' +
          '<meta property="article:modified_time" content="2026-02-01">',
      ),
    );

    assert.equal(page.loc, `${ORIGIN}/blog/a/`);
    assert.deepEqual(
      page.alternates.map((a) => a.hreflang),
      ['en', 'x-default'],
    );
    assert.equal(page.lastmod, '2026-02-01');
    assert.equal(
      readPage(head('/b/', '<meta property="article:published_time" content="2026-01-10">'))
        .lastmod,
      '2026-01-10',
    );
  });

  it('leaves out noindex pages and pages without a canonical URL', () => {
    assert.equal(readPage(`${head('/404/')}<meta name="robots" content="noindex">`), null);
    assert.equal(readPage('<html><head></head></html>'), null);
  });
});

describe('buildSitemap', () => {
  it('lists each canonical URL once, sorted, with its alternates', () => {
    const dir = tempDir('sitemap-');
    const files = {
      'index.html': head('/'),
      'pt/index.html': head('/pt/'),
      'blog/index.html': head('/blog/'),
      '404.html': '<meta name="robots" content="noindex">',
    };
    for (const [path, html] of Object.entries(files)) {
      mkdirSync(dirname(join(dir, path)), { recursive: true });
      writeFileSync(join(dir, path), html);
    }

    const xml = buildSitemap(dir);

    assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset /);
    assert.deepEqual(
      [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]),
      [`${ORIGIN}/`, `${ORIGIN}/blog/`, `${ORIGIN}/pt/`],
    );
    assert.match(
      xml,
      /<xhtml:link rel="alternate" hreflang="x-default" href="https:\/\/brunogutierre.github.io\/pt\/"\/>/,
    );
  });
});
