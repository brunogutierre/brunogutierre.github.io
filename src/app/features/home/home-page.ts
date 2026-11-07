import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-content">
        <p class="hero-greeting" i18n="@@home.greeting">Hello, I'm</p>
        <!-- one name per line; the space inside the first span keeps the accessible name -->
        <h1 id="hero-title"><span class="line">Bruno </span><span class="line">Gutierre</span></h1>
        <p class="hero-role" i18n="@@home.role">
          Frontend and fullstack developer: Angular, Java and, lately, Python.
        </p>
        <div class="hero-actions">
          <a class="btn btn--on-hero" routerLink="/projects">
            <span i18n="@@home.ctaProjects">See projects</span><app-icon name="arrow-right" />
          </a>
          <a class="btn btn--on-hero-ghost" routerLink="/experience" i18n="@@nav.experience"
            >Experience</a
          >
        </div>
      </div>
      <!-- placeholder until the photo arrives -->
      <div class="hero-photo" aria-hidden="true">BG</div>
    </section>
    <div class="page status">
      <p class="eyebrow">
        <app-icon name="chevron" /><span i18n="@@home.statusEyebrow">00 / status</span>
      </p>
      <p class="lead" i18n="@@home.construction">The new site is under construction.</p>
    </div>
  `,
  styleUrl: './home-page.scss',
})
export class HomePage {}
