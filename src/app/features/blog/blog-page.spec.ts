import { LocationStrategy, TrailingSlashPathLocationStrategy } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PostSummary } from '../../core/blog/post';
import { postSummary, provideBlogContent } from '../../core/blog/testing';
import { CURRENT_LOCALE, Locale } from '../../core/i18n/locale';
import { BlogPage } from './blog-page';

describe('BlogPage', () => {
  function render(posts: Partial<Record<Locale, PostSummary[]>>) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: LocationStrategy, useClass: TrailingSlashPathLocationStrategy },
        { provide: CURRENT_LOCALE, useValue: 'en' },
        provideBlogContent(posts),
      ],
    });
    const fixture = TestBed.createComponent(BlogPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const texts = (root: HTMLElement, selector: string) =>
    Array.from(root.querySelectorAll(selector)).map((e) => e.textContent?.trim());

  it('lists the posts with links, descriptions and topics', () => {
    const root = render({
      en: [
        postSummary('second', { title: 'Second', tags: ['angular', 'ssg'] }),
        postSummary('first', { title: 'First' }),
      ],
    });

    expect(texts(root, '.posts h2')).toEqual(['Second', 'First']);
    expect(root.querySelector('.posts h2 a')?.getAttribute('href')).toBe('/blog/second/');
    expect(texts(root, '.description')).toEqual(['About second.', 'About first.']);
    expect(texts(root, '.chips li')).toEqual(['angular', 'ssg']);
    expect(root.querySelector('.lead')?.textContent).toContain('Notes on what I learn');
    expect(root.querySelector('.elsewhere')).toBeNull();
  });

  it('links untranslated posts to their language, marked up in that language', () => {
    const root = render({ 'pt-BR': [postSummary('so-pt', { title: 'Só em português' })] });
    const title = root.querySelector('.elsewhere h3')!;

    expect(root.querySelector('ol.posts')).toBeNull();
    expect(title.getAttribute('lang')).toBe('pt-BR');
    expect(title.querySelector('a')?.getAttribute('href')).toBe('/pt/blog/so-pt/');
    expect(title.querySelector('a')?.getAttribute('hreflang')).toBe('pt-BR');
    expect(texts(root, '.language')).toEqual(['Português']);
  });

  it('says posts are coming when there are none in any language', () => {
    const root = render({});

    expect(root.querySelector('.lead')?.textContent).toContain('Coming soon');
    expect(root.querySelector('.posts')).toBeNull();
  });
});
