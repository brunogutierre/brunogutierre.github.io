import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROJECTS } from '../../../content/projects';
import { Icon } from '../../shared/icon/icon';
import { AndroidAppCard } from './android-app-card';
import { ProjectCard } from './project-card';

@Component({
  selector: 'app-projects-page',
  imports: [Icon, ProjectCard, AndroidAppCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <div class="page-header">
      <p class="eyebrow">
        <app-icon name="chevron" /><span i18n="@@projects.eyebrow">01 / projects</span>
      </p>
      <h1 i18n="@@nav.projects">Projects</h1>
      <p class="lead" i18n="@@projects.lead">
        Projects I build to learn new tools and to show how I work. All of them are open source.
      </p>
    </div>

    <section class="project-section" aria-labelledby="completed-title">
      <h2 id="completed-title" i18n="@@projects.completed">Completed</h2>
      <app-android-app-card />
      <ul class="project-grid">
        @for (project of completed; track project.id) {
          <li><app-project-card [project]="project" /></li>
        }
      </ul>
    </section>

    <section class="project-section" aria-labelledby="in-progress-title">
      <h2 id="in-progress-title" i18n="@@projects.inProgress">In progress</h2>
      <ul class="project-grid">
        @for (project of inProgress; track project.id) {
          <li><app-project-card [project]="project" /></li>
        }
      </ul>
    </section>
  `,
  styles: `
    .project-section {
      display: grid;
      gap: var(--sp-5);

      & + & {
        margin-block-start: var(--sp-8);
      }
    }

    h2 {
      font-size: var(--fs-2xl);
    }
  `,
})
export class ProjectsPage {
  protected readonly completed = PROJECTS.filter((project) => !project.inProgress);
  protected readonly inProgress = PROJECTS.filter((project) => project.inProgress);
}
