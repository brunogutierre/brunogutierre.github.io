import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import {
  ASSETLINKS_PATH,
  checkSite,
  EXPECTED_PACKAGES,
  validateAssetLinks,
} from './check-assetlinks.mjs';

const FP_A = Array(32).fill('AB').join(':');
const FP_B = Array(32).fill('0C').join(':');

const statement = (packageName, fingerprints = [FP_A]) => ({
  relation: ['delegate_permission/common.handle_all_urls'],
  target: {
    namespace: 'android_app',
    package_name: packageName,
    sha256_cert_fingerprints: fingerprints,
  },
});

const valid = () => EXPECTED_PACKAGES.map((name) => statement(name));

describe('validateAssetLinks', () => {
  it('accepts a file with exactly the expected packages', () => {
    assert.deepEqual(validateAssetLinks(JSON.stringify(valid())), []);
  });

  it('accepts several fingerprints per package', () => {
    const doc = [statement(EXPECTED_PACKAGES[0], [FP_A, FP_B]), statement(EXPECTED_PACKAGES[1])];
    assert.deepEqual(validateAssetLinks(JSON.stringify(doc)), []);
  });

  it('rejects invalid JSON and non-array documents', () => {
    assert.match(validateAssetLinks('{ nope')[0], /not valid JSON/);
    assert.match(validateAssetLinks('{}')[0], /non-empty JSON array/);
    assert.match(validateAssetLinks('[]')[0], /non-empty JSON array/);
  });

  it('rejects a missing or an extra package', () => {
    assert.match(
      validateAssetLinks(JSON.stringify(valid().slice(1))).join(),
      /packages must be exactly/,
    );
    const extra = [...valid(), statement('com.example.other')];
    assert.match(validateAssetLinks(JSON.stringify(extra)).join(), /packages must be exactly/);
  });

  it('rejects a wrong relation or namespace', () => {
    const doc = valid();
    doc[0].relation = ['delegate_permission/common.get_login_creds'];
    doc[1].target.namespace = 'web';
    const errors = validateAssetLinks(JSON.stringify(doc));
    assert.ok(errors.some((e) => e.includes('statement 0: relation')));
    assert.ok(errors.some((e) => e.includes('statement 1: target.namespace')));
  });

  it('rejects malformed, lowercase, empty or duplicated fingerprints', () => {
    const doc = valid();
    doc[0].target.sha256_cert_fingerprints = [FP_A.toLowerCase(), 'AB:CD'];
    doc[1].target.sha256_cert_fingerprints = [];
    assert.equal(validateAssetLinks(JSON.stringify(doc)).length, 3);
    doc[1].target.sha256_cert_fingerprints = [FP_B, FP_B];
    assert.ok(validateAssetLinks(JSON.stringify(doc)).some((e) => e.includes('duplicated')));
  });
});

describe('checkSite', () => {
  const site = (content) => {
    const dir = mkdtempSync(join(tmpdir(), 'assetlinks-'));
    if (content !== undefined) {
      mkdirSync(join(dir, '.well-known'));
      writeFileSync(join(dir, ASSETLINKS_PATH), content);
    }
    return dir;
  };

  it('reports a missing file', () => {
    assert.match(checkSite(site())[0], /missing/);
  });

  it('passes a valid file that matches its source byte for byte', () => {
    const content = JSON.stringify(valid(), null, 2);
    const dir = site(content);
    assert.deepEqual(checkSite(dir, join(dir, ASSETLINKS_PATH)), []);
  });

  it('fails when the published file differs from its source', () => {
    const dir = site(JSON.stringify(valid()));
    const source = join(dir, 'source.json');
    writeFileSync(source, JSON.stringify(valid(), null, 2));
    assert.match(checkSite(dir, source).join(), /differs from its source/);
  });
});
