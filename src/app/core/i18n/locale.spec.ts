import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  absoluteUrl,
  CURRENT_LOCALE,
  localizedPath,
  matchLocale,
  normalizePath,
  toLocale,
} from './locale';

describe('matchLocale', () => {
  it('matches exact tags case-insensitively', () => {
    expect(matchLocale('pt-BR')).toBe('pt-BR');
    expect(matchLocale('pt-br')).toBe('pt-BR');
    expect(matchLocale('fr')).toBe('fr');
  });

  it('falls back to the same language', () => {
    expect(matchLocale('en-US')).toBe('en');
    expect(matchLocale('pt')).toBe('pt-BR');
    expect(matchLocale('pt-PT')).toBe('pt-BR');
    expect(matchLocale('fr-CA')).toBe('fr');
  });

  it('returns undefined for unsupported languages', () => {
    expect(matchLocale('de-DE')).toBeUndefined();
    expect(matchLocale('')).toBeUndefined();
  });

  it('toLocale falls back to the source locale', () => {
    expect(toLocale('ja')).toBe('en');
    expect(toLocale('fr-BE')).toBe('fr');
  });
});

describe('paths', () => {
  it('normalizes to a leading and trailing slash without query or fragment', () => {
    expect(normalizePath('')).toBe('/');
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('/blog')).toBe('/blog/');
    expect(normalizePath('/blog/post-1/?ref=x#top')).toBe('/blog/post-1/');
    expect(normalizePath('blog//post-1')).toBe('/blog/post-1/');
  });

  it('prefixes each locale with its build sub-path', () => {
    expect(localizedPath('en', '/projects')).toBe('/projects/');
    expect(localizedPath('pt-BR', '/projects')).toBe('/pt/projects/');
    expect(localizedPath('fr', '/')).toBe('/fr/');
  });

  it('builds absolute URLs on the site origin', () => {
    expect(absoluteUrl('en', '/')).toBe('https://brunogutierre.github.io/');
    expect(absoluteUrl('pt-BR', '/blog')).toBe('https://brunogutierre.github.io/pt/blog/');
  });
});

describe('CURRENT_LOCALE', () => {
  it('derives the site locale from LOCALE_ID', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }] });
    expect(TestBed.inject(CURRENT_LOCALE)).toBe('pt-BR');
  });

  it('maps the default en-US LOCALE_ID to en', () => {
    expect(TestBed.inject(CURRENT_LOCALE)).toBe('en');
  });
});
