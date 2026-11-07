import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROFILE } from '../../../content/profile';
import { CURRENT_LOCALE } from '../../core/i18n/locale';
import { HomePage } from './home-page';

describe('HomePage', () => {
  function render() {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: CURRENT_LOCALE, useValue: 'pt-BR' }],
    });
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const text = (element: Element | null) => element?.textContent?.replace(/\s+/g, ' ').trim();

  it('shows the role and the About paragraphs in the current language', () => {
    const root = render();

    expect(text(root.querySelector('.hero-role'))).toBe(PROFILE.role['pt-BR']);
    expect(Array.from(root.querySelectorAll('.about-text p'), text)).toEqual(
      PROFILE.about['pt-BR'],
    );
    expect(text(root.querySelector('.highlights li'))).toBe('17+ anos desenvolvendo software');
  });

  it('serves the photo from the site root in two sizes', () => {
    const photo = render().querySelector('.hero-photo') as HTMLImageElement;

    expect(photo.getAttribute('src')).toBe('/images/bruno-gutierre-480.webp');
    expect(photo.getAttribute('srcset')).toContain('/images/bruno-gutierre-240.webp 240w');
    expect(photo.alt).toBe('Photo of Bruno Gutierre');
  });

  it('features three projects, the Android app and a link to all projects', () => {
    const featured = render().querySelector('.featured') as HTMLElement;

    expect(Array.from(featured.querySelectorAll('app-project-card h3'), text)).toEqual([
      'Advanced Sudoku',
      'PokeRol',
      'AngularMapper',
    ]);
    expect(featured.querySelector('app-android-app-card')).not.toBeNull();
    expect(featured.querySelector('.all-projects')?.getAttribute('href')).toBe('/projects');
  });
});
