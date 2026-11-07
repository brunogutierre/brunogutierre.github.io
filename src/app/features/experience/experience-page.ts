import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-experience-page',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <div class="page-header">
      <p class="eyebrow">
        <app-icon name="chevron" /><span i18n="@@experience.eyebrow">02 / experience</span>
      </p>
      <h1 i18n="@@nav.experience">Experience</h1>
      <p class="lead" i18n="@@experience.soon">
        Coming soon: my professional timeline and a printable CV.
      </p>
    </div>
  `,
})
export class ExperiencePage {}
