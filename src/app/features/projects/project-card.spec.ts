import { TestBed } from '@angular/core/testing';
import { Project, PROJECTS } from '../../../content/projects';
import { CURRENT_LOCALE } from '../../core/i18n/locale';
import { ProjectCard } from './project-card';

describe('ProjectCard', () => {
  function render(project: Project) {
    TestBed.configureTestingModule({ providers: [{ provide: CURRENT_LOCALE, useValue: 'fr' }] });
    const fixture = TestBed.createComponent(ProjectCard);
    fixture.componentRef.setInput('project', project);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const byId = (id: string) => PROJECTS.find((project) => project.id === id) as Project;
  const text = (element: Element | null) => element?.textContent?.replace(/\s+/g, ' ').trim();

  it('names the article after the project and shows the text of the current language', () => {
    const sudoku = byId('advanced-sudoku');
    const root = render(sudoku);

    const article = root.querySelector('article') as HTMLElement;
    const title = root.querySelector(`#${article.getAttribute('aria-labelledby')}`);
    expect(text(title)).toBe('Advanced Sudoku');
    expect(text(root.querySelector('.summary'))).toBe(sudoku.summary.fr);
  });

  it('numbers the sheet by the position of the project in the list', () => {
    const root = render(PROJECTS[1]);

    expect(text(root.querySelector('.sheet'))).toBe('P-02');
    expect(root.querySelector('.cover')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('lists the stack and the older project it rewrites', () => {
    const root = render(byId('pokerol'));

    expect(Array.from(root.querySelectorAll('.stack li'), text)).toContain('Spring Boot 4');
    const origin = root.querySelector('.origin a');
    expect(origin?.getAttribute('href')).toBe('https://github.com/brunogutierre/brunos-pokedex');
    expect(text(root.querySelector('.origin'))).toContain('2021');
  });

  it('labels each link by kind, part and project', () => {
    const root = render(byId('mtg-to-rpg'));

    const links = Array.from(root.querySelectorAll('.links a'));
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      'https://github.com/brunogutierre/MTGtoRPGFront',
      'https://github.com/brunogutierre/MTGtoRPGBack',
    ]);
    expect(text(links[0])).toBe('Source code (front-end) · MTG to RPG');
    expect(root.querySelector('.origin')).toBeNull();
  });
});
