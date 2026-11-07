import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CV_SUMMARY, EDUCATION, JOBS, SKILLS, SPOKEN_LANGUAGES } from '../../../content/experience';
import { CURRENT_LOCALE } from '../../core/i18n/locale';
import { Icon } from '../../shared/icon/icon';
import { Period } from './period';

/** The CV: summary, a timeline of jobs, then skills, education and languages. */
@Component({
  selector: 'app-experience-page',
  imports: [Icon, Period],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  templateUrl: './experience-page.html',
  styleUrl: './experience-page.scss',
})
export class ExperiencePage {
  protected readonly locale = inject(CURRENT_LOCALE);
  protected readonly summary = CV_SUMMARY;
  protected readonly jobs = JOBS;
  protected readonly skills = SKILLS;
  protected readonly education = EDUCATION;
  protected readonly languages = SPOKEN_LANGUAGES;
}
