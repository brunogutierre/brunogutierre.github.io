import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Project, ProjectLinkKind, PROJECTS } from '../../../content/projects';
import { CURRENT_LOCALE } from '../../core/i18n/locale';
import { Icon, IconName } from '../../shared/icon/icon';

const LINKS: Readonly<Record<ProjectLinkKind, { label: string; icon: IconName }>> = {
  live: { label: $localize`:@@projects.link.live:Live demo`, icon: 'external-link' },
  package: { label: $localize`:@@projects.link.package:npm package`, icon: 'package' },
  source: { label: $localize`:@@projects.link.source:Source code`, icon: 'github' },
};

/**
 * One project: a gradient cover with its icon and sheet number, then the summary, the stack and
 * its links. The sheet number is the project's position in the list, so it is the same on every
 * page.
 */
@Component({
  selector: 'app-project-card',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article [attr.aria-labelledby]="titleId()">
      <div class="cover" [style.--cover-angle.deg]="angle()" aria-hidden="true">
        <span class="sheet">P-{{ sheet() }}</span>
        <app-icon [name]="project().icon" />
      </div>
      <div class="body">
        <h3 [id]="titleId()">{{ project().name }}</h3>
        <p class="summary">{{ project().summary[locale] }}</p>
        @if (project().rewriteOf; as origin) {
          <p class="origin" i18n="@@projects.rewriteOf">
            Rewrite of <a [href]="origin.url">{{ origin.name }}</a
            >, a study project from {{ origin.year }}.
          </p>
        }
        <ul class="chips" aria-label="Technologies" i18n-aria-label="@@projects.stack">
          @for (tech of project().stack; track tech) {
            <li>{{ tech }}</li>
          }
        </ul>
        <ul class="links">
          @for (link of links(); track link.url) {
            <li>
              <a [href]="link.url">
                <app-icon [name]="link.icon" />
                <span
                  >{{ link.label }}
                  @if (link.part) {
                    ({{ link.part }})
                  }
                  <span class="visually-hidden">· {{ project().name }}</span></span
                >
              </a>
            </li>
          }
        </ul>
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
      block-size: 100%;
    }

    article {
      display: flex;
      flex-direction: column;
      block-size: 100%;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      background: var(--surface);
      box-shadow: var(--shadow-1);
    }

    // White marks only over the teal part: the lime stop sits in the bottom-right corner.
    .cover {
      position: relative;
      display: grid;
      place-items: center;
      aspect-ratio: 2 / 1;
      background: linear-gradient(
        var(--cover-angle, 150deg),
        var(--hero-1) 0,
        var(--hero-2) 65%,
        var(--hero-3) 130%
      );
      color: var(--on-hero);

      app-icon {
        --icon-size: clamp(3rem, 2rem + 4vw, 4.5rem);
        --icon-stroke: 1.25;
        opacity: 0.92;
      }
    }

    .sheet {
      position: absolute;
      inset-block-start: var(--sp-4);
      inset-inline-start: var(--sp-4);
      font: var(--fw-medium) var(--fs-xs) / 1 var(--font-mono);
      letter-spacing: var(--tracking-caps);
    }

    .body {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: var(--sp-4);
      padding: var(--sp-5);
    }

    h3 {
      font-size: var(--fs-xl);
    }

    p {
      margin: 0;
    }

    .origin {
      color: var(--text-muted);
      font-size: var(--fs-sm);
    }

    // pushed to the bottom, so the links of a row of cards line up
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-1) var(--sp-4);
      margin: auto 0 0;
      padding: 0;
      list-style: none;

      a {
        display: inline-flex;
        align-items: center;
        gap: var(--sp-2);
        min-block-size: var(--target);
        font-weight: var(--fw-semibold);
        --icon-size: 18px;
      }
    }
  `,
})
export class ProjectCard {
  readonly project = input.required<Project>();

  protected readonly locale = inject(CURRENT_LOCALE);
  protected readonly titleId = computed(() => `project-${this.project().id}`);
  protected readonly sheet = computed(() =>
    String(PROJECTS.indexOf(this.project()) + 1).padStart(2, '0'),
  );
  // a slightly different gradient on each card
  protected readonly angle = computed(() => 125 + ((PROJECTS.indexOf(this.project()) * 23) % 60));
  protected readonly links = computed(() =>
    this.project().links.map((link) => ({
      ...LINKS[link.kind],
      url: link.url,
      part: link.part?.[this.locale],
    })),
  );
}
