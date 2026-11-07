import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import {
  CODE_LANGUAGES,
  createRenderer,
  type RenderedPost,
  readingMinutes,
  slugify,
} from './markdown.mts';

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
  let renderPost: (markdown: string) => RenderedPost;
  const render = (markdown: string) => renderPost(markdown).html;
  before(async () => {
    renderPost = await createRenderer();
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

  it('lists ## and ### headings in the table of contents, as plain text', () => {
    const { toc } = renderPost('## Visão *geral*\n\n### The `inject()` call\n\n#### Small');

    assert.deepEqual(toc, [
      { level: 2, id: 'visao-geral', text: 'Visão geral' },
      { level: 3, id: 'the-inject-call', text: 'The inject() call' },
    ]);
  });

  it('rejects a level-one heading: the title already is the page h1', () => {
    assert.throws(() => render('Intro\n\n# Title'), /Line 3 of the body/);
  });

  it('highlights code with colors for both themes, leaving the background to the page', () => {
    const html = render('```ts\nconst answer = 42;\n```');

    assert.match(html, /<pre class="shiki shiki-themes github-light-default github-dark-default"/);
    assert.match(html, /color:light-dark\(#[0-9A-F]{6}, #[0-9A-F]{6}\)/i);
    assert.match(html, /class="language-ts"/);
    assert.doesNotMatch(html, /background|-bg:/);
  });

  it('puts each code block under a head that names its language', () => {
    assert.match(
      render('```ts\nconst a = 1;\n```'),
      /^<div class="code-block"><div class="code-head"><span class="code-lang">ts<\/span><\/div><pre /,
    );
    assert.match(
      render('```\nplain\n```'),
      /^<div class="code-block"><div class="code-head"><\/div><pre /,
    );
  });

  it('keeps every code color at 4.5:1 or more on the code background', () => {
    const fences = CODE_LANGUAGES.map((lang) => `\`\`\`${lang}\n${CODE_SAMPLE}\n\`\`\``);
    const html = render(fences.join('\n\n'));
    const colors = [...html.matchAll(/light-dark\((#[0-9a-f]{6}), (#[0-9a-f]{6})\)/gi)];

    assert.ok(colors.length > 50);
    for (const [, light, dark] of colors) {
      assert.ok(contrast(light, CODE_BACKGROUND.light) >= 4.5, `${light} on light code`);
      assert.ok(contrast(dark, CODE_BACKGROUND.dark) >= 4.5, `${dark} on dark code`);
    }
  });

  it('fails on a code language it does not know', () => {
    assert.throws(() => render('```cobol\nDISPLAY "HI".\n```'), /cobol/);
  });

  it('renders tables, as posts may compare things', () => {
    assert.match(render('| a | b |\n|---|---|\n| 1 | 2 |'), /<table>/);
  });
});

/** `--surface-2` in src/styles/_tokens.scss, the background of code blocks. */
const CODE_BACKGROUND = { light: '#e8f0eb', dark: '#173033' };

/** Comments, strings, numbers, keywords, types, decorators: one line of each, in any language. */
const CODE_SAMPLE = `// line comment
# hash comment
/* block comment */ -- sql comment
@Component({ selector: 'app-x' }) export class Answer<T> extends Base implements Api {
  private readonly value: number = 0x2a; static f(x?: string): Promise<void> { return null; }
}
def run(self, n: int = 1) -> str: return f"{n!r}" if n else 'none'
SELECT id, COUNT(*) AS total FROM posts WHERE draft = false GROUP BY id;
<a href="/blog/" class='link' data-x>Text &amp; more</a>
.post > h2:hover { color: #fff !important; margin: calc(1px + 2em) auto; $gap: 4px; }
export FOO="bar $HOME" && npm run build | grep -v x > out.txt
key: value  # yaml
  - item: [true, null, 1.5e3]
+ added line
- removed line
**bold** _em_ [link](https://example.com) > quote`;

function contrast(a: string, b: string): number {
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}
