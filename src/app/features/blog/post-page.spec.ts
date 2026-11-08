import { LocationStrategy, TrailingSlashPathLocationStrategy } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Post } from '../../core/blog/blog.service';
import { TocEntry } from '../../core/blog/post';
import { postSummary, provideBlogContent } from '../../core/blog/testing';
import { CURRENT_LOCALE } from '../../core/i18n/locale';
import { PostPage } from './post-page';

describe('PostPage', () => {
  const newer = postSummary('newer', { title: 'Mais novo' });
  const older = postSummary('older', { title: 'Mais antigo' });

  function render(post: Post) {
    TestBed.configureTestingModule({
      providers: [
        provideBlogContent({ 'pt-BR': [newer, post.summary, older] }),
        provideRouter([]),
        { provide: LocationStrategy, useClass: TrailingSlashPathLocationStrategy },
        { provide: CURRENT_LOCALE, useValue: 'pt-BR' },
      ],
    });
    const fixture = TestBed.createComponent(PostPage);
    fixture.componentRef.setInput('post', post);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const post = (overrides = {}, toc: TocEntry[] = []): Post => ({
    summary: postSummary('ola', { title: 'Olá', tags: ['angular'], ...overrides }),
    content: { html: '<p>Corpo</p>', toc },
  });
  const heading = (level: 2 | 3, id: string): TocEntry => ({ level, id, text: id.toUpperCase() });

  it('shows the title, description, metadata, topics and body', () => {
    const root = render(post({ locales: ['pt-BR'] }));

    expect(root.querySelector('h1')?.textContent).toBe('Olá');
    expect(root.querySelector('.lead')?.textContent).toBe('About ola.');
    expect(root.querySelector('app-post-meta time')).not.toBeNull();
    expect(root.querySelector('.chips li')?.textContent).toBe('angular');
    expect(root.querySelector('app-post-body .prose')?.textContent).toBe('Corpo');
    expect(root.querySelector('.back')?.getAttribute('href')).toBe('/blog/');
    expect(root.querySelector('.translations')).toBeNull();
    expect(root.querySelector('.license a[rel="license"]')?.getAttribute('href')).toBe(
      'https://creativecommons.org/licenses/by/4.0/',
    );
  });

  it('links the other languages the post is written in', () => {
    const root = render(post({ locales: ['en', 'pt-BR', 'fr'] }));
    const links = Array.from(root.querySelectorAll('.translations a'));

    expect(
      links.map((a) => [a.textContent, a.getAttribute('href'), a.getAttribute('lang')]),
    ).toEqual([
      ['English', '/blog/ola/', 'en'],
      ['Français', '/fr/blog/ola/', 'fr'],
    ]);
  });

  it('lists the sections, each with its subsections, linking to their headings', () => {
    const root = render(
      post({}, [heading(2, 'a'), heading(3, 'a1'), heading(3, 'a2'), heading(2, 'b')]),
    );
    const toc = root.querySelector('nav.toc')!;

    expect(toc.getAttribute('aria-labelledby')).toBe('_toc');
    expect(Array.from(toc.querySelectorAll(':scope > ol > li > a'), (a) => a.textContent)).toEqual([
      'A',
      'B',
    ]);
    // the page's own URL in the app; the component is not routed here
    expect(
      Array.from(toc.querySelectorAll('li li a'), (a) => a.getAttribute('href')?.split('#')[1]),
    ).toEqual(['a1', 'a2']);
  });

  it('leaves the table of contents out of a post with a single section', () => {
    const root = render(post({}, [heading(2, 'a'), heading(3, 'a1')]));

    expect(root.querySelector('nav.toc')).toBeNull();
  });

  it('links the older and the newer post', () => {
    const root = render(post());
    const links = Array.from(root.querySelectorAll('.neighbors a'));

    expect(
      links.map((a) => [
        a.className,
        a.getAttribute('href'),
        a.querySelector('.title')?.textContent,
      ]),
    ).toEqual([
      ['older', '/blog/older/', 'Mais antigo'],
      ['newer', '/blog/newer/', 'Mais novo'],
    ]);
  });
});
