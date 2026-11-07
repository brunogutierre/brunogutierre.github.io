import { TestBed } from '@angular/core/testing';
import { CURRENT_LOCALE } from '../../core/i18n/locale';
import { formatYearMonth, Period } from './period';

describe('formatYearMonth', () => {
  it.each([
    ['en', 'Sep 2022'],
    ['pt-BR', 'set. de 2022'],
    ['fr', 'sept. 2022'],
  ] as const)('writes a month the %s way', (locale, expected) => {
    expect(formatYearMonth('2022-09', locale)).toBe(expected);
  });

  it('keeps a year alone', () => {
    expect(formatYearMonth('2015', 'fr')).toBe('2015');
  });
});

describe('Period', () => {
  it('renders both ends as machine-readable dates', () => {
    TestBed.configureTestingModule({ providers: [{ provide: CURRENT_LOCALE, useValue: 'en' }] });
    const fixture = TestBed.createComponent(Period);
    fixture.componentRef.setInput('start', '2022-09');
    fixture.componentRef.setInput('end', '2026-05');
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent?.trim()).toBe('Sep 2022 – May 2026');
    expect(Array.from(root.querySelectorAll('time'), (t) => t.getAttribute('datetime'))).toEqual([
      '2022-09',
      '2026-05',
    ]);
  });
});
