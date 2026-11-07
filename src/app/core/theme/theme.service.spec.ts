import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

/** jsdom has no matchMedia: a controllable stand-in for the system color scheme. */
function systemPrefersDark(matches: boolean) {
  const listeners: ((event: { matches: boolean }) => void)[] = [];
  const media = {
    matches,
    addEventListener: (_: string, listener: (event: { matches: boolean }) => void) =>
      listeners.push(listener),
  };
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => media });
  return (dark: boolean) => {
    media.matches = dark;
    listeners.forEach((listener) => listener({ matches: dark }));
  };
}

describe('ThemeService', () => {
  const root = document.documentElement;
  let theme: ThemeService;

  beforeEach(() => {
    theme = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    delete root.dataset['theme'];
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('is unknown until initialized, then follows the system', () => {
    systemPrefersDark(true);
    expect(theme.isDark()).toBeNull();

    theme.init();
    expect(theme.isDark()).toBe(true);
  });

  it('starts from a theme pinned by the inline script', () => {
    systemPrefersDark(true);
    root.dataset['theme'] = 'light';

    theme.init();
    expect(theme.isDark()).toBe(false);
  });

  it('pins and stores a theme that differs from the system', () => {
    systemPrefersDark(false);
    theme.init();

    theme.toggle();
    expect(theme.isDark()).toBe(true);
    expect(root.dataset['theme']).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('forgets the choice when toggling back to the system theme', () => {
    systemPrefersDark(false);
    theme.toggle();
    theme.toggle();

    expect(theme.isDark()).toBe(false);
    expect(root.dataset['theme']).toBeUndefined();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('follows system changes only while no theme is pinned', () => {
    const setSystem = systemPrefersDark(false);
    theme.init();

    setSystem(true);
    expect(theme.isDark()).toBe(true);

    theme.toggle(); // light, pinned against a dark system
    setSystem(false);
    setSystem(true);
    expect(theme.isDark()).toBe(false);
  });

  it('still switches the page when storage is unavailable', () => {
    systemPrefersDark(false);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied');
    });

    theme.toggle();
    expect(root.dataset['theme']).toBe('dark');
  });

  it('does nothing without matchMedia', () => {
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: undefined });

    theme.init();
    expect(theme.isDark()).toBeNull();
  });
});
