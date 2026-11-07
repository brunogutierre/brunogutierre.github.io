#!/usr/bin/env node
// Completes the prerendered site for GitHub Pages (runs as the npm "postbuild" hook):
// - copies site-root/ into the site root: files that must exist once, at the domain root, such as
//   /.well-known/assetlinks.json (public/ would be copied into every language folder instead);
// - publishes the prerendered English 404 page as /404.html, the single file GitHub Pages serves
//   for every missing path, in every language folder.
//
// Usage: node scripts/postbuild.mjs <site-dir> [<root-files-dir>]

import { copyFileSync, cpSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function finalizeSite(siteDir, rootFilesDir = 'site-root') {
  cpSync(rootFilesDir, siteDir, { recursive: true });
  copyFileSync(join(siteDir, '404', 'index.html'), join(siteDir, '404.html'));
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const [siteDir, rootFilesDir] = process.argv.slice(2);
  if (!siteDir) {
    console.error('Usage: node scripts/postbuild.mjs <site-dir> [<root-files-dir>]');
    process.exitCode = 2;
  } else {
    finalizeSite(siteDir, rootFilesDir);
    console.log(`site finalized: ${siteDir} (root files and 404.html)`);
  }
}
