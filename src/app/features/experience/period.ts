import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { YearMonth } from '../../../content/experience';
import { CURRENT_LOCALE, Locale } from '../../core/i18n/locale';

/** "Sep 2022" / "set. de 2022" / "sept. 2022", or just the year when there is no month. */
export function formatYearMonth(value: YearMonth, locale: Locale): string {
  const [year, month] = value.split('-').map(Number);
  if (!month) return String(year);
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(Date.UTC(year, month - 1));
}

/** A start–end range of `<time>` elements, written the way the current language writes dates. */
@Component({
  selector: 'app-period',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<time [attr.datetime]="start()">{{ startLabel() }}</time> –
    <time [attr.datetime]="end()">{{ endLabel() }}</time>`,
})
export class Period {
  readonly start = input.required<YearMonth>();
  readonly end = input.required<YearMonth>();

  private readonly locale = inject(CURRENT_LOCALE);
  protected readonly startLabel = computed(() => formatYearMonth(this.start(), this.locale));
  protected readonly endLabel = computed(() => formatYearMonth(this.end(), this.locale));
}
