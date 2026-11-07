import { Location, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectCurrentPage } from './core/routing/current-page';
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
  private readonly page = injectCurrentPage();
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  /**
   * A bare "#main" would resolve against <base href> and jump to the locale home page, so the
   * link carries the current page path; with JavaScript it just moves focus to the content.
   */
  protected readonly skipHref = computed(
    () => `${this.location.prepareExternalUrl(this.page().url)}#main`,
  );

  constructor() {
    // The router scrolls to a fragment with window.scrollTo, which ignores CSS scroll-padding:
    // keep the heading clear of the sticky header by the same amount the CSS reserves.
    const root = inject(DOCUMENT).documentElement;
    inject(ViewportScroller).setOffset(() => [
      0,
      parseFloat(getComputedStyle(root).scrollPaddingTop) || 0,
    ]);
  }

  protected skipToMain(event: Event): void {
    event.preventDefault();
    this.main().nativeElement.focus();
  }
}
