import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parsePost } from './frontmatter.mts';

const post = (yaml: string, body = '\nHello.\n') => `---\n${yaml}\n---${body}`;
const minimal = 'title: A post\ndescription: What it says.\ndate: 2026-11-07';

describe('parsePost', () => {
  it('splits the frontmatter from the body and fills defaults', () => {
    const { frontmatter, body } = parsePost(post(minimal));

    assert.deepEqual(frontmatter, {
      title: 'A post',
      description: 'What it says.',
      date: '2026-11-07',
      tags: [],
      draft: false,
    });
    assert.equal(body, 'Hello.\n');
  });

  it('reads every field', () => {
    const yaml = `${minimal}\nupdated: 2026-12-01\ntags: [angular, ssg]\ndraft: true`;
    const { frontmatter } = parsePost(post(yaml));

    assert.equal(frontmatter.updated, '2026-12-01');
    assert.deepEqual(frontmatter.tags, ['angular', 'ssg']);
    assert.equal(frontmatter.draft, true);
  });

  it('accepts Windows line endings and a byte order mark', () => {
    const source = `\uFEFF${post(minimal)}`.replaceAll('\n', '\r\n');

    assert.equal(parsePost(source).frontmatter.title, 'A post');
  });

  it('requires frontmatter at the top of the file', () => {
    assert.throws(() => parsePost('# Title\n'), /Missing frontmatter/);
    assert.throws(() => parsePost(`\n${post(minimal)}`), /Missing frontmatter/);
  });

  it('lists every problem at once, with the field it belongs to', () => {
    const yaml = 'title: ""\ndate: 2026-02-30\ntags: [Angular]\nauthor: me';

    assert.throws(
      () => parsePost(post(yaml)),
      (error: Error) =>
        ['title', 'description', 'date', 'tags[0]', 'Unrecognized key: "author"'].every((part) =>
          error.message.includes(part),
        ),
    );
  });

  it('rejects an update dated before the post', () => {
    assert.throws(() => parsePost(post(`${minimal}\nupdated: 2026-11-06`)), /updated/);
  });
});
