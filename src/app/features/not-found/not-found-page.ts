import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <div class="page-header">
      <p class="eyebrow">
        <app-icon name="chevron" /><span i18n="@@notFound.eyebrow">404 / not found</span>
      </p>
      <h1 i18n="@@notFound.title">Page not found</h1>
      <p class="lead" i18n="@@notFound.text">
        The page you are looking for does not exist or has moved.
      </p>
    </div>
    <a class="btn btn--primary" routerLink="/">
      <span i18n="@@notFound.home">Back to the home page</span><app-icon name="arrow-right" />
    </a>
  `,
})
export class NotFoundPage {}
