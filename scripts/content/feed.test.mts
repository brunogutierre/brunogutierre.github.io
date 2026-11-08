import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Post } from './build-content.mts';
import { feed, feedPath } from './feed.mts';

const post = (slug: string, date: string, extra: Partial<Post['frontmatter']> = {}): Post => ({
  slug,
  locale: 'pt-BR',
  frontmatter: {
    title: `Título ${slug}`,
    description: 'Sobre <isto>',
    date,
    tags: [],
    draft: false,
    ...extra,
  },
  html: '<h2 id="a"><a href="#a">A &amp; B</a></h2>',
  toc: [],
  readingMinutes: 1,
});

describe('feed', () => {
  it('lives at the root of each language folder', () => {
    assert.deepEqual(
      ['en', 'pt-BR', 'fr'].map((l) => feedPath(l as never)),
      ['feed.xml', 'pt/feed.xml', 'fr/feed.xml'],
    );
  });

  it('describes the language blog: links, language, author and license', () => {
    const xml = feed('pt-BR', [post('a', '2026-01-10')]);

    assert.match(
      xml,
      /^<\?xml version="1.0" encoding="utf-8"\?>\n<feed xmlns="http:\/\/www.w3.org\/2005\/Atom" xml:lang="pt-BR">/,
    );
    assert.match(xml, /<id>https:\/\/brunogutierre.github.io\/pt\/blog\/<\/id>/);
    assert.match(
      xml,
      /<link rel="self" type="application\/atom\+xml" href="https:\/\/brunogutierre.github.io\/pt\/feed.xml"\/>/,
    );
    assert.match(
      xml,
      /<rights>© Bruno Gutierre\. Posts licenciados sob CC BY 4\.0: https:\/\/creativecommons.org\/licenses\/by\/4.0\/<\/rights>/,
    );
  });

  it('lists posts newest first, full text escaped, links resolving to the post', () => {
    const xml = feed('pt-BR', [
      post('old', '2026-01-10', { updated: '2026-03-01', tags: ['angular'] }),
      post('new', '2026-02-01'),
    ]);

    assert.ok(
      xml.indexOf('<id>https://brunogutierre.github.io/pt/blog/new/</id>') <
        xml.indexOf('/pt/blog/old/</id>'),
    );
    assert.match(xml, /<updated>2026-03-01T00:00:00Z<\/updated>\n {2}<author>/);
    assert.match(
      xml,
      /<published>2026-01-10T00:00:00Z<\/published>\n {4}<updated>2026-03-01T00:00:00Z<\/updated>/,
    );
    assert.match(xml, /<summary>Sobre &lt;isto&gt;<\/summary>/);
    assert.match(xml, /<category term="angular"\/>/);
    assert.match(
      xml,
      /<content type="html" xml:base="https:\/\/brunogutierre.github.io\/pt\/blog\/old\/">&lt;h2 id=&quot;a&quot;&gt;&lt;a href=&quot;#a&quot;&gt;A &amp;amp; B/,
    );
  });

  it('is still a valid feed with no posts', () => {
    const xml = feed('en', [], new Date('2026-11-07T12:34:56.789Z'));

    assert.match(xml, /<updated>2026-11-07T12:34:56Z<\/updated>/);
    assert.doesNotMatch(xml, /<entry>/);
    assert.match(xml, /<id>https:\/\/brunogutierre.github.io\/blog\/<\/id>/);
  });
});
