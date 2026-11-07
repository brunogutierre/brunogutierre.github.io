import { parse } from 'yaml';
import { z } from 'zod';

/** Lowercase ASCII words joined by hyphens: post folders and tags. */
export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** What a post declares about itself. Unknown keys are errors, so a typo never goes unnoticed. */
export const frontmatterSchema = z
  .strictObject({
    title: z.string().trim().min(1),
    /** Search and link previews show about 160 characters. */
    description: z.string().trim().min(1).max(200),
    date: z.iso.date(),
    updated: z.iso.date().optional(),
    tags: z
      .array(z.string().regex(SLUG, 'Use lowercase words joined by hyphens'))
      .max(5)
      .default([]),
    /** Drafts are rendered by `npm start` but left out of production builds. */
    draft: z.boolean().default(false),
  })
  .refine((post) => !post.updated || post.updated >= post.date, {
    message: 'Must not be before date',
    path: ['updated'],
  });

export type Frontmatter = z.infer<typeof frontmatterSchema>;

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/**
 * Splits a post into its YAML frontmatter (between `---` lines, at the very top) and its Markdown
 * body, and validates the frontmatter. Throws one error listing every problem.
 */
export function parsePost(source: string): { frontmatter: Frontmatter; body: string } {
  const text = source.replace(/^\uFEFF/, '');
  const fence = FENCE.exec(text);
  if (!fence) throw new Error('Missing frontmatter: start the file with a block between --- lines');
  const result = frontmatterSchema.safeParse(parse(fence[1]) ?? {});
  if (!result.success) throw new Error(z.prettifyError(result.error));
  return { frontmatter: result.data, body: text.slice(fence[0].length) };
}
