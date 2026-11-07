import Shiki from '@shikijs/markdown-it';
import MarkdownIt, { type Token } from 'markdown-it';
import anchor from 'markdown-it-anchor';
import type { ShikiTransformer } from 'shiki';
import githubLight from 'shiki/themes/github-light-default.mjs';

/**
 * Languages code fences may use (their aliases work too: ts, sh, yml…). A fence in any other
 * language fails the build instead of quietly losing its colors. `text` needs no entry.
 */
export const CODE_LANGUAGES = [
  'bash',
  'css',
  'diff',
  'html',
  'java',
  'javascript',
  'json',
  'kotlin',
  'markdown',
  'python',
  'scss',
  'sql',
  'typescript',
  'yaml',
] as const;

/** "Olá, é você?" → "ola-e-voce": heading ids that stay readable in any URL. */
export function slugify(text: string): string {
  const slug = text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'section';
}

/** Minutes to read the prose at 200 words a minute; code blocks are skimmed, so not counted. */
export function readingMinutes(markdown: string): number {
  const prose = markdown.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1/gm, ' ');
  const words = prose.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  return Math.max(1, Math.round(words / 200));
}

/** A `##` or `###` heading, for the table of contents. Same shape as `TocEntry` in the app. */
export interface TocEntry {
  readonly level: 2 | 3;
  readonly id: string;
  readonly text: string;
}

export interface RenderedPost {
  readonly html: string;
  readonly toc: readonly TocEntry[];
}

/**
 * Code colors. The page gives code blocks their background (`--surface-2`), and on it two colors
 * of the light theme fall short of 4.5:1: they are swapped for darker ones from GitHub's palette.
 */
const THEMES = {
  light: { ...githubLight, colorReplacements: { '#6e7781': '#59636e', '#8250df': '#6639ba' } },
  dark: 'github-dark-default',
} as const;

/** Drops the theme backgrounds from `<pre>`: the site styles set it, in both themes. */
const noBackground: ShikiTransformer = {
  name: 'site:no-background',
  pre(node) {
    node.properties['style'] = String(node.properties['style'] ?? '')
      .split(';')
      .filter((rule) => !/^(background-color|--shiki-(light|dark)-bg):/.test(rule))
      .join(';');
  },
};

function tableOfContents(tokens: readonly Token[]): TocEntry[] {
  return tokens.flatMap((token, i) => {
    if (token.type !== 'heading_open' || (token.tag !== 'h2' && token.tag !== 'h3')) return [];
    const text = (tokens[i + 1].children ?? [])
      .filter((child) => child.type === 'text' || child.type === 'code_inline')
      .map((child) => child.content)
      .join('');
    return [{ level: token.tag === 'h2' ? 2 : 3, id: String(token.attrGet('id')), text }];
  });
}

/**
 * Builds the Markdown → HTML function for posts:
 * - raw HTML in a post is escaped, never rendered (`html: false`), and markdown-it drops
 *   `javascript:` and similar links, so the output is safe to insert as is;
 * - `##` and `###` headings get ids, link to themselves and make the table of contents;
 * - code is highlighted at build time with `light-dark()` colors, so it follows the site theme
 *   without any highlighter in the browser. Each block sits in a `.code-block` with a head that
 *   shows its language and, in the browser, gets a copy button.
 */
export async function createRenderer(): Promise<(markdown: string) => RenderedPost> {
  const md = MarkdownIt({ html: false });
  md.use(anchor, {
    level: [2, 3],
    slugify,
    permalink: anchor.permalink.headerLink({ safariReaderFix: true }),
  });
  md.use(
    await Shiki({
      themes: THEMES,
      langs: [...CODE_LANGUAGES],
      defaultColor: 'light-dark()',
      transformers: [noBackground],
    }),
  );
  const fence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (tokens, idx, ...rest) => {
    const lang = tokens[idx].info.trim().split(/\s+/)[0];
    const label = lang ? `<span class="code-lang">${md.utils.escapeHtml(lang)}</span>` : '';
    const code = fence(tokens, idx, ...rest);
    return `<div class="code-block"><div class="code-head">${label}</div>${code}</div>\n`;
  };

  return (markdown) => {
    const env = {};
    const tokens = md.parse(markdown, env);
    const h1 = tokens.find((token) => token.type === 'heading_open' && token.tag === 'h1');
    if (h1) {
      const line = (h1.map?.[0] ?? 0) + 1;
      throw new Error(`Line ${line} of the body: start headings at ##, the title is the page's h1`);
    }
    return { html: md.renderer.render(tokens, md.options, env), toc: tableOfContents(tokens) };
  };
}
