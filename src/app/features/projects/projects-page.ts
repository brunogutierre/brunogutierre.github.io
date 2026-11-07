import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-projects-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 i18n="@@nav.projects">Projects</h1>
    <p i18n="@@projects.soon">
      Coming soon: the projects I build to learn and to show what I can do.
    </p>
  `,
})
export class ProjectsPage {}
