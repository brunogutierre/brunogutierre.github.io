import { inject } from '@angular/core';
import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { BlogService } from './core/blog/blog.service';

// Static site: every route is rendered to HTML at build time (outputMode "static").
export const serverRoutes: ServerRoute[] = [
  {
    // One page per post of the language being built; any other slug is GitHub Pages' 404.
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.None,
    getPrerenderParams: async () => inject(BlogService).posts.map(({ slug }) => ({ slug })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
