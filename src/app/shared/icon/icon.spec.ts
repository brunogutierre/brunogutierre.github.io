import { TestBed } from '@angular/core/testing';
import { Icon, ICON_NAMES, IconName } from './icon';

describe('Icon', () => {
  function render(name: IconName) {
    const fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', name);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('svg') as SVGSVGElement;
  }

  it('draws a decorative stroke icon in the SVG namespace', () => {
    const svg = render('arrow-right');

    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.classList.contains('filled')).toBe(false);
    const paths = svg.querySelectorAll('path');
    expect(paths).toHaveLength(2);
    expect(paths[0].namespaceURI).toBe('http://www.w3.org/2000/svg');
  });

  it('draws brand marks filled on their 16px grid', () => {
    const svg = render('github');

    expect(svg.getAttribute('viewBox')).toBe('0 0 16 16');
    expect(svg.classList.contains('filled')).toBe(true);
  });

  it.each(ICON_NAMES)('draws %s', (name) => {
    expect(render(name).children.length).toBeGreaterThan(0);
  });
});
