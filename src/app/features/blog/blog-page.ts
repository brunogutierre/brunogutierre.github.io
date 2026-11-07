import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-blog-page',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <div class="page-header">
      <p class="eyebrow"><app-icon name="chevron" /><span i18n="@@blog.eyebrow">03 / blog</span></p>
      <h1 i18n="@@nav.blog">Blog</h1>
      <p class="lead" i18n="@@blog.soon">Coming soon: notes on what I learn from each project.</p>
    </div>
  `,
})
export class BlogPage {}
