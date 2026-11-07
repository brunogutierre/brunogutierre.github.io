import { TestBed } from '@angular/core/testing';
import { ANDROID_APP, PROJECTS } from '../../../content/projects';
import { ProjectsPage } from './projects-page';

describe('ProjectsPage', () => {
  function render() {
    const fixture = TestBed.createComponent(ProjectsPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const titles = (section: Element) =>
    Array.from(section.querySelectorAll('app-project-card h3'), (h) => h.textContent?.trim());

  it('splits the projects into completed and in progress, keeping their order', () => {
    const [completed, inProgress] = Array.from(render().querySelectorAll('section'));

    expect(titles(completed)).toEqual(PROJECTS.filter((p) => !p.inProgress).map((p) => p.name));
    expect(titles(inProgress)).toEqual(PROJECTS.filter((p) => p.inProgress).map((p) => p.name));
  });

  it('opens the completed projects with the Android app', () => {
    const completed = render().querySelector('section') as HTMLElement;

    const app = completed.querySelector('app-android-app-card');
    expect(app?.querySelector('h3')?.textContent?.trim()).toBe('Advanced Sudoku for Android');
    expect(app?.querySelector('a')?.getAttribute('href')).toBe(ANDROID_APP.url);
    expect(app?.querySelector('.summary')?.textContent).toBe(ANDROID_APP.summary.en);
  });
});
