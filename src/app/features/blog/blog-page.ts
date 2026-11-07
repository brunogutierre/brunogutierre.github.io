import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../core/blog/blog.service';
import { LOCALE_INFO, localizedPath } from '../../core/i18n/locale';
import { Icon } from '../../shared/icon/icon';
import { PostMeta } from './post-meta';

/**
 * The posts of the current language, then the posts not translated into it, which link to the
 * language they exist in (a full page load: each language is a separate build).
 */
@Component({
  selector: 'app-blog-page',
  imports: [Icon, PostMeta, RouterLink],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
})
export class BlogPage {
  private readonly blog = inject(BlogService);

  protected readonly posts = this.blog.posts;
  protected readonly elsewhere = this.blog.elsewhere.map((post) => ({
    ...post,
    href: localizedPath(post.locale, `/blog/${post.slug}`),
    language: LOCALE_INFO[post.locale].name,
  }));
  protected readonly empty = !this.posts.length && !this.elsewhere.length;
}
