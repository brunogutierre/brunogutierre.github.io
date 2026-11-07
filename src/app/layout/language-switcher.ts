import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {
  CURRENT_LOCALE,
  Locale,
  LOCALE_INFO,
  LOCALES,
  localizedPath,
  normalizePath,
} from '../core/i18n/locale';
import { injectCurrentPage } from '../core/routing/current-page';

/**
 * Links to the current page in every language. Each language is a separate build, so these are
 * plain links (a full page load), not router links. Where the page does not exist:
 * - a page missing in some languages (an untranslated post) links to its parent page there, the
 *   blog index;
 * - the 404 page links to each language's home: /404.html is served at any missing URL, so it
 *   has no translation.
 */
@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="languages" i18n-aria-label="@@shell.languages" aria-label="Languages">
      <ul>
        @for (option of options(); track option.locale) {
          <li>
            <a
              [href]="option.href"
              [attr.hreflang]="option.locale"
              [attr.lang]="option.locale"
              [attr.aria-current]="option.current ? 'true' : null"
              >{{ option.short }}<span class="visually-hidden"> {{ option.name }}</span></a
            >
          </li>
        }
      </ul>
    </nav>
  `,
  styles: `
    @use 'breakpoints' as *;

    ul {
      display: flex;
      margin: 0;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: var(--r-sm);
      list-style: none;
      overflow: hidden;
    }

    a {
      display: grid;
      place-items: center;
      inline-size: var(--target);
      block-size: 42px;
      color: var(--text-muted);
      font: var(--fw-medium) var(--fs-sm) / 1 var(--font-mono);
      text-decoration: none;
      text-transform: uppercase;
      outline-offset: -3px; // the group clips its corners: keep the focus ring inside

      &:hover {
        background: var(--surface-2);
        color: var(--text);
      }

      &[aria-current] {
        background: var(--primary-tint);
        color: var(--primary);
      }
    }

    @media (max-width: $bp-xs - 1px) {
      a {
        inline-size: 40px;
      }
    }
  `,
})
export class LanguageSwitcher {
  private readonly current = inject(CURRENT_LOCALE);
  private readonly page = injectCurrentPage();

  protected readonly options = computed(() =>
    LOCALES.map((locale) => ({
      locale,
      short: LOCALE_INFO[locale].short,
      name: LOCALE_INFO[locale].name,
      href: localizedPath(locale, this.target(locale)),
      current: locale === this.current,
    })),
  );

  private target(locale: Locale): string {
    const { url, indexable, locales } = this.page();
    if (!indexable) return '/';
    return locales.includes(locale) ? url : parentPath(url);
  }
}

/** `/blog/my-post/` → `/blog/` */
export function parentPath(url: string): string {
  return normalizePath(url).replace(/[^/]+\/$/, '');
}
