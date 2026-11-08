#!/usr/bin/env node
// Checks the prerendered site before it is published:
// - every locale has its home and 404 pages, and every HTML file declares the right lang;
// - no file is a meta-refresh redirect stub (a known regression of i18n + prerendering);
// - every internal reference (links, canonical/hreflang URLs, scripts, styles, images, the link
//   preview image) resolves to a file GitHub Pages will serve, so a missing translation or chunk
//   cannot ship;
// - nothing shadows /AdvancedSudoku/, which another repository publishes on this domain.
//
// Usage: node scripts/check-dist.mjs <site-dir>

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SITE_ORIGIN = 'https://brunogutierre.github.io';

/** Top-level folder of each locale build (subPath in angular.json) and its lang. */
export const LOCALE_DIRS = { '': 'en', pt: 'pt-BR', fr: 'fr' };

/** Paths on this domain published by other repositories. */
export const FOREIGN_PATHS = ['/AdvancedSudoku/'];

const REFERENCE_TAG = /<(?:a|link|script|img|source)\b[^>]*>/gi;
const REFERENCE_ATTR = /\s(?:href|src)="([^"]*)"/gi;
const META_TAG = /<meta\b[^>]*>/gi;

/** Lang expected for an HTML file, from its path relative to the site root. */
export function expectedLang(relativePath) {
  const top = relativePath.split('/')[0];
  return LOCALE_DIRS[top] ?? LOCALE_DIRS[''];
}

/**
 * Resolves a reference found in a page to a site path, or returns null when it is not served
 * by this site (other origins, mailto:, fragments, foreign paths).
 * @param {string} reference value of href/src
 * @param {string} baseHref the page's <base href> (site-absolute)
 */
export function toSitePath(reference, baseHref) {
  if (
    reference === '' ||
    reference.startsWith('#') ||
    /^(mailto|tel|data|javascript):/i.test(reference)
  ) {
    return null;
  }
  const url = new URL(reference, SITE_ORIGIN + baseHref);
  if (url.origin !== SITE_ORIGIN) {
    return null;
  }
  const path = decodeURIComponent(url.pathname);
  return FOREIGN_PATHS.some((foreign) => path.startsWith(foreign)) ? null : path;
}

/** File GitHub Pages serves for a site path without redirecting, if any. */
export function servedFile(siteDir, sitePath) {
  const candidates = sitePath.endsWith('/') ? [`${sitePath}index.html`] : [sitePath];
  return candidates.map((path) => join(siteDir, path)).find((file) => isFile(file));
}

function isFile(file) {
  try {
    return statSync(file).isFile();
  } catch {
    return false;
  }
}

function htmlFiles(dir, root = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path, root);
    return entry.name.endsWith('.html') ? [relative(root, path).split(sep).join('/')] : [];
  });
}

/** @returns {string[]} problems found; empty when the site is valid */
export function checkDist(siteDir) {
  const errors = [];
  for (const [dir, lang] of Object.entries(LOCALE_DIRS)) {
    for (const page of ['index.html', '404/index.html']) {
      if (!isFile(join(siteDir, dir, page)))
        errors.push(`missing ${posix.join(dir, page)} (${lang})`);
    }
  }
  // GitHub Pages serves this single file for every missing path (see postbuild.mjs).
  if (!isFile(join(siteDir, '404.html'))) errors.push('missing 404.html at the site root');
  const shadowing = readdirSync(siteDir).filter((name) =>
    FOREIGN_PATHS.some((foreign) => foreign.slice(1, -1).toLowerCase() === name.toLowerCase()),
  );
  shadowing.forEach((name) =>
    errors.push(`${name}/ would shadow a path another repository publishes`),
  );

  for (const file of htmlFiles(siteDir)) {
    const html = readFileSync(join(siteDir, file), 'utf8');
    const lang = /<html\b[^>]*\slang="([^"]*)"/i.exec(html)?.[1];
    if (lang !== expectedLang(file)) {
      errors.push(`${file}: lang is ${JSON.stringify(lang)}, expected "${expectedLang(file)}"`);
    }
    if (/<meta\b[^>]*http-equiv="refresh"/i.test(html)) {
      errors.push(`${file}: meta refresh redirect stub`);
    }
    const baseHref = /<base\b[^>]*\shref="([^"]*)"/i.exec(html)?.[1] ?? `/${posix.dirname(file)}/`;
    const missing = new Set();
    const references = [];
    for (const [tag] of html.matchAll(REFERENCE_TAG)) {
      for (const [, reference] of tag.matchAll(REFERENCE_ATTR)) references.push(reference);
    }
    for (const [tag] of html.matchAll(META_TAG)) {
      const image = /\sproperty="og:image"/.test(tag) && /\scontent="([^"]*)"/.exec(tag);
      if (image) references.push(image[1]);
    }
    for (const reference of references) {
      const sitePath = toSitePath(reference, baseHref);
      if (sitePath && !servedFile(siteDir, sitePath)) missing.add(sitePath);
    }
    missing.forEach((path) => errors.push(`${file}: broken reference ${path}`));
  }
  return errors;
}

function main(args) {
  const siteDir = args[0];
  if (!siteDir) {
    console.error('Usage: node scripts/check-dist.mjs <site-dir>');
    return 2;
  }
  const errors = checkDist(siteDir);
  if (errors.length > 0) {
    console.error(`dist check FAILED for ${siteDir} (${errors.length} problems):`);
    errors.slice(0, 50).forEach((error) => console.error(`  - ${error}`));
    return 1;
  }
  console.log(`dist check passed: ${htmlFiles(siteDir).length} HTML files in ${siteDir}`);
  return 0;
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
