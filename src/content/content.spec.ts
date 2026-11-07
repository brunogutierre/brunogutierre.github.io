import { Localized, LOCALES } from '../app/core/i18n/locale';
import { CV_SUMMARY, EDUCATION, JOBS, SKILLS, SPOKEN_LANGUAGES, YearMonth } from './experience';
import { PROFILE } from './profile';
import { ANDROID_APP, PROJECTS } from './projects';

describe('site content', () => {
  it('fills every text in every language, without stray spaces', () => {
    const localized: Localized<string | readonly string[]>[] = [
      PROFILE.role,
      PROFILE.location,
      PROFILE.about,
      ...PROFILE.highlights.map((h) => h.label),
      ANDROID_APP.summary,
      ...PROJECTS.flatMap((p) => [p.summary, ...p.links.flatMap((l) => (l.part ? [l.part] : []))]),
      CV_SUMMARY,
      ...JOBS.flatMap((j) => [j.role, j.achievements, ...(j.companyNote ? [j.companyNote] : [])]),
      ...SKILLS.map((s) => s.label),
      ...EDUCATION.flatMap((d) => [d.title, d.school]),
      ...SPOKEN_LANGUAGES.flatMap((l) => [l.name, l.level]),
    ];
    for (const value of localized) {
      for (const locale of LOCALES) {
        for (const text of [value[locale]].flat()) {
          expect(text.length, locale).toBeGreaterThan(0);
          expect(text.trim(), locale).toBe(text);
        }
      }
    }
  });

  it('translates every paragraph and every achievement', () => {
    for (const list of [PROFILE.about, ...JOBS.map((j) => j.achievements)]) {
      const counts = LOCALES.map((locale) => list[locale].length);
      expect(new Set(counts).size).toBe(1);
    }
  });

  it('keeps project and job ids unique and URL-safe', () => {
    for (const ids of [PROJECTS.map((p) => p.id), JOBS.map((j) => j.id)]) {
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('dates jobs and degrees as YYYY or YYYY-MM, newest first', () => {
    // string order is date order for these formats ('2015' < '2015-01' < '2016')
    for (const periods of [JOBS, EDUCATION]) {
      for (const { start, end } of periods) {
        for (const date of [start, end]) expect(date).toMatch(/^\d{4}(-(0[1-9]|1[0-2]))?$/);
        expect(start <= end).toBe(true);
      }
      const starts: YearMonth[] = periods.map((p) => p.start);
      expect(starts).toEqual([...starts].sort().reverse());
    }
  });

  it('features exactly three projects on the home page', () => {
    expect(PROJECTS.filter((p) => p.featured)).toHaveLength(3);
  });

  it('links every project to its source code over HTTPS', () => {
    for (const project of PROJECTS) {
      expect(project.links.some((l) => l.kind === 'source')).toBe(true);
      for (const link of project.links) expect(new URL(link.url).protocol).toBe('https:');
    }
    expect(new URL(ANDROID_APP.url).protocol).toBe('https:');
  });

  it('names the part when a project has two links of the same kind', () => {
    for (const project of PROJECTS) {
      const kinds = project.links.map((l) => l.kind);
      for (const link of project.links) {
        if (kinds.filter((k) => k === link.kind).length > 1) expect(link.part).toBeDefined();
      }
    }
  });

  it('lists finished projects before the ones in progress', () => {
    const firstInProgress = PROJECTS.findIndex((p) => p.inProgress);
    expect(PROJECTS.slice(firstInProgress).every((p) => p.inProgress)).toBe(true);
  });
});
