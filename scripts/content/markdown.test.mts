import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import { createRenderer, readingMinutes, slugify } from './markdown.mts';

describe('slugify', () => {
  it('keeps ASCII letters and digits, and drops accents', () => {
    assert.equal(slugify('Olá, é você?'), 'ola-e-voce');
    assert.equal(slugify('Angular 22 & SSG'), 'angular-22-ssg');
    assert.equal(slugify('Où est l’écran ?'), 'ou-est-l-ecran');
  });

  it('never returns an empty id', () => {
    assert.equal(slugify('→ ←'), 'section');
  });
});

describe('readingMinutes', () => {
  it('counts prose at 200 words a minute, at least one', () => {
    assert.equal(readingMinutes('word '.repeat(500)), 3);
    assert.equal(readingMinutes('Hi.'), 1);
  });

  it('leaves code blocks out', () => {
    const code = '```ts\n' + 'const x = 1;\n'.repeat(400) + '```\n';
    assert.equal(readingMinutes(`${'word '.repeat(200)}\n\n${code}`), 1);
  });
});

describe('createRenderer', () => {
  let render: (markdown: string) => string;
  before(async () => {
    render = await createRenderer();
  });

  it('escapes raw HTML instead of rendering it', () => {
    const html = render('Hello <script>alert(1)</script> <img src=x onerror=alert(1)>');

    assert.doesNotMatch(html, /<script|<img/);
    assert.match(html, /&lt;script&gt;/);
  });

  it('drops javascript: links', () => {
    assert.doesNotMatch(render('[click](javascript:alert(1))'), /href/);
  });

  it('gives ## and ### headings readable, unique ids that link to themselves', () => {
    const html = render('## Visão geral\n\n### Détails\n\n## Visão geral\n\n#### Small');

    assert.match(
      html,
      /<h2 id="visao-geral" tabindex="-1"><a class="header-anchor" href="#visao-geral">/,
    );
    assert.match(html, /<h3 id="details"/);
    assert.match(html, /<h2 id="visao-geral-1"/);
    assert.match(html, /<h4>Small<\/h4>/);
  });

  it('rejects a level-one heading: the title already is the page h1', () => {
    assert.throws(() => render('Intro\n\n# Title'), /Line 3 of the body/);
  });

  it('highlights code with colors for both themes', () => {
    const html = render('```ts\nconst answer = 42;\n```');

    assert.match(html, /<pre class="shiki shiki-themes github-light github-dark"/);
    assert.match(html, /color:light-dark\(#[0-9A-F]{6}, #[0-9A-F]{6}\)/i);
    assert.match(html, /class="language-ts"/);
  });

  it('fails on a code language it does not know', () => {
    assert.throws(() => render('```cobol\nDISPLAY "HI".\n```'), /cobol/);
  });

  it('renders tables, as posts may compare things', () => {
    assert.match(render('| a | b |\n|---|---|\n| 1 | 2 |'), /<table>/);
  });
});
