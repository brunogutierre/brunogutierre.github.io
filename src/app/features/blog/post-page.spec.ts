import { LocationStrategy, TrailingSlashPathLocationStrategy } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Post } from '../../core/blog/blog.service';
import { postSummary } from '../../core/blog/testing';
import { CURRENT_LOCALE } from '../../core/i18n/locale';
import { PostPage } from './post-page';

describe('PostPage', () => {
  function render(post: Post) {
    TestBed.configureTestingModule({
      providers: [
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

  const post = (overrides = {}): Post => ({
    summary: postSummary('ola', { title: 'Olá', tags: ['angular'], ...overrides }),
    content: { html: '<p>Corpo</p>', toc: [] },
  });

  it('shows the title, description, metadata, topics and body', () => {
    const root = render(post({ locales: ['pt-BR'] }));

    expect(root.querySelector('h1')?.textContent).toBe('Olá');
    expect(root.querySelector('.lead')?.textContent).toBe('About ola.');
    expect(root.querySelector('app-post-meta time')).not.toBeNull();
    expect(root.querySelector('.chips li')?.textContent).toBe('angular');
    expect(root.querySelector('app-post-body')?.textContent).toBe('Corpo');
    expect(root.querySelector('.back')?.getAttribute('href')).toBe('/blog/');
    expect(root.querySelector('.translations')).toBeNull();
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
});
