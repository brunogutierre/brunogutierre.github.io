import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { CURRENT_LOCALE } from '../core/i18n/locale';
import { LanguageSwitcher, parentPath } from './language-switcher';

@Component({
  selector: 'app-host',
  imports: [LanguageSwitcher],
  template: '<app-language-switcher />',
})
class Host {}

describe('LanguageSwitcher', () => {
  const links = (root: HTMLElement) => Array.from(root.querySelectorAll('a'));

  async function render(url: string) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'missing', component: Host, data: { seo: { noindex: true } } },
          { path: 'blog/:slug', component: Host, data: { seo: { locales: ['en', 'fr'] } } },
          { path: '**', component: Host },
        ]),
        { provide: CURRENT_LOCALE, useValue: 'fr' },
      ],
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    return harness.routeNativeElement as HTMLElement;
  }

  it('links the current page in every language with trailing slashes', async () => {
    const root = await render('/blog?tag=angular#top');

    expect(links(root).map((a) => a.getAttribute('href'))).toEqual([
      '/blog/',
      '/pt/blog/',
      '/fr/blog/',
    ]);
    expect(links(root).map((a) => a.getAttribute('hreflang'))).toEqual(['en', 'pt-BR', 'fr']);
  });

  it('marks the current language and keeps the visible label in the accessible name', async () => {
    const root = await render('/');
    const [en, pt, fr] = links(root);

    expect(fr.getAttribute('aria-current')).toBe('true');
    expect(en.hasAttribute('aria-current')).toBe(false);
    expect(pt.textContent?.replace(/\s+/g, ' ').trim()).toBe('PT Português');
    expect(pt.getAttribute('lang')).toBe('pt-BR');
  });

  it('links each language home from a page that does not exist', async () => {
    const root = await render('/missing');

    expect(links(root).map((a) => a.getAttribute('href'))).toEqual(['/', '/pt/', '/fr/']);
  });

  it('links the blog index of a language a post is not translated into', async () => {
    const root = await render('/blog/a-post');

    expect(links(root).map((a) => a.getAttribute('href'))).toEqual([
      '/blog/a-post/',
      '/pt/blog/',
      '/fr/blog/a-post/',
    ]);
  });
});

describe('parentPath', () => {
  it('drops the last segment of a URL', () => {
    expect(parentPath('/blog/a-post')).toBe('/blog/');
    expect(parentPath('/blog/a-post/#intro')).toBe('/blog/');
    expect(parentPath('/blog')).toBe('/');
  });
});
