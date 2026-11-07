import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ANDROID_APP } from '../../../content/projects';
import { CURRENT_LOCALE } from '../../core/i18n/locale';
import { Icon } from '../../shared/icon/icon';

/** Wide card that sends visitors to the Android version of Advanced Sudoku. */
@Component({
  selector: 'app-android-app-card',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article aria-labelledby="android-app-title">
      <div class="tile" aria-hidden="true"><app-icon name="smartphone" /></div>
      <div class="body">
        <p class="eyebrow" i18n="@@android.eyebrow">Android app</p>
        <h3 id="android-app-title" i18n="@@android.title">{{ app.name }} for Android</h3>
        <p class="summary">{{ app.summary[locale] }}</p>
      </div>
      <a class="btn btn--primary" [href]="app.url">
        <span i18n="@@android.cta">Get the app</span><app-icon name="external-link" />
      </a>
    </article>
  `,
  styles: `
    @use 'breakpoints' as *;

    :host {
      display: block;
    }

    // stacked on phones; tile beside the text from $bp-sm, button beside it from $bp-md
    article {
      display: grid;
      gap: var(--sp-4) var(--sp-5);
      align-items: center;
      padding: var(--sp-5);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      background: var(--surface-2);
    }

    .tile {
      display: grid;
      place-items: center;
      inline-size: 3.5rem;
      block-size: 3.5rem;
      border-radius: var(--r-md);
      background: linear-gradient(150deg, var(--hero-1), var(--hero-2) 70%, var(--hero-3) 140%);
      color: var(--on-hero);
      --icon-size: 2rem;
    }

    .body {
      display: grid;
      gap: var(--sp-2);
    }

    h3 {
      font-size: var(--fs-xl);
    }

    .summary {
      margin: 0;
      color: var(--text-muted);
    }

    .btn {
      grid-column: 1 / -1;
      justify-self: start;
      --icon-size: 18px;
    }

    @media (min-width: $bp-sm) {
      article {
        grid-template-columns: auto 1fr;
      }
    }

    @media (min-width: $bp-md) {
      article {
        grid-template-columns: auto 1fr auto;
      }

      .btn {
        grid-column: auto;
      }
    }
  `,
})
export class AndroidAppCard {
  protected readonly app = ANDROID_APP;
  protected readonly locale = inject(CURRENT_LOCALE);
}
