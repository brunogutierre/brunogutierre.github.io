import { inject, Injectable, InjectionToken } from '@angular/core';
import { POST_BODIES, POSTS } from '../../../generated/content/blog';
import { CURRENT_LOCALE, Locale, LOCALES } from '../i18n/locale';
import { PostContent, PostSummary } from './post';

/** The posts of every language and their lazy content, as `npm run content` generates them. */
export interface BlogContent {
  readonly posts: Readonly<Record<Locale, readonly PostSummary[]>>;
  readonly bodies: Readonly<Record<Locale, Readonly<Record<string, () => Promise<PostContent>>>>>;
}

/** The generated blog content. Tests provide their own posts instead (see `testing.ts`). */
export const BLOG_CONTENT = new InjectionToken<BlogContent>('BLOG_CONTENT', {
  providedIn: 'root',
  factory: () => ({ posts: POSTS, bodies: POST_BODIES }),
});

/** A post with no version in the current language, in the language it is listed in. */
export interface ForeignPost extends PostSummary {
  readonly locale: Locale;
}

export interface Post {
  readonly summary: PostSummary;
  readonly content: PostContent;
}

/** The blog of the current language. */
@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly content = inject(BLOG_CONTENT);
  private readonly locale = inject(CURRENT_LOCALE);

  /** Posts in the current language, newest first. */
  readonly posts: readonly PostSummary[] = this.content.posts[this.locale];

  /**
   * Posts not translated into the current language, newest first. Each one is listed in the
   * first language it exists in, in `LOCALES` order: English when there is an English version.
   */
  readonly elsewhere: readonly ForeignPost[] = this.untranslated();

  find(slug: string): PostSummary | undefined {
    return this.posts.find((post) => post.slug === slug);
  }

  /** The post and its content, or undefined when the current language has no such post. */
  async load(slug: string): Promise<Post | undefined> {
    const summary = this.find(slug);
    const bodies = this.content.bodies[this.locale];
    if (!summary || !Object.hasOwn(bodies, slug)) return undefined;
    return { summary, content: await bodies[slug]() };
  }

  /** The posts on either side of a post in the list. */
  neighbors(slug: string): { readonly newer?: PostSummary; readonly older?: PostSummary } {
    const index = this.posts.findIndex((post) => post.slug === slug);
    return index < 0 ? {} : { newer: this.posts[index - 1], older: this.posts[index + 1] };
  }

  private untranslated(): ForeignPost[] {
    const listed = new Set(this.posts.map((post) => post.slug));
    const foreign: ForeignPost[] = [];
    for (const locale of LOCALES.filter((l) => l !== this.locale)) {
      for (const post of this.content.posts[locale]) {
        if (listed.has(post.slug)) continue;
        listed.add(post.slug);
        foreign.push({ ...post, locale });
      }
    }
    return foreign.sort((a, b) => b.date.localeCompare(a.date));
  }
}
