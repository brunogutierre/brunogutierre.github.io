import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageSwitcher } from './language-switcher';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, LanguageSwitcher],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header">
      <a class="brand" routerLink="/">Bruno Gutierre</a>
      <nav i18n-aria-label="@@shell.nav" aria-label="Main">
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
      <app-language-switcher />
    </header>
  `,
})
export class SiteHeader {}
