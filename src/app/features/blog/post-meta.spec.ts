import { TestBed } from '@angular/core/testing';
import { postSummary } from '../../core/blog/testing';
import { CURRENT_LOCALE, Locale } from '../../core/i18n/locale';
import { formatDay, PostMeta } from './post-meta';

describe('formatDay', () => {
  it('writes a date the way each language does, whatever the time zone', () => {
    expect(formatDay('2026-11-07', 'en')).toBe('Nov 7, 2026');
    expect(formatDay('2026-11-07', 'pt-BR')).toBe('7 de nov. de 2026');
    expect(formatDay('2026-01-01', 'fr')).toBe('1 janv. 2026');
  });
});

describe('PostMeta', () => {
  function render(post = postSummary('a'), locale: Locale = 'en') {
    TestBed.configureTestingModule({ providers: [{ provide: CURRENT_LOCALE, useValue: locale }] });
    const fixture = TestBed.createComponent(PostMeta);
    fixture.componentRef.setInput('post', post);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const text = (element: Element) => element.textContent?.replace(/\s+/g, ' ').trim();

  it('shows the date as a <time> and the reading time', () => {
    const root = render(postSummary('a', { date: '2026-11-07', readingMinutes: 4 }));

    expect(root.querySelector('time')?.getAttribute('datetime')).toBe('2026-11-07');
    expect(text(root)).toBe('Nov 7, 2026 4 min read');
  });

  it('shows the update date and marks drafts', () => {
    const root = render(postSummary('a', { updated: '2026-12-01', draft: true }));
    const [, updated] = Array.from(root.querySelectorAll('time'));

    expect(updated.getAttribute('datetime')).toBe('2026-12-01');
    expect(text(root)).toContain('Updated Dec 1, 2026');
    expect(text(root.querySelector('.draft')!)).toBe('Draft');
  });
});
