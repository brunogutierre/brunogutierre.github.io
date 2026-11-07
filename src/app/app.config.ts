import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Pages are prerendered to static HTML; hydration reuses that DOM instead of re-rendering,
    // and event replay keeps clicks made before the app finished booting.
    provideClientHydration(withEventReplay()),
  ],
};
