import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 i18n="@@notFound.title">Page not found</h1>
    <p i18n="@@notFound.text">The page you are looking for does not exist or has moved.</p>
    <p><a routerLink="/" i18n="@@notFound.home">Back to the home page</a></p>
  `,
})
export class NotFoundPage {}
