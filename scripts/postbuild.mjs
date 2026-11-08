#!/usr/bin/env node
// Completes the prerendered site for GitHub Pages (runs as the npm "postbuild" hook):
// - copies site-root/ into the site root: files that must exist once, at the domain root, such as
//   /.well-known/assetlinks.json (public/ would be copied into every language folder instead);
// - copies src/generated/site/ (written by npm run content) the same way: each language's feed;
// - publishes the prerendered English 404 page as /404.html, the single file GitHub Pages serves
//   for every missing path, in every language folder.
//
// Usage: node scripts/postbuild.mjs <site-dir> [<files-dir>...]

import { copyFileSync, cpSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const FILES_DIRS = ['site-root', 'src/generated/site'];

/** @param {string[]} filesDirs folders copied as they are into the site root */
export function finalizeSite(siteDir, filesDirs = FILES_DIRS) {
  for (const dir of filesDirs) cpSync(dir, siteDir, { recursive: true });
  copyFileSync(join(siteDir, '404', 'index.html'), join(siteDir, '404.html'));
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const [siteDir, ...filesDirs] = process.argv.slice(2);
  if (!siteDir) {
    console.error('Usage: node scripts/postbuild.mjs <site-dir> [<files-dir>...]');
    process.exitCode = 2;
  } else {
    finalizeSite(siteDir, filesDirs.length ? filesDirs : FILES_DIRS);
    console.log(`site finalized: ${siteDir} (root files, feeds and 404.html)`);
  }
}
