import { LocationStrategy, TrailingSlashPathLocationStrategy } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { postSummary, provideBlogContent } from './core/blog/testing';

describe('App shell', () => {
  async function render(url: string) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: LocationStrategy, useClass: TrailingSlashPathLocationStrategy },
        provideBlogContent({ en: [postSummary('hello', { title: 'Hello' })] }),
      ],
    });
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl(url);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the header, the routed page and the footer', async () => {
    const root = await render('/');

    expect(root.querySelector('.brand')?.textContent).toBe('Bruno Gutierre');
    expect(root.querySelectorAll('header nav[aria-label="Main"] a')).toHaveLength(3);
    expect(root.querySelector('main h1')?.textContent).toBe('Bruno Gutierre');
    expect(root.querySelector('footer a[href^="mailto:"]')).not.toBeNull();
  });

  it.each([
    ['/projects', 'Projects'],
    ['/experience', 'Experience'],
    ['/blog', 'Blog'],
    ['/blog/hello', 'Hello'],
    ['/blog/no-such-post', 'Page not found'],
    ['/404', 'Page not found'],
    ['/does/not/exist', 'Page not found'],
  ])('routes %s to its page', async (url, heading) => {
    const root = await render(url);
    expect(root.querySelector('main h1')?.textContent).toBe(heading);
  });

  it('points the skip link at the current page and moves focus to the content', async () => {
    const root = await render('/projects');
    const skip = root.querySelector<HTMLAnchorElement>('.skip-link');
    const main = root.querySelector('main');

    expect(skip?.getAttribute('href')).toBe('/projects/#main');
    skip?.click();
    expect(document.activeElement).toBe(main);
  });
});
