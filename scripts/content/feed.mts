// Atom 1.0 feed of each language's posts, full text included (posts are CC BY 4.0).
import type { Locale, Post } from './build-content.mts';

export const SITE_ORIGIN = 'https://brunogutierre.github.io';

interface FeedInfo {
  /** Folder of the language build: its `subPath` in angular.json. */
  readonly dir: string;
  /** Same text as `seo.blog.description` in src/locale. */
  readonly subtitle: string;
  readonly rights: string;
}

/**
 * The dist check follows every link of each built feed, so a wrong `dir` fails the build. The
 * texts are the only copy outside src/locale: feeds are not Angular pages.
 */
export const FEEDS: Readonly<Record<Locale, FeedInfo>> = {
  en: {
    dir: '',
    subtitle: 'Notes by Bruno Gutierre on lessons learned while building software.',
    rights: '© Bruno Gutierre. Posts licensed under CC BY 4.0',
  },
  'pt-BR': {
    dir: 'pt',
    subtitle: 'Notas de Bruno Gutierre sobre lições aprendidas construindo software.',
    rights: '© Bruno Gutierre. Posts licenciados sob CC BY 4.0',
  },
  fr: {
    dir: 'fr',
    subtitle: 'Notes de Bruno Gutierre sur les leçons tirées du développement de logiciels.',
    rights: '© Bruno Gutierre. Articles sous licence CC BY 4.0',
  },
};

const LICENSE = 'https://creativecommons.org/licenses/by/4.0/';

/** Site-relative path of a language's feed: `feed.xml`, `pt/feed.xml`… */
export const feedPath = (locale: Locale) =>
  [FEEDS[locale].dir, 'feed.xml'].filter(Boolean).join('/');

function escapeXml(text: string): string {
  return text.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c] ?? c,
  );
}

/** `2026-11-07` → `2026-11-07T00:00:00Z` (Atom wants full date-times). */
const instant = (date: string) => `${date}T00:00:00Z`;

/**
 * The feed of one language, newest first. `posts` are that language's posts. A feed with no
 * posts says it was updated now: Atom requires a date, and there is no better one.
 */
export function feed(locale: Locale, posts: readonly Post[], now = new Date()): string {
  const base = `${SITE_ORIGIN}/${FEEDS[locale].dir ? `${FEEDS[locale].dir}/` : ''}`;
  const latest = posts
    .map(({ frontmatter: f }) => f.updated ?? f.date)
    .sort()
    .at(-1);
  const updated = latest ? instant(latest) : `${now.toISOString().slice(0, 19)}Z`;
  const newestFirst = posts.toSorted(
    (a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date) || a.slug.localeCompare(b.slug),
  );

  const entries = newestFirst.map(({ slug, frontmatter, html }) => {
    const url = `${base}blog/${slug}/`;
    return `  <entry>
    <id>${url}</id>
    <title>${escapeXml(frontmatter.title)}</title>
    <link rel="alternate" type="text/html" href="${url}"/>
    <published>${instant(frontmatter.date)}</published>
    <updated>${instant(frontmatter.updated ?? frontmatter.date)}</updated>
    <summary>${escapeXml(frontmatter.description)}</summary>
${frontmatter.tags.map((tag) => `    <category term="${escapeXml(tag)}"/>\n`).join('')}    <content type="html" xml:base="${url}">${escapeXml(html)}</content>
  </entry>
`;
  });

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${locale}">
  <id>${base}blog/</id>
  <title>Bruno Gutierre · Blog</title>
  <subtitle>${escapeXml(FEEDS[locale].subtitle)}</subtitle>
  <link rel="self" type="application/atom+xml" href="${SITE_ORIGIN}/${feedPath(locale)}"/>
  <link rel="alternate" type="text/html" href="${base}blog/"/>
  <updated>${updated}</updated>
  <author>
    <name>Bruno Gutierre</name>
    <uri>${base}</uri>
  </author>
  <rights>${escapeXml(`${FEEDS[locale].rights}: ${LICENSE}`)}</rights>
${entries.join('')}</feed>
`;
}
