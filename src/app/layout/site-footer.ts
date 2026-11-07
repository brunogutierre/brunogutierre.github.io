import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="site-footer">
      <p>© {{ year }} Bruno Gutierre</p>
      <ul>
        <li><a href="https://github.com/brunogutierre">GitHub</a></li>
        <li><a href="https://www.linkedin.com/in/bruno-gutierre/">LinkedIn</a></li>
        <li><a href="mailto:brunorg@gmail.com" i18n="@@footer.email">E-mail</a></li>
      </ul>
    </footer>
  `,
})
export class SiteFooter {
  protected readonly year = new Date().getFullYear();
}
