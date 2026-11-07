import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROFILE } from '../../../content/profile';
import { PROJECTS } from '../../../content/projects';
import { CURRENT_LOCALE } from '../../core/i18n/locale';
import { Icon } from '../../shared/icon/icon';
import { AndroidAppCard } from '../projects/android-app-card';
import { ProjectCard } from '../projects/project-card';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, Icon, ProjectCard, AndroidAppCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  protected readonly profile = PROFILE;
  protected readonly locale = inject(CURRENT_LOCALE);
  protected readonly featured = PROJECTS.filter((project) => project.featured);
}
