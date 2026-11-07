import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../shared/icon/icon';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';

/**
 * Below 900px: two rows (brand and tools, then the navigation), no hamburger menu; only the
 * navigation labels are translated, so the first row has the same width in every language.
 * From 900px: a single sticky row.
 */
@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, Icon, LanguageSwitcher, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header">
      <a class="brand" routerLink="/">
        <span class="brand-mark" aria-hidden="true"><app-icon name="chevron" /></span>
        <span class="brand-name">Bruno Gutierre</span>
      </a>
      <nav class="main-nav" i18n-aria-label="@@shell.nav" aria-label="Main">
        <ul>
          <li>
            <a
              routerLink="/projects"
              routerLinkActive="active"
              ariaCurrentWhenActive="page"
              i18n="@@nav.projects"
              >Projects</a
            >
          </li>
          <li>
            <a
              routerLink="/experience"
              routerLinkActive="active"
              ariaCurrentWhenActive="page"
              i18n="@@nav.experience"
              >Experience</a
            >
          </li>
          <li>
            <a
              routerLink="/blog"
              routerLinkActive="active"
              ariaCurrentWhenActive="page"
              i18n="@@nav.blog"
              >Blog</a
            >
          </li>
        </ul>
      </nav>
      <div class="tools">
        <app-language-switcher />
        <app-theme-toggle />
      </div>
    </header>
  `,
  styleUrl: './site-header.scss',
})
export class SiteHeader {}
