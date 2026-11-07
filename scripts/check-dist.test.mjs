import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

import { checkDist, expectedLang, servedFile, toSitePath } from './check-dist.mjs';

const page = (lang, base, body = '') =>
  `<!doctype html><html lang="${lang}" dir="ltr"><head><base href="${base}">` +
  `<link rel="stylesheet" href="styles.css"></head><body>${body}</body></html>`;

/** A minimal valid site: home and 404 in each locale, with a shared stylesheet per build. */
function site(overrides = {}) {
  const files = {
    'styles.css': '',
    'index.html': page('en', '/', '<a href="/pt/">PT</a><a href="/404/">x</a>'),
    '404/index.html': page('en', '/'),
    '404.html': page('en', '/'),
    'pt/styles.css': '',
    'pt/index.html': page('pt-BR', '/pt/', '<a href="https://brunogutierre.github.io/fr/">FR</a>'),
    'pt/404/index.html': page('pt-BR', '/pt/'),
    'fr/styles.css': '',
    'fr/index.html': page('fr', '/fr/', '<a href="mailto:a@b.c">m</a><a href="#main">s</a>'),
    'fr/404/index.html': page('fr', '/fr/'),
    ...overrides,
  };
  const dir = mkdtempSync(join(tmpdir(), 'dist-'));
  for (const [path, content] of Object.entries(files)) {
    if (content === null) continue;
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), content);
  }
  return dir;
}

describe('helpers', () => {
  it('maps top-level folders to locales', () => {
    assert.equal(expectedLang('index.html'), 'en');
    assert.equal(expectedLang('blog/post/index.html'), 'en');
    assert.equal(expectedLang('pt/blog/index.html'), 'pt-BR');
    assert.equal(expectedLang('fr/index.csr.html'), 'fr');
  });

  it('resolves references against the base href and ignores what this site does not serve', () => {
    assert.equal(toSitePath('main.js', '/pt/'), '/pt/main.js');
    assert.equal(toSitePath('/blog/?x=1#top', '/pt/'), '/blog/');
    assert.equal(toSitePath('https://brunogutierre.github.io/fr/', '/'), '/fr/');
    assert.equal(toSitePath('https://github.com/x', '/'), null);
    assert.equal(toSitePath('mailto:a@b.c', '/'), null);
    assert.equal(toSitePath('#main', '/'), null);
    assert.equal(toSitePath('/AdvancedSudoku/', '/'), null);
  });

  it('serves folders only with a trailing slash, like GitHub Pages without a redirect', () => {
    const dir = site();
    assert.ok(servedFile(dir, '/pt/'));
    assert.equal(servedFile(dir, '/pt'), undefined);
    assert.ok(servedFile(dir, '/pt/styles.css'));
  });
});

describe('checkDist', () => {
  it('passes a valid site', () => {
    assert.deepEqual(checkDist(site()), []);
  });

  it('reports a missing locale page', () => {
    assert.match(checkDist(site({ 'fr/404/index.html': null })).join(), /missing fr\/404/);
  });

  it('reports a missing root 404.html', () => {
    assert.match(checkDist(site({ '404.html': null })).join(), /missing 404.html/);
  });

  it('reports a wrong or missing lang', () => {
    const errors = checkDist(
      site({ 'pt/index.html': page('en', '/pt/'), 'fr/index.html': '<html><body></body></html>' }),
    );
    assert.ok(errors.some((e) => e.startsWith('pt/index.html: lang is "en"')));
    assert.ok(errors.some((e) => e.startsWith('fr/index.html: lang is undefined')));
  });

  it('reports meta refresh redirect stubs', () => {
    const stub = page('en', '/').replace('<head>', '<head><meta http-equiv="refresh" content="0">');
    assert.match(checkDist(site({ '404/index.html': stub })).join(), /meta refresh/);
  });

  it('reports broken links, hreflang URLs and assets once per page', () => {
    const body =
      '<a href="/missing/">a</a><a href="/missing/">again</a>' +
      '<link rel="alternate" hreflang="fr" href="https://brunogutierre.github.io/fr/gone/">' +
      '<script src="chunk-1.js"></script><a href="/pt">no slash</a>';
    const errors = checkDist(site({ 'index.html': page('en', '/', body) }));
    assert.deepEqual(errors, [
      'index.html: broken reference /missing/',
      'index.html: broken reference /fr/gone/',
      'index.html: broken reference /chunk-1.js',
      'index.html: broken reference /pt',
    ]);
  });

  it('reports a folder that would shadow /AdvancedSudoku/', () => {
    const errors = checkDist(site({ 'advancedsudoku/index.html': page('en', '/') }));
    assert.match(errors.join(), /advancedsudoku\/ would shadow/);
  });
});
