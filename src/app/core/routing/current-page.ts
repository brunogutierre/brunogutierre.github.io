import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { PageSeo } from '../seo/seo.service';

export interface CurrentPage {
  /** Router URL (no locale prefix). */
  readonly url: string;
  /** False for pages kept out of search results, such as the 404 page. */
  readonly indexable: boolean;
}

/** The page being shown, updated after every navigation. */
export function injectCurrentPage(): Signal<CurrentPage> {
  const router = inject(Router);
  const read = (): CurrentPage => {
    let route: ActivatedRouteSnapshot = router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const seo = route.data['seo'] as PageSeo | undefined;
    return { url: router.url, indexable: !seo?.noindex };
  };
  return toSignal(
    router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(read),
    ),
    { initialValue: read() },
  );
}
