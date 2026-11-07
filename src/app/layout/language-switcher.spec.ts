import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { CURRENT_LOCALE } from '../core/i18n/locale';
import { LanguageSwitcher } from './language-switcher';

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
        provideRouter([{ path: '**', component: Host }]),
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
});
