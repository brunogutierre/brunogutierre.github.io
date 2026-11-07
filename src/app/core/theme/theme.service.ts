import { DOCUMENT, inject, Injectable, signal } from '@angular/core';

/** Shared origin with /AdvancedSudoku/: every storage key of this site is prefixed. */
export const THEME_STORAGE_KEY = 'bgsite:v1:theme';

type Theme = 'light' | 'dark';

/**
 * Light and dark themes on top of the system preference. Colors live in CSS (light-dark());
 * this service only pins `data-theme` on <html> and remembers the choice. The inline script in
 * index.html applies the same stored value before first paint.
 *
 * Browser only: prerendered HTML carries no theme state, so `init()` runs after the first render.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly dark = signal<boolean | null>(null);
  private media?: MediaQueryList;

  /** Whether the dark theme is showing; null until `init()` runs in the browser. */
  readonly isDark = this.dark.asReadonly();

  init(): void {
    const view = this.document.defaultView;
    if (this.media || !view?.matchMedia) {
      return;
    }
    this.media = view.matchMedia('(prefers-color-scheme: dark)');
    this.dark.set(this.pinned() ? this.pinned() === 'dark' : this.media.matches);
    this.media.addEventListener('change', (event) => {
      if (!this.pinned()) {
        this.dark.set(event.matches);
      }
    });
  }

  /**
   * Switches to the other theme. When it matches the system preference the choice is forgotten,
   * so the site follows the system again; otherwise it is pinned and stored.
   */
  toggle(): void {
    this.init();
    const dark = !this.dark();
    const root = this.document.documentElement;
    if (dark === (this.media?.matches ?? false)) {
      delete root.dataset['theme'];
      this.store(null);
    } else {
      const theme: Theme = dark ? 'dark' : 'light';
      root.dataset['theme'] = theme;
      this.store(theme);
    }
    this.dark.set(dark);
  }

  private pinned(): Theme | undefined {
    const theme = this.document.documentElement.dataset['theme'];
    return theme === 'light' || theme === 'dark' ? theme : undefined;
  }

  private store(theme: Theme | null): void {
    try {
      const storage = this.document.defaultView?.localStorage;
      if (theme) {
        storage?.setItem(THEME_STORAGE_KEY, theme);
      } else {
        storage?.removeItem(THEME_STORAGE_KEY);
      }
    } catch {
      // Storage can be disabled (privacy modes); the theme still applies to this page.
    }
  }
}
