import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-blog-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 i18n="@@nav.blog">Blog</h1>
    <p i18n="@@blog.soon">Coming soon: notes on what I learn from each project.</p>
  `,
})
export class BlogPage {}
