import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectCurrentUrl } from './core/routing/current-url';
import { SiteFooter } from './layout/site-footer';
import { SiteHeader } from './layout/site-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" [href]="skipHref()" (click)="skipToMain($event)" i18n="@@shell.skip"
      >Skip to content</a
    >
    <app-site-header />
    <main id="main" tabindex="-1" #main>
      <router-outlet />
    </main>
    <app-site-footer />
  `,
})
export class App {
  private readonly location = inject(Location);
  private readonly url = injectCurrentUrl();
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  /**
   * A bare "#main" would resolve against <base href> and jump to the locale home page, so the
   * link carries the current page path; with JavaScript it just moves focus to the content.
   */
  protected readonly skipHref = computed(
    () => `${this.location.prepareExternalUrl(this.url())}#main`,
  );

  protected skipToMain(event: Event): void {
    event.preventDefault();
    this.main().nativeElement.focus();
  }
}
