import { Provider } from '@angular/core';
import { Locale, LOCALES } from '../i18n/locale';
import { BLOG_CONTENT, BlogContent } from './blog.service';
import { PostContent, PostSummary } from './post';

/** Test helpers: blog posts that do not depend on the Markdown in content/blog. */

export function postSummary(slug: string, overrides: Partial<PostSummary> = {}): PostSummary {
  return {
    slug,
    title: `Title of ${slug}`,
    description: `About ${slug}.`,
    date: '2026-01-15',
    tags: [],
    readingMinutes: 2,
    locales: ['en'],
    draft: false,
    ...overrides,
  };
}

/**
 * Provides `BLOG_CONTENT` with these posts (newest first, as generated). Each post's content is
 * `contents[locale][slug]`, or a paragraph with its title.
 */
export function provideBlogContent(
  posts: Partial<Record<Locale, readonly PostSummary[]>>,
  contents: Partial<Record<Locale, Record<string, PostContent>>> = {},
): Provider {
  const content: BlogContent = {
    posts: Object.fromEntries(LOCALES.map((l) => [l, posts[l] ?? []])) as BlogContent['posts'],
    bodies: Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        Object.fromEntries(
          (posts[locale] ?? []).map((post) => [
            post.slug,
            () =>
              Promise.resolve(
                contents[locale]?.[post.slug] ?? { html: `<p>${post.title}</p>`, toc: [] },
              ),
          ]),
        ),
      ]),
    ) as BlogContent['bodies'],
  };
  return { provide: BLOG_CONTENT, useValue: content };
}
