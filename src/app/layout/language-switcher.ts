import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CURRENT_LOCALE, LOCALE_INFO, LOCALES, localizedPath } from '../core/i18n/locale';
import { injectCurrentUrl } from '../core/routing/current-url';

/**
 * Links to the current page in every language. Each language is a separate build, so these are
 * plain links (a full page load), not router links.
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
})
export class LanguageSwitcher {
  private readonly current = inject(CURRENT_LOCALE);
  private readonly url = injectCurrentUrl();

  protected readonly options = computed(() =>
    LOCALES.map((locale) => ({
      locale,
      short: LOCALE_INFO[locale].short,
      name: LOCALE_INFO[locale].name,
      href: localizedPath(locale, this.url()),
      current: locale === this.current,
    })),
  );
}
