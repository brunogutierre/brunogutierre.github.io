import { TestBed } from '@angular/core/testing';
import { CURRENT_LOCALE, Locale } from '../i18n/locale';
import { BlogService } from './blog.service';
import { PostSummary } from './post';
import { postSummary, provideBlogContent } from './testing';

describe('BlogService', () => {
  const newer = postSummary('newer', { date: '2026-03-01', locales: ['en', 'pt-BR'] });
  const middle = postSummary('middle', { date: '2026-02-01', locales: ['pt-BR'] });
  const older = postSummary('older', { date: '2026-01-01', locales: ['en', 'pt-BR'] });
  const frOnly = postSummary('fr-only', { date: '2026-02-15', locales: ['fr'] });

  function blog(locale: Locale, posts: Partial<Record<Locale, PostSummary[]>>) {
    TestBed.configureTestingModule({
      providers: [
        { provide: CURRENT_LOCALE, useValue: locale },
        provideBlogContent(posts, { 'pt-BR': { newer: { html: '<p>Novo</p>', toc: [] } } }),
      ],
    });
    return TestBed.inject(BlogService);
  }

  const all = { en: [newer, older], 'pt-BR': [newer, middle, older], fr: [frOnly] };

  it('lists the posts of the current language', () => {
    expect(blog('pt-BR', all).posts.map((p) => p.slug)).toEqual(['newer', 'middle', 'older']);
  });

  it('lists untranslated posts once, newest first, in the first language they exist in', () => {
    const elsewhere = blog('en', all).elsewhere;

    expect(elsewhere.map((p) => [p.slug, p.locale])).toEqual([
      ['fr-only', 'fr'],
      ['middle', 'pt-BR'],
    ]);
  });

  it('loads a post with its content, and nothing for a slug the language does not have', async () => {
    const service = blog('pt-BR', all);

    expect(await service.load('newer')).toEqual({
      summary: newer,
      content: { html: '<p>Novo</p>', toc: [] },
    });
    expect(await service.load('fr-only')).toBeUndefined();
    expect(await service.load('constructor')).toBeUndefined();
  });

  it('finds the newer and older neighbors of a post', () => {
    const service = blog('pt-BR', all);

    expect(service.neighbors('middle')).toEqual({ newer, older });
    expect(service.neighbors('newer')).toEqual({ newer: undefined, older: middle });
    expect(service.neighbors('missing')).toEqual({});
  });
});
