import { RenderMode, ServerRoute } from '@angular/ssr';

// Static site: every route is rendered to HTML at build time (outputMode "static").
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Prerender }];
