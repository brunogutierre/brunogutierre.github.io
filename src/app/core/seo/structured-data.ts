import { PROFILE } from '../../../content/profile';
import { PostSummary } from '../blog/post';
import { absoluteUrl, Locale, SITE_ORIGIN } from '../i18n/locale';
import { ogImage } from './seo.service';

/** Blog posts are licensed CC BY 4.0 (the site code is MIT). */
export const POST_LICENSE = 'https://creativecommons.org/licenses/by/4.0/';

/** One id for the person in every language, so search engines see a single author. */
const PERSON_ID = `${SITE_ORIGIN}/#person`;

/** schema.org `Person` for the home page. */
export function personJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PROFILE.name,
    jobTitle: PROFILE.jobTitle[locale],
    description: PROFILE.role[locale],
    url: absoluteUrl(locale, '/'),
    image: `${SITE_ORIGIN}/images/bruno-gutierre-480.webp`,
    sameAs: [PROFILE.links.github, PROFILE.links.linkedin],
  };
}

/** schema.org `BlogPosting` for a post page. */
export function blogPostingJsonLd(post: PostSummary, locale: Locale) {
  const url = absoluteUrl(locale, `/blog/${post.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: locale,
    url,
    mainEntityOfPage: url,
    image: ogImage(locale),
    keywords: post.tags,
    author: { '@type': 'Person', '@id': PERSON_ID, name: PROFILE.name, url: SITE_ORIGIN + '/' },
    license: POST_LICENSE,
  };
}
