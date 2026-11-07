import { inject, Injectable } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { PageSeo, SeoService } from './seo.service';

/**
 * The router calls the title strategy after every navigation, on the server while prerendering
 * and in the browser: the natural hook to apply the page metadata declared in `data.seo`.
 */
@Injectable()
export class SeoTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route = snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const page = route.data['seo'] as PageSeo | undefined;
    if (page) {
      this.seo.apply(snapshot.url, page);
    }
  }
}
