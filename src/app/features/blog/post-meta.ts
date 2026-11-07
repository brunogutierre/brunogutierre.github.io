import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PostSummary } from '../../core/blog/post';
import { CURRENT_LOCALE, Locale } from '../../core/i18n/locale';

/** "Nov 7, 2026" / "7 de nov. de 2026" / "7 nov. 2026" for a `YYYY-MM-DD` date. */
export function formatDay(date: string, locale: Locale): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(
    Date.UTC(year, month - 1, day),
  );
}

/** One line of mono metadata: date, update date, reading time and, in development, "Draft". */
@Component({
  selector: 'app-post-meta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // &ngsp; keeps a space between items in the text that screen readers and search engines get
  template: `
    <time [attr.datetime]="post().date">{{ date() }}</time
    >&ngsp;
    @if (post().updated; as updated) {
      <span i18n="@@blog.updated"
        >Updated <time [attr.datetime]="updated">{{ updatedLabel() }}</time></span
      >&ngsp;
    }
    <span i18n="@@blog.readingTime">{{ post().readingMinutes }} min read</span>
    @if (post().draft) {
      &ngsp;<span class="draft" i18n="@@blog.draft">Draft</span>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--sp-1) var(--sp-3);
      color: var(--text-muted);
      font: var(--fs-xs) / var(--lh-snug) var(--font-mono);
    }

    // a dot between items, drawn rather than typed: nothing for screen readers to read out
    :host > * + :not(.draft)::before {
      content: '';
      display: inline-block;
      inline-size: 3px;
      block-size: 3px;
      margin-inline-end: var(--sp-3);
      border-radius: 50%;
      background: currentColor;
      vertical-align: middle;
    }

    .draft {
      padding: 2px var(--sp-2);
      border-radius: var(--r-xs);
      background: var(--accent);
      color: var(--on-accent);
      font-weight: var(--fw-semibold);
      letter-spacing: var(--tracking-caps);
      text-transform: uppercase;
    }
  `,
})
export class PostMeta {
  readonly post = input.required<PostSummary>();

  private readonly locale = inject(CURRENT_LOCALE);
  protected readonly date = computed(() => formatDay(this.post().date, this.locale));
  protected readonly updatedLabel = computed(() => {
    const updated = this.post().updated;
    return updated ? formatDay(updated, this.locale) : '';
  });
}
