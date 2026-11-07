import {
  APP_BASE_HREF,
  LocationStrategy,
  TrailingSlashPathLocationStrategy,
} from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { PostBody } from './post-body';

describe('PostBody', () => {
  const HTML =
    '<h2 id="intro" tabindex="-1"><a class="header-anchor" href="#intro">Intro</a></h2>' +
    '<pre style="color:light-dark(#1f2328, #e6edf3)"><code>x</code></pre>' +
    '<p><a href="/projects/">Projects</a></p>' +
    '<div class="code-block"><div class="code-head"><span class="code-lang">ts</span></div>' +
    '<pre><code><span class="line">const a = 1;</span>\n<span class="line">a;</span></code></pre></div>';

  function render() {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: APP_BASE_HREF, useValue: '/pt/' },
        { provide: LocationStrategy, useClass: TrailingSlashPathLocationStrategy },
      ],
    });
    const fixture = TestBed.createComponent(PostBody);
    fixture.componentRef.setInput('html', HTML);
    fixture.componentRef.setInput('url', '/blog/hello');
    fixture.detectChanges();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    return { root: fixture.nativeElement as HTMLElement, navigate };
  }

  function click(element: Element, init: MouseEventInit = {}) {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, ...init });
    element.dispatchEvent(event);
    return event;
  }

  it('inserts the HTML as is, ids and code colors included', () => {
    const { root } = render();

    expect(root.querySelector('h2')?.id).toBe('intro');
    expect(root.querySelector('pre')?.getAttribute('style')).toContain('light-dark(');
  });

  it('points fragment links at the page, not the language home page', () => {
    const { root } = render();

    expect(root.querySelector('.header-anchor')?.getAttribute('href')).toBe(
      '/pt/blog/hello/#intro',
    );
    expect(root.querySelector('p a')?.getAttribute('href')).toBe('/projects/');
  });

  it('follows fragment links through the router', () => {
    const { root, navigate } = render();

    const event = click(
      root.querySelector('.header-anchor span') ?? root.querySelector('.header-anchor')!,
    );

    expect(event.defaultPrevented).toBe(true);
    expect(TestBed.inject(Router).serializeUrl(navigate.mock.calls[0][0] as never)).toBe(
      '/blog/hello#intro',
    );
  });

  it('leaves other links and modified clicks to the browser', () => {
    const { root, navigate } = render();

    expect(click(root.querySelector('p a')!).defaultPrevented).toBe(false);
    expect(click(root.querySelector('.header-anchor')!, { ctrlKey: true }).defaultPrevented).toBe(
      false,
    );
    expect(navigate).not.toHaveBeenCalled();
  });

  describe('copy buttons', () => {
    afterEach(() => Reflect.deleteProperty(navigator, 'clipboard'));

    function withClipboard(writeText: (text: string) => Promise<void>) {
      Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    }

    it('copies the code of its block and says so', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      withClipboard(writeText);
      const { root } = render();
      const button = root.querySelector<HTMLButtonElement>('.code-head button.copy')!;

      button.click();
      await Promise.resolve();

      expect(writeText).toHaveBeenCalledWith('const a = 1;\na;');
      expect(button.textContent).toBe('Copied');
      await vi.waitFor(() =>
        expect(root.querySelector('[role="status"]')?.textContent).toBe(
          'Code copied to the clipboard',
        ),
      );
    });

    it('says when the browser refuses to copy', async () => {
      withClipboard(() => Promise.reject(new Error('denied')));
      const { root } = render();

      root.querySelector<HTMLButtonElement>('button.copy')!.click();

      await vi.waitFor(() =>
        expect(root.querySelector('[role="status"]')?.textContent).toBe('Could not copy the code'),
      );
    });

    it('adds no button where the clipboard is unavailable', () => {
      const { root } = render();

      expect(root.querySelector('button.copy')).toBeNull();
    });
  });
});
