import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-experience-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 i18n="@@nav.experience">Experience</h1>
    <p i18n="@@experience.soon">Coming soon: my professional timeline and a printable CV.</p>
  `,
})
export class ExperiencePage {}
