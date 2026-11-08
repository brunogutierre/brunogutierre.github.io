import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  absoluteUrl,
  CURRENT_LOCALE,
  Locale,
  LOCALE_INFO,
  LOCALES,
  SITE_ORIGIN,
  SOURCE_LOCALE,
} from '../i18n/locale';

export const SITE_NAME = 'Bruno Gutierre';

/** Dates and topics of a blog post, for Open Graph `article:*` tags. */
export interface PageArticle {
  /** `YYYY-MM-DD` */
  readonly published: string;
  readonly modified?: string;
  readonly tags: readonly string[];
}

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
  /** A blog post: `og:type` becomes `article`, with its dates and topics. */
  readonly article?: PageArticle;
  /** schema.org structured data, written as a JSON-LD script (see structured-data.ts). */
  readonly jsonLd?: Readonly<Record<string, unknown>>;
}

/** Document title of an inner page: `Projects · Bruno Gutierre`. */
export const pageTitle = (title: string) => `${title} · ${SITE_NAME}`;

/** Link preview image of a language: site-root/og/<locale>.jpg, rendered from scripts/og. */
export const ogImage = (locale: Locale) => `${SITE_ORIGIN}/og/${locale}.jpg`;

const OG_IMAGE_ALT = $localize`:@@seo.ogImageAlt:Bruno Gutierre, senior software engineer: Angular, TypeScript, Java and Spring Boot.`;

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
    this.meta.updateTag({ property: 'og:type', content: page.article ? 'article' : 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:locale', content: LOCALE_INFO[this.locale].og });
    this.removeAll('meta[property="og:locale:alternate"]');
    for (const locale of locales.filter((l) => l !== this.locale)) {
      this.meta.addTag({ property: 'og:locale:alternate', content: LOCALE_INFO[locale].og });
    }

    this.meta.updateTag({ property: 'og:image', content: ogImage(this.locale) });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:image:alt', content: OG_IMAGE_ALT });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    this.removeAll('meta[property^="article:"], script[type="application/ld+json"]');
    if (page.article) this.addArticleTags(page.article);
    if (page.jsonLd) this.addJsonLd(page.jsonLd);

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

  private addArticleTags({ published, modified, tags }: PageArticle): void {
    this.meta.addTag({ property: 'article:published_time', content: published });
    if (modified) this.meta.addTag({ property: 'article:modified_time', content: modified });
    for (const tag of tags) this.meta.addTag({ property: 'article:tag', content: tag });
  }

  private addJsonLd(data: Readonly<Record<string, unknown>>): void {
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    // "<" escaped, so no text in the data can close the script element
    script.textContent = JSON.stringify(data).replaceAll('<', '\\u003c');
    this.document.head.appendChild(script);
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
