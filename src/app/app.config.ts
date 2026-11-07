import { LocationStrategy, TrailingSlashPathLocationStrategy } from '@angular/common';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import { SeoTitleStrategy } from './core/seo/seo-title-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // GitHub Pages serves every page as a folder and redirects /x to /x/: writing URLs with the
    // trailing slash keeps links, reloads and shared URLs free of that redirect.
    { provide: LocationStrategy, useClass: TrailingSlashPathLocationStrategy },
    { provide: TitleStrategy, useClass: SeoTitleStrategy },
    // Pages are prerendered to static HTML; hydration reuses that DOM instead of re-rendering,
    // and event replay keeps clicks made before the app finished booting.
    provideClientHydration(withEventReplay()),
  ],
};
