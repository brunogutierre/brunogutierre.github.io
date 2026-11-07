import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

/**
 * The HTML of a post. Angular's sanitizer would strip the heading ids and code colors, so this is
 * the one place the site trusts HTML: it comes from the repository's own Markdown, rendered at
 * build time with raw HTML escaped and `javascript:` links dropped (scripts/content/markdown.mts).
 * Nothing a visitor types or a URL carries ever reaches it.
 *
 * Fragment links (`#heading`) would resolve against `<base href>`, the language's home page, so
 * they are rewritten to this page. With JavaScript, clicks on them go through the router, which
 * scrolls to the heading and keeps the history and scroll positions in step.
 */
@Component({
  selector: 'app-post-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: { class: 'prose', '[innerHTML]': 'trusted()', '(click)': 'followFragment($event)' },
})
export class PostBody {
  readonly html = input.required<string>();
  /** App URL of the page, such as `/blog/my-post`. */
  readonly url = input.required<string>();

  private readonly sanitizer = inject(DomSanitizer);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  private readonly pagePath = computed(() => this.location.prepareExternalUrl(this.url()));
  protected readonly trusted = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(
      this.html().replaceAll('href="#', `href="${this.pagePath()}#`),
    ),
  );

  protected followFragment(event: MouseEvent): void {
    const link = (event.target as Element).closest('a');
    const href = link?.getAttribute('href') ?? '';
    const prefix = `${this.pagePath()}#`;
    const modified = event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey;
    if (!href.startsWith(prefix) || modified || event.altKey) return;
    event.preventDefault();
    const target = this.router.parseUrl(this.url());
    target.fragment = decodeURIComponent(href.slice(prefix.length));
    void this.router.navigateByUrl(target);
  }
}
