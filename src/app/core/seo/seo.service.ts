import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  absoluteUrl,
  CURRENT_LOCALE,
  Locale,
  LOCALE_INFO,
  LOCALES,
  SOURCE_LOCALE,
} from '../i18n/locale';

export const SITE_NAME = 'Bruno Gutierre';

/** Metadata of a page, declared in its route `data.seo`. */
export interface PageSeo {
  /** Full document title; see {@link pageTitle}. */
  readonly title: string;
  readonly description: string;
  /** Kept out of search results, with no canonical or language alternates (the 404 page). */
  readonly noindex?: boolean;
  /**
   * Languages the page exists in, when not all of them: a blog post may not be translated.
   * Language alternates only point to these.
   */
  readonly locales?: readonly Locale[];
}

/** Document title of an inner page: `Projects · Bruno Gutierre`. */
export const pageTitle = (title: string) => `${title} · ${SITE_NAME}`;

/**
 * Writes the head metadata of the current page. It runs during prerendering, so every static
 * HTML file ships its own title, description, canonical URL, hreflang alternates and Open
 * Graph tags; on the client it keeps them in sync after in-app navigation.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly locale = inject(CURRENT_LOCALE);

  /** @param url app URL of the page, as in `Router.url` (no locale prefix). */
  apply(url: string, page: PageSeo): void {
    const locales = page.locales ?? LOCALES;
    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:locale', content: LOCALE_INFO[this.locale].og });
    this.removeAll('meta[property="og:locale:alternate"]');
    for (const locale of locales.filter((l) => l !== this.locale)) {
      this.meta.addTag({ property: 'og:locale:alternate', content: LOCALE_INFO[locale].og });
    }

    this.removeAll('link[rel="canonical"], link[rel="alternate"][hreflang]');
    if (page.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex' });
      this.meta.removeTag('property="og:url"');
      return;
    }
    this.meta.removeTag('name="robots"');
    const canonical = absoluteUrl(this.locale, url);
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.addLink({ rel: 'canonical', href: canonical });
    for (const locale of locales) {
      this.addLink({ rel: 'alternate', hreflang: locale, href: absoluteUrl(locale, url) });
    }
    // For visitors in any other language: English, or the first version there is.
    const fallback = locales.includes(SOURCE_LOCALE) ? SOURCE_LOCALE : locales[0];
    this.addLink({ rel: 'alternate', hreflang: 'x-default', href: absoluteUrl(fallback, url) });
  }

  private addLink(attributes: Record<string, string>): void {
    const link = this.document.createElement('link');
    for (const [name, value] of Object.entries(attributes)) {
      link.setAttribute(name, value);
    }
    this.document.head.appendChild(link);
  }

  private removeAll(selector: string): void {
    this.document.head.querySelectorAll(selector).forEach((element) => element.remove());
  }
}
