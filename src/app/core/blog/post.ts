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
