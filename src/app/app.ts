import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>Bruno Gutierre</h1>
      <p>The new site is under construction.</p>
    </main>
    <router-outlet />
  `,
})
export class App {}
