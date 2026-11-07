import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService, Post } from '../../core/blog/blog.service';
import { TocEntry } from '../../core/blog/post';
import { CURRENT_LOCALE, LOCALE_INFO, localizedPath } from '../../core/i18n/locale';
import { Icon } from '../../shared/icon/icon';
import { PostBody } from './post-body';
import { PostMeta } from './post-meta';

@Component({
  selector: 'app-post-page',
  imports: [Icon, PostBody, PostMeta, RouterLink],
  templateUrl: './post-page.html',
  styleUrl: './post-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
})
export class PostPage {
  /** Resolved by the route (`resolvePost`). */
  readonly post = input.required<Post>();

  private readonly locale = inject(CURRENT_LOCALE);
  private readonly blog = inject(BlogService);

  protected readonly summary = computed(() => this.post().summary);
  protected readonly url = computed(() => `/blog/${this.summary().slug}`);

  /** The other languages the post is written in: plain links, as each language is its own build. */
  protected readonly translations = computed(() =>
    this.summary()
      .locales.filter((locale) => locale !== this.locale)
      .map((locale) => ({
        locale,
        name: LOCALE_INFO[locale].name,
        href: localizedPath(locale, this.url()),
      })),
  );

  /** The table of contents: `##` headings with their `###` ones, for posts with two or more. */
  protected readonly sections = computed(() => {
    const sections: { readonly entry: TocEntry; readonly children: TocEntry[] }[] = [];
    for (const entry of this.post().content.toc) {
      const last = sections.at(-1);
      if (entry.level === 3 && last) last.children.push(entry);
      else sections.push({ entry, children: [] });
    }
    return sections.length >= 2 ? sections : [];
  });

  protected readonly neighbors = computed(() => this.blog.neighbors(this.summary().slug));
}
