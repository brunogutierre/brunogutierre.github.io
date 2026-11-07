import { TestBed } from '@angular/core/testing';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  afterEach(() => {
    delete document.documentElement.dataset['theme'];
    localStorage.clear();
  });

  it('reports its pressed state only once rendered in the browser, then toggles', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({ matches: false, addEventListener: () => undefined }),
    });
    const fixture = TestBed.createComponent(ThemeToggle);
    const button = (fixture.nativeElement as HTMLElement).querySelector('button');

    expect(button?.hasAttribute('aria-pressed')).toBe(false);
    await fixture.whenStable();
    expect(button?.getAttribute('aria-pressed')).toBe('false');
    expect(button?.textContent?.trim()).toBe('Dark theme');

    button?.click();
    await fixture.whenStable();
    expect(button?.getAttribute('aria-pressed')).toBe('true');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });
});
