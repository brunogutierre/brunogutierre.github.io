import { inject, InjectionToken, LOCALE_ID } from '@angular/core';

/**
 * Languages the site is published in. Each one is a separate build (`@angular/localize`), and the
 * first one is the source locale, served at the site root.
 */
export const LOCALES = ['en', 'pt-BR', 'fr'] as const;
export type Locale = (typeof LOCALES)[number];

/** One value per language: forgetting a translation is a compile error. */
export type Localized<T> = Readonly<Record<Locale, T>>;

export const SOURCE_LOCALE: Locale = 'en';
export const SITE_ORIGIN = 'https://brunogutierre.github.io';

export interface LocaleInfo {
  /** URL prefix of the locale build; matches its `subPath` in angular.json. */
  readonly base: string;
  /** Name of the language in that language, for the language switcher. */
  readonly name: string;
  readonly short: string;
  /** Open Graph locale (`language_TERRITORY`). */
  readonly og: string;
}

export const LOCALE_INFO: Localized<LocaleInfo> = {
  en: { base: '/', name: 'English', short: 'EN', og: 'en_US' },
  'pt-BR': { base: '/pt/', name: 'Português', short: 'PT', og: 'pt_BR' },
  fr: { base: '/fr/', name: 'Français', short: 'FR', og: 'fr_FR' },
};

const language = (tag: string) => tag.toLowerCase().split('-')[0];

/**
 * Matches a BCP 47 tag (`LOCALE_ID`, `navigator.languages`) to a site locale: exact tag first,
 * then the same language (`pt-PT` → `pt-BR`, `fr-CA` → `fr`). Undefined when there is none.
 */
export function matchLocale(tag: string): Locale | undefined {
  return (
    LOCALES.find((locale) => locale.toLowerCase() === tag.toLowerCase()) ??
    LOCALES.find((locale) => language(locale) === language(tag))
  );
}

export function toLocale(tag: string): Locale {
  return matchLocale(tag) ?? SOURCE_LOCALE;
}

/**
 * Normalizes an app URL (as in `Router.url`) to `/a/b/`: no query or fragment, and the trailing
 * slash GitHub Pages redirects folders to, so links and canonical URLs never cost a redirect.
 */
export function normalizePath(url: string): string {
  const segments = url.split(/[?#]/)[0].split('/').filter(Boolean);
  return segments.length ? `/${segments.join('/')}/` : '/';
}

/** Site-absolute path of an app URL in a locale: `localizedPath('fr', '/blog')` is `/fr/blog/`. */
export function localizedPath(locale: Locale, url: string): string {
  return LOCALE_INFO[locale].base + normalizePath(url).slice(1);
}

export function absoluteUrl(locale: Locale, url: string): string {
  return SITE_ORIGIN + localizedPath(locale, url);
}

/** Locale of the running build; every locale build has its own `LOCALE_ID`. */
export const CURRENT_LOCALE = new InjectionToken<Locale>('CURRENT_LOCALE', {
  providedIn: 'root',
  factory: () => toLocale(inject(LOCALE_ID)),
});
