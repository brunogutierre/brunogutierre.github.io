import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Bruno Gutierre</h1>
    <p i18n="@@home.role">Frontend and fullstack developer: Angular, Java and, lately, Python.</p>
    <p i18n="@@home.construction">The new site is under construction.</p>
  `,
})
export class HomePage {}
