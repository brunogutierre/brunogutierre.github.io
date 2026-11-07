import type { Locale } from '../i18n/locale';

/**
 * A blog post as listed in the generated index (`src/generated/content/blog.ts`, written by
 * `npm run content` from `content/blog/<slug>/<locale>.md`).
 */
export interface PostSummary {
  /** The post folder name: the same in every language. */
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  /** `YYYY-MM-DD` */
  readonly date: string;
  /** `YYYY-MM-DD`, when the post changed after publication. */
  readonly updated?: string;
  readonly tags: readonly string[];
  readonly readingMinutes: number;
  /** Languages the post exists in, this one included: for links to its translations. */
  readonly locales: readonly Locale[];
  /** Only ever true in development builds; production builds leave drafts out. */
  readonly draft: boolean;
}

/** A `##` or `###` heading of a post, for its table of contents. */
export interface TocEntry {
  readonly level: 2 | 3;
  /** The heading id: its anchor in the page. */
  readonly id: string;
  readonly text: string;
}

/** A post's lazy chunk (`src/generated/content/posts/<locale>/<slug>.ts`). */
export interface PostContent {
  /**
   * Rendered at build time from the repository's Markdown, where raw HTML is escaped and
   * `javascript:` links are dropped: safe to insert as is.
   */
  readonly html: string;
  readonly toc: readonly TocEntry[];
}
