import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ThemeService } from '../core/theme/theme.service';
import { Icon } from '../shared/icon/icon';

@Component({
  selector: 'app-theme-toggle',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="icon-btn theme-toggle"
      [attr.aria-pressed]="pressed()"
      (click)="theme.toggle()"
    >
      <app-icon name="moon" class="light-only" />
      <app-icon name="sun" class="dark-only" />
      <span class="visually-hidden" i18n="@@theme.dark">Dark theme</span>
    </button>
  `,
  styles: `
    // Without JavaScript the button cannot work: hide it without moving the layout.
    :host-context(html:not([data-js])) .theme-toggle {
      visibility: hidden;
    }
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);

  /** Unknown while prerendering and on the first client render, so hydration sees the same DOM. */
  protected readonly pressed = computed(() => {
    const dark = this.theme.isDark();
    return dark === null ? null : String(dark);
  });

  constructor() {
    afterNextRender(() => this.theme.init());
  }
}
