import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router, Routes } from '@angular/router';
import { BlogService, Post } from '../../core/blog/blog.service';
import { PageSeo, pageTitle } from '../../core/seo/seo.service';
import { BlogPage } from './blog-page';

/** Shows the 404 page, keeping the requested URL in the address bar: a slug with no post. */
function notFound(url: string): RedirectCommand {
  const router = inject(Router);
  return new RedirectCommand(router.parseUrl('/404'), { browserUrl: url });
}

/** The post with its content: the lazy chunk loads before the page renders, so it prerenders. */
export const resolvePost: ResolveFn<Post> = async (route, state) => {
  const blog = inject(BlogService);
  const missing = notFound(state.url); // inject() is only available before the first await
  return (await blog.load(route.paramMap.get('slug') ?? '')) ?? missing;
};

/** Page metadata of a post: its own title and description, and only its languages. */
export const resolvePostSeo: ResolveFn<PageSeo> = (route, state) => {
  const post = inject(BlogService).find(route.paramMap.get('slug') ?? '');
  if (!post) return notFound(state.url);
  return { title: pageTitle(post.title), description: post.description, locales: post.locales };
};

export default [
  {
    path: '',
    component: BlogPage,
    data: {
      seo: {
        title: pageTitle($localize`:@@nav.blog:Blog`),
        description: $localize`:@@seo.blog.description:Notes by Bruno Gutierre on lessons learned while building software.`,
      } satisfies PageSeo,
    },
  },
  {
    path: ':slug',
    loadComponent: () => import('./post-page').then((m) => m.PostPage),
    resolve: { seo: resolvePostSeo, post: resolvePost },
  },
] satisfies Routes;
