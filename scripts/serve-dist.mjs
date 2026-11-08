#!/usr/bin/env node
// Serves a built site the way GitHub Pages does, for the end-to-end tests:
// - a folder is served at its path with a trailing slash; without it, a 301 adds the slash;
// - a missing path gets /404.html with status 404.
//
// Usage: node scripts/serve-dist.mjs <site-dir> <port>

import { readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

const stat = (path) => {
  try {
    return statSync(path);
  } catch {
    return undefined;
  }
};

export function serveSite(siteDir) {
  return createServer((request, response) => {
    const path = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    let file = join(siteDir, normalize(path));
    if (stat(file)?.isDirectory()) {
      if (!path.endsWith('/')) {
        response.writeHead(301, { location: `${path}/` }).end();
        return;
      }
      file = join(file, 'index.html');
    }
    if (!file.startsWith(siteDir) || !stat(file)?.isFile()) {
      response.writeHead(404, { 'content-type': TYPES['.html'] });
      response.end(readFileSync(join(siteDir, '404.html')));
      return;
    }
    response.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    response.end(readFileSync(file));
  });
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const [siteDir, port] = process.argv.slice(2);
  if (!siteDir || !port) {
    console.error('Usage: node scripts/serve-dist.mjs <site-dir> <port>');
    process.exitCode = 2;
  } else {
    serveSite(resolve(siteDir)).listen(Number(port), '127.0.0.1', () => {
      console.log(`Serving ${siteDir} on http://127.0.0.1:${port}/`);
    });
  }
}
