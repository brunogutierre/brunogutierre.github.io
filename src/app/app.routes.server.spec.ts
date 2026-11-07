import { TestBed } from '@angular/core/testing';
import { ServerRoute } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';
import { postSummary, provideBlogContent } from './core/blog/testing';
import { CURRENT_LOCALE } from './core/i18n/locale';

describe('serverRoutes', () => {
  it('prerenders one page per post of the language being built', async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CURRENT_LOCALE, useValue: 'fr' },
        provideBlogContent({
          en: [postSummary('en-only')],
          fr: [postSummary('a'), postSummary('b')],
        }),
      ],
    });
    const posts = serverRoutes.find((route) => route.path === 'blog/:slug') as ServerRoute & {
      getPrerenderParams: () => Promise<Record<string, string>[]>;
    };

    const params = await TestBed.runInInjectionContext(() => posts.getPrerenderParams());

    expect(params).toEqual([{ slug: 'a' }, { slug: 'b' }]);
  });
});
