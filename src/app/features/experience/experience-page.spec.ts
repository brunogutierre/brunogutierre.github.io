import { TestBed } from '@angular/core/testing';
import { CV_SUMMARY, EDUCATION, JOBS, SKILLS } from '../../../content/experience';
import { CURRENT_LOCALE } from '../../core/i18n/locale';
import { ExperiencePage } from './experience-page';

describe('ExperiencePage', () => {
  function render() {
    TestBed.configureTestingModule({ providers: [{ provide: CURRENT_LOCALE, useValue: 'fr' }] });
    const fixture = TestBed.createComponent(ExperiencePage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const text = (element: Element | null) => element?.textContent?.replace(/\s+/g, ' ').trim();
  const texts = (root: Element, selector: string) =>
    Array.from(root.querySelectorAll(selector), text);

  it('opens with the summary in the current language', () => {
    expect(text(render().querySelector('.lead'))).toBe(CV_SUMMARY.fr);
  });

  it('lists every job, newest first, with its dates, achievements and stack', () => {
    const root = render();
    const jobs = root.querySelectorAll('.timeline > li');

    expect(texts(root, '.job-role')).toEqual(JOBS.map((job) => job.role.fr));
    expect(text(jobs[0].querySelector('.period'))).toBe('sept. 2022 – mai 2026');
    // raw text: French uses narrow no-break spaces, which \s would turn into plain ones
    const achievements = jobs[0].querySelectorAll('.achievements li');
    expect(Array.from(achievements, (li) => li.textContent)).toEqual(JOBS[0].achievements.fr);
    expect(texts(jobs[0], '.chips li')).toEqual(JOBS[0].stack);
  });

  it('explains a company name when the content does', () => {
    const companies = texts(render(), '.job-company');

    expect(companies).toContain('SERPRO · Service fédéral de traitement des données du Brésil');
    expect(companies).toContain('Petal');
  });

  it('shows skills, education and languages', () => {
    const root = render();

    expect(texts(root, '.skill-group h3')).toEqual(SKILLS.map((group) => group.label.fr));
    expect(texts(root, '.degrees h3')).toEqual(EDUCATION.map((degree) => degree.title.fr));
    expect(text(root.querySelector('.degrees .period'))).toBe('2007 – 2008');
    expect(texts(root, '.spoken dt')).toEqual(['Anglais', 'Français', 'Portugais']);
  });
});
