import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { tempDir } from './temp-dir.mjs';

import { finalizeSite } from './postbuild.mjs';

function setup() {
  const base = tempDir('postbuild-');
  const site = join(base, 'site');
  const root = join(base, 'site-root');
  mkdirSync(join(site, '404'), { recursive: true });
  writeFileSync(join(site, '404', 'index.html'), '<h1>Page not found</h1>');
  mkdirSync(join(root, '.well-known'), { recursive: true });
  writeFileSync(join(root, '.well-known', 'assetlinks.json'), '[]\n');
  return { site, root };
}

describe('finalizeSite', () => {
  it('copies root-only files, dot folders included, byte for byte', () => {
    const { site, root } = setup();
    finalizeSite(site, [root]);
    assert.equal(readFileSync(join(site, '.well-known', 'assetlinks.json'), 'utf8'), '[]\n');
  });

  it('copies generated files into their language folders', () => {
    const { site, root } = setup();
    const generated = join(root, '..', 'generated');
    mkdirSync(join(generated, 'pt'), { recursive: true });
    writeFileSync(join(generated, 'pt', 'feed.xml'), '<feed/>');

    finalizeSite(site, [root, generated]);

    assert.equal(readFileSync(join(site, 'pt', 'feed.xml'), 'utf8'), '<feed/>');
    assert.equal(readFileSync(join(site, '.well-known', 'assetlinks.json'), 'utf8'), '[]\n');
  });

  it('publishes the prerendered 404 page as /404.html', () => {
    const { site, root } = setup();
    finalizeSite(site, [root]);
    assert.equal(readFileSync(join(site, '404.html'), 'utf8'), '<h1>Page not found</h1>');
  });

  it('writes the sitemap', () => {
    const { site, root } = setup();
    finalizeSite(site, [root]);
    assert.match(readFileSync(join(site, 'sitemap.xml'), 'utf8'), /<urlset /);
  });

  it('fails loudly when the 404 page was not prerendered', () => {
    const { site, root } = setup();
    rmSync(join(site, '404'), { recursive: true });
    assert.throws(() => finalizeSite(site, [root]), /ENOENT/);
    assert.equal(existsSync(join(site, '404.html')), false);
  });
});
