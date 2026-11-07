import { ChangeDetectionStrategy, Component, DOCUMENT, inject } from '@angular/core';
import { CV_SUMMARY, EDUCATION, JOBS, SKILLS, SPOKEN_LANGUAGES } from '../../../content/experience';
import { PROFILE } from '../../../content/profile';
import { absoluteUrl, CURRENT_LOCALE } from '../../core/i18n/locale';
import { Icon } from '../../shared/icon/icon';
import { Period } from './period';

/** Default name of the PDF: browsers use the document title. */
const PDF_TITLE = `${PROFILE.name} - ${$localize`:@@experience.pdfTitle:CV`}`;

/** "https://www.linkedin.com/in/x/" → "linkedin.com/in/x": short enough to read on paper. */
const withoutScheme = (url: string) => url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '');

/**
 * The CV: summary, a timeline of jobs, then skills, education and languages. Printing it (button
 * or Ctrl+P) gives the CV in the current language, with contacts on top and the PDF named after it.
 */
@Component({
  selector: 'app-experience-page',
  imports: [Icon, Period],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'page',
    '(window:beforeprint)': 'useCvTitle()',
    '(window:afterprint)': 'restoreTitle()',
  },
  templateUrl: './experience-page.html',
  styleUrl: './experience-page.scss',
})
export class ExperiencePage {
  protected readonly locale = inject(CURRENT_LOCALE);
  protected readonly profile = PROFILE;
  protected readonly summary = CV_SUMMARY;
  protected readonly jobs = JOBS;
  protected readonly skills = SKILLS;
  protected readonly education = EDUCATION;
  protected readonly languages = SPOKEN_LANGUAGES;
  protected readonly webLinks = [
    PROFILE.links.linkedin,
    PROFILE.links.github,
    absoluteUrl(this.locale, '/'),
  ].map((url) => ({ url, label: withoutScheme(url) }));

  private readonly document = inject(DOCUMENT);
  private pageTitle?: string;

  protected print(): void {
    this.document.defaultView?.print();
  }

  protected useCvTitle(): void {
    this.pageTitle = this.document.title;
    this.document.title = PDF_TITLE;
  }

  protected restoreTitle(): void {
    if (this.pageTitle === undefined) return;
    this.document.title = this.pageTitle;
    this.pageTitle = undefined;
  }
}
