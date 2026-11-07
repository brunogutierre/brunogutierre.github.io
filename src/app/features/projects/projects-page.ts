import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-projects-page',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <div class="page-header">
      <p class="eyebrow">
        <app-icon name="chevron" /><span i18n="@@projects.eyebrow">01 / projects</span>
      </p>
      <h1 i18n="@@nav.projects">Projects</h1>
      <p class="lead" i18n="@@projects.soon">
        Coming soon: the projects I build to learn and to show what I can do.
      </p>
    </div>
  `,
})
export class ProjectsPage {}
