import Shiki from '@shikijs/markdown-it';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';

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

/**
 * Builds the Markdown → HTML function for posts:
 * - raw HTML in a post is escaped, never rendered (`html: false`), and markdown-it drops
 *   `javascript:` and similar links, so the output is safe to insert as is;
 * - `##` and `###` headings get ids and link to themselves;
 * - code is highlighted at build time with `light-dark()` colors, so it follows the site theme
 *   without any highlighter in the browser.
 */
export async function createRenderer(): Promise<(markdown: string) => string> {
  const md = MarkdownIt({ html: false });
  md.use(anchor, {
    level: [2, 3],
    slugify,
    permalink: anchor.permalink.headerLink({ safariReaderFix: true }),
  });
  md.use(
    await Shiki({
      themes: { light: 'github-light', dark: 'github-dark' },
      langs: [...CODE_LANGUAGES],
      defaultColor: 'light-dark()',
    }),
  );

  return (markdown) => {
    const env = {};
    const tokens = md.parse(markdown, env);
    const h1 = tokens.find((token) => token.type === 'heading_open' && token.tag === 'h1');
    if (h1) {
      const line = (h1.map?.[0] ?? 0) + 1;
      throw new Error(`Line ${line} of the body: start headings at ##, the title is the page's h1`);
    }
    return md.renderer.render(tokens, md.options, env);
  };
}
