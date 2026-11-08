import { postSummary } from '../blog/testing';
import { blogPostingJsonLd, personJsonLd, POST_LICENSE } from './structured-data';

describe('structured data', () => {
  it('describes the person in the language of the page, with one id for every language', () => {
    const pt = personJsonLd('pt-BR');

    expect(pt).toMatchObject({
      '@type': 'Person',
      '@id': 'https://brunogutierre.github.io/#person',
      name: 'Bruno Gutierre',
      jobTitle: 'Engenheiro de software sênior',
      url: 'https://brunogutierre.github.io/pt/',
      sameAs: ['https://github.com/brunogutierre', 'https://www.linkedin.com/in/bruno-gutierre/'],
    });
    expect(personJsonLd('fr')['@id']).toBe(pt['@id']);
  });

  it('describes a post with its dates, language, author and license', () => {
    const post = postSummary('hello', { title: 'Bonjour', date: '2026-11-07', tags: ['angular'] });

    expect(blogPostingJsonLd(post, 'fr')).toMatchObject({
      '@type': 'BlogPosting',
      headline: 'Bonjour',
      datePublished: '2026-11-07',
      dateModified: '2026-11-07',
      inLanguage: 'fr',
      url: 'https://brunogutierre.github.io/fr/blog/hello/',
      image: 'https://brunogutierre.github.io/og/fr.jpg',
      keywords: ['angular'],
      author: { '@id': 'https://brunogutierre.github.io/#person' },
      license: POST_LICENSE,
    });
    expect(blogPostingJsonLd({ ...post, updated: '2026-12-01' }, 'fr').dateModified).toBe(
      '2026-12-01',
    );
  });
});
