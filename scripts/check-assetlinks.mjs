#!/usr/bin/env node
// Guards /.well-known/assetlinks.json, the Digital Asset Links that let the Advanced Sudoku
// Android app verify its App Links against this domain. If this file disappears, stops being
// valid JSON or loses a package, the app silently falls back to the browser for every link.
//
// Usage: node scripts/check-assetlinks.mjs <site-dir> [--source <file>]
//   <site-dir>         directory that will be published (the file must be at .well-known/ inside it)
//   --source <file>    also require the published file to be byte-identical to this one
//
// Dependency-free on purpose: it runs before anything is installed and must never break
// because of a dependency update.

import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ASSETLINKS_PATH = '.well-known/assetlinks.json';

export const EXPECTED_PACKAGES = [
  'com.altcozygames.advancedsudoku',
  'com.altcozygames.advancedsudoku.timetravel',
];

const RELATION = 'delegate_permission/common.handle_all_urls';
const FINGERPRINT = /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/;

/**
 * Validates the structure of an assetlinks.json document.
 * Checks the shape, not fixed fingerprints, so adding a signing key stays a one-line change.
 * @param {string} text raw file content
 * @returns {string[]} problems found; empty when the file is valid
 */
export function validateAssetLinks(text) {
  let statements;
  try {
    statements = JSON.parse(text);
  } catch (error) {
    return [`not valid JSON: ${error.message}`];
  }
  if (!Array.isArray(statements) || statements.length === 0) {
    return ['must be a non-empty JSON array of statements'];
  }

  const errors = [];
  const packages = [];
  statements.forEach((statement, i) => {
    const where = `statement ${i}`;
    if (!Array.isArray(statement?.relation) || !statement.relation.includes(RELATION)) {
      errors.push(`${where}: relation must include "${RELATION}"`);
    }
    const target = statement?.target;
    if (target?.namespace !== 'android_app') {
      errors.push(`${where}: target.namespace must be "android_app"`);
    }
    if (typeof target?.package_name !== 'string') {
      errors.push(`${where}: target.package_name must be a string`);
    } else {
      packages.push(target.package_name);
    }
    const fingerprints = target?.sha256_cert_fingerprints;
    if (!Array.isArray(fingerprints) || fingerprints.length === 0) {
      errors.push(`${where}: sha256_cert_fingerprints must be a non-empty array`);
    } else {
      fingerprints
        .filter((fp) => typeof fp !== 'string' || !FINGERPRINT.test(fp))
        .forEach((fp) => errors.push(`${where}: malformed fingerprint ${JSON.stringify(fp)}`));
      if (new Set(fingerprints).size !== fingerprints.length) {
        errors.push(`${where}: duplicated fingerprint`);
      }
    }
  });

  const actual = [...packages].sort().join(', ');
  const expected = [...EXPECTED_PACKAGES].sort().join(', ');
  if (actual !== expected) {
    errors.push(`packages must be exactly [${expected}], found [${actual}]`);
  }
  return errors;
}

/**
 * Checks the file inside a site directory, optionally against its source.
 * @param {string} siteDir
 * @param {string} [sourceFile]
 * @returns {string[]} problems found
 */
export function checkSite(siteDir, sourceFile) {
  const file = join(siteDir, ASSETLINKS_PATH);
  let published;
  try {
    published = readFileSync(file);
  } catch {
    return [`missing ${file}`];
  }
  const errors = validateAssetLinks(published.toString('utf8'));
  if (sourceFile && !published.equals(readFileSync(sourceFile))) {
    errors.push(`${file} differs from its source ${sourceFile}`);
  }
  return errors;
}

function main(args) {
  const siteDir = args[0];
  const sourceIndex = args.indexOf('--source');
  const sourceFile = sourceIndex >= 0 ? args[sourceIndex + 1] : undefined;
  if (!siteDir || siteDir.startsWith('--') || (sourceIndex >= 0 && !sourceFile)) {
    console.error('Usage: node scripts/check-assetlinks.mjs <site-dir> [--source <file>]');
    return 2;
  }
  const errors = checkSite(siteDir, sourceFile);
  if (errors.length > 0) {
    console.error(`assetlinks check FAILED for ${join(siteDir, ASSETLINKS_PATH)}:`);
    errors.forEach((error) => console.error(`  - ${error}`));
    return 1;
  }
  console.log(`assetlinks check passed: ${join(siteDir, ASSETLINKS_PATH)}`);
  return 0;
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
