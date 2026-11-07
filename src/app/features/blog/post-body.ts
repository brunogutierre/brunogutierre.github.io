import { Location } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

const COPY = $localize`:@@post.copy:Copy`;
const COPIED = $localize`:@@post.copied:Copied`;
const COPIED_STATUS = $localize`:@@post.copiedStatus:Code copied to the clipboard`;
const COPY_FAILED = $localize`:@@post.copyFailed:Could not copy the code`;

/**
 * The HTML of a post. Angular's sanitizer would strip the heading ids and code colors, so this is
 * the one place the site trusts HTML: it comes from the repository's own Markdown, rendered at
 * build time with raw HTML escaped and `javascript:` links dropped (scripts/content/markdown.mts).
 * Nothing a visitor types or a URL carries ever reaches it.
 *
 * Fragment links (`#heading`) would resolve against `<base href>`, the language's home page, so
 * they are rewritten to this page. With JavaScript, clicks on them go through the router, which
 * scrolls to the heading and keeps the history and scroll positions in step.
 *
 * Code blocks get a copy button in the browser only: without JavaScript it could not work.
 */
@Component({
  selector: 'app-post-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="prose" [innerHTML]="trusted()"></div>
    <p class="visually-hidden" role="status">{{ status() }}</p>
  `,
  // Delegated: the clicks come from the links and copy buttons inside the post, which keyboards
  // already reach and activate.
  host: { '(click)': 'onClick($event)' },
})
export class PostBody {
  readonly html = input.required<string>();
  /** App URL of the page, such as `/blog/my-post`. */
  readonly url = input.required<string>();

  private readonly sanitizer = inject(DomSanitizer);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Announced by screen readers after a copy. */
  protected readonly status = signal('');

  private readonly pagePath = computed(() => this.location.prepareExternalUrl(this.url()));
  protected readonly trusted = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(
      this.html().replaceAll('href="#', `href="${this.pagePath()}#`),
    ),
  );

  constructor() {
    // Runs in the browser only (where `navigator` exists), after each render of a post's HTML.
    afterRenderEffect({
      write: () => {
        this.trusted();
        if ('clipboard' in navigator) this.addCopyButtons();
      },
    });
  }

  protected onClick(event: MouseEvent): void {
    const target = event.target as Element;
    const copy = target.closest<HTMLButtonElement>('button.copy');
    if (copy) {
      void this.copy(copy);
      return;
    }
    const href = target.closest('a')?.getAttribute('href') ?? '';
    const prefix = `${this.pagePath()}#`;
    const modified = event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey;
    if (!href.startsWith(prefix) || modified || event.altKey) return;
    event.preventDefault();
    const destination = this.router.parseUrl(this.url());
    destination.fragment = decodeURIComponent(href.slice(prefix.length));
    void this.router.navigateByUrl(destination);
  }

  private addCopyButtons(): void {
    for (const head of this.host.nativeElement.querySelectorAll('.code-head')) {
      if (head.querySelector('.copy')) continue;
      const button = head.ownerDocument.createElement('button');
      button.type = 'button';
      button.className = 'copy';
      button.textContent = COPY;
      head.append(button);
    }
  }

  private async copy(button: HTMLButtonElement): Promise<void> {
    const code = button.closest('.code-block')?.querySelector('pre')?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      this.status.set(COPY_FAILED);
      return;
    }
    button.textContent = COPIED;
    button.classList.add('copied');
    this.status.set(COPIED_STATUS);
    setTimeout(() => {
      button.textContent = COPY;
      button.classList.remove('copied');
      this.status.set('');
    }, 2000);
  }
}
