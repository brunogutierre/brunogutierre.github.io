import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { ContentError, indexPosts, readPosts, writeContent } from './build-content.mts';

let dir: string;
beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'blog-content-'));
});
afterEach(() => rm(dir, { recursive: true, force: true }));

async function write(path: string, text: string) {
  await mkdir(dirname(join(dir, path)), { recursive: true });
  await writeFile(join(dir, path), text);
}

const post = (title: string, date: string, extra = '') =>
  `---\ntitle: ${title}\ndescription: About ${title}.\ndate: ${date}\n${extra}---\nSome text.\n`;

describe('readPosts and indexPosts', () => {
  it('lists posts per language, newest first, with the languages each one exists in', async () => {
    await write('blog/older/en.md', post('Older', '2026-01-10'));
    await write('blog/older/fr.md', post('Plus ancien', '2026-01-10'));
    await write('blog/newer/en.md', post('Newer', '2026-02-01', 'tags: [angular]\n'));

    const index = indexPosts(await readPosts(join(dir, 'blog'), { drafts: false }));

    assert.deepEqual(
      index.en.map((p) => p.slug),
      ['newer', 'older'],
    );
    assert.deepEqual(index['pt-BR'], []);
    assert.deepEqual(index.fr[0], {
      slug: 'older',
      title: 'Plus ancien',
      description: 'About Plus ancien.',
      date: '2026-01-10',
      tags: [],
      readingMinutes: 1,
      locales: ['en', 'fr'],
      draft: false,
    });
  });

  it('keeps drafts only when asked, and leaves them out of the languages list', async () => {
    await write('blog/post/en.md', post('Post', '2026-01-10'));
    await write('blog/post/pt-BR.md', post('Post', '2026-01-10', 'draft: true\n'));

    const published = indexPosts(await readPosts(join(dir, 'blog'), { drafts: false }));
    const all = indexPosts(await readPosts(join(dir, 'blog'), { drafts: true }));

    assert.deepEqual(published.en[0].locales, ['en']);
    assert.equal(published['pt-BR'].length, 0);
    assert.deepEqual(all.en[0].locales, ['en', 'pt-BR']);
    assert.equal(all['pt-BR'][0].draft, true);
  });

  it('reports every problem at once, drafts included', async () => {
    await write('blog/Bad_Name/en.md', post('Bad', '2026-01-10'));
    await write('blog/notes.txt', 'loose file');
    await write('blog/post/de.md', post('Deutsch', '2026-01-10'));
    await write('blog/post/en.md', post('Draft', 'soon', 'draft: true\n'));
    await write('blog/empty/.gitkeep', '');

    await assert.rejects(readPosts(join(dir, 'blog'), { drafts: false }), (error: ContentError) => {
      assert.equal(error.problems.length, 5);
      for (const where of ['Bad_Name/', 'notes.txt', 'post/de.md', 'post/en.md', 'empty/']) {
        assert.ok(error.message.includes(where), where);
      }
      return true;
    });
  });

  it('treats a missing folder as no posts', async () => {
    assert.deepEqual(await readPosts(join(dir, 'nothing'), { drafts: true }), []);
  });
});

describe('writeContent', () => {
  it('writes an index with lazy loaders and one module per post, replacing old output', async () => {
    await write('blog/hello/en.md', post('Hello', '2026-01-10'));
    await write('out/posts/en/stale.ts', 'export default "old";');
    const posts = await readPosts(join(dir, 'blog'), { drafts: false });

    await writeContent(posts, join(dir, 'out'));

    const index = await readFile(join(dir, 'out/blog.ts'), 'utf8');
    assert.match(index, /export const POSTS: Readonly<Record<Locale, readonly PostSummary\[\]>>/);
    assert.match(
      index,
      /'hello': \(\) => import\('\.\/posts\/en\/hello'\)\.then\(\(m\) => m\.default\)/,
    );
    const body = await readFile(join(dir, 'out/posts/en/hello.ts'), 'utf8');
    assert.match(body, /export default "<p>Some text\.<\/p>\\n";/);
    await assert.rejects(readFile(join(dir, 'out/posts/en/stale.ts')));
  });
});
