import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CURRENT_LOCALE } from '../i18n/locale';
import { pageTitle, SeoService } from './seo.service';

describe('SeoService', () => {
  let head: HTMLHeadElement;
  let seo: SeoService;

  const attr = (selector: string, name = 'content') =>
    head.querySelector(selector)?.getAttribute(name);
  const all = (selector: string, name: string) =>
    Array.from(head.querySelectorAll(selector)).map((e) => e.getAttribute(name));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: CURRENT_LOCALE, useValue: 'pt-BR' }] });
    head = TestBed.inject(DOCUMENT).head;
    seo = TestBed.inject(SeoService);
  });

  afterEach(() => {
    head.querySelectorAll('meta, link, script').forEach((element) => element.remove());
  });

  it('writes title, description and Open Graph tags', () => {
    seo.apply('/projects', { title: pageTitle('Projetos'), description: 'Meus projetos.' });

    expect(TestBed.inject(DOCUMENT).title).toBe('Projetos · Bruno Gutierre');
    expect(attr('meta[name="description"]')).toBe('Meus projetos.');
    expect(attr('meta[property="og:title"]')).toBe('Projetos · Bruno Gutierre');
    expect(attr('meta[property="og:site_name"]')).toBe('Bruno Gutierre');
    expect(attr('meta[property="og:locale"]')).toBe('pt_BR');
    expect(all('meta[property="og:locale:alternate"]', 'content')).toEqual(['en_US', 'fr_FR']);
  });

  it('gives every page the link preview image of its language', () => {
    seo.apply('/projects', { title: 'T', description: 'D' });

    expect(attr('meta[property="og:type"]')).toBe('website');
    expect(attr('meta[property="og:image"]')).toBe('https://brunogutierre.github.io/og/pt-BR.jpg');
    expect(attr('meta[property="og:image:width"]')).toBe('1200');
    expect(attr('meta[property="og:image:alt"]')).toContain('Bruno Gutierre');
    expect(attr('meta[name="twitter:card"]')).toBe('summary_large_image');
  });

  it('describes a blog post as an article, and drops those tags on the next page', () => {
    const article = { published: '2026-11-07', modified: '2026-11-20', tags: ['angular', 'ssg'] };
    seo.apply('/blog/post', { title: 'T', description: 'D', article });

    expect(attr('meta[property="og:type"]')).toBe('article');
    expect(attr('meta[property="article:published_time"]')).toBe('2026-11-07');
    expect(attr('meta[property="article:modified_time"]')).toBe('2026-11-20');
    expect(all('meta[property="article:tag"]', 'content')).toEqual(['angular', 'ssg']);

    seo.apply('/blog', { title: 'B', description: 'B' });
    expect(head.querySelector('meta[property^="article:"]')).toBeNull();
  });

  it('writes structured data as JSON-LD that no text can break out of', () => {
    seo.apply('/', { title: 'T', description: 'D', jsonLd: { name: '</script><b>' } });
    seo.apply('/', { title: 'T', description: 'D', jsonLd: { name: 'Bruno' } });

    const scripts = head.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
    expect(JSON.parse(scripts[0].textContent ?? '')).toEqual({ name: 'Bruno' });

    seo.apply('/', { title: 'T', description: 'D', jsonLd: { name: '</script>' } });
    const text = head.querySelector('script[type="application/ld+json"]')?.textContent ?? '';
    expect(text).not.toContain('<');
    expect(JSON.parse(text)).toEqual({ name: '</script>' });
  });

  it('links the canonical URL and every language version with trailing slashes', () => {
    seo.apply('/projects?ref=home', { title: 'T', description: 'D' });

    const canonical = 'https://brunogutierre.github.io/pt/projects/';
    expect(attr('link[rel="canonical"]', 'href')).toBe(canonical);
    expect(attr('meta[property="og:url"]')).toBe(canonical);
    expect(all('link[rel="alternate"]', 'hreflang')).toEqual(['en', 'pt-BR', 'fr', 'x-default']);
    expect(all('link[rel="alternate"]', 'href')).toEqual([
      'https://brunogutierre.github.io/projects/',
      'https://brunogutierre.github.io/pt/projects/',
      'https://brunogutierre.github.io/fr/projects/',
      'https://brunogutierre.github.io/projects/',
    ]);
    expect(head.querySelector('meta[name="robots"]')).toBeNull();
  });

  it('points the alternates only to the languages the page exists in', () => {
    seo.apply('/blog/post', { title: 'T', description: 'D', locales: ['pt-BR', 'fr'] });

    expect(all('meta[property="og:locale:alternate"]', 'content')).toEqual(['fr_FR']);
    expect(all('link[rel="alternate"]', 'hreflang')).toEqual(['pt-BR', 'fr', 'x-default']);
    // no English version: x-default is the first one there is
    expect(attr('link[hreflang="x-default"]', 'href')).toBe(
      'https://brunogutierre.github.io/pt/blog/post/',
    );
  });

  it('keeps English as x-default when the page has an English version', () => {
    seo.apply('/blog/post', { title: 'T', description: 'D', locales: ['en', 'pt-BR'] });

    expect(all('link[rel="alternate"]', 'hreflang')).toEqual(['en', 'pt-BR', 'x-default']);
    expect(attr('link[hreflang="x-default"]', 'href')).toBe(
      'https://brunogutierre.github.io/blog/post/',
    );
  });

  it('replaces the tags of the previous page instead of adding more', () => {
    seo.apply('/projects', { title: 'A', description: 'A' });
    seo.apply('/blog', { title: 'B', description: 'B' });

    expect(head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(head.querySelectorAll('link[rel="alternate"]')).toHaveLength(4);
    expect(head.querySelectorAll('meta[property="og:locale:alternate"]')).toHaveLength(2);
    expect(attr('link[rel="canonical"]', 'href')).toBe('https://brunogutierre.github.io/pt/blog/');
  });

  it('marks noindex pages and drops their canonical and alternates', () => {
    seo.apply('/projects', { title: 'A', description: 'A' });
    seo.apply('/missing', { title: 'Not found', description: 'Gone', noindex: true });

    expect(attr('meta[name="robots"]')).toBe('noindex');
    expect(head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(head.querySelector('link[rel="alternate"]')).toBeNull();
    expect(head.querySelector('meta[property="og:url"]')).toBeNull();
  });
});
