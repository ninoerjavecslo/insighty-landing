/**
 * Portable Text → HTML renderer for Astro (no React required).
 *
 * Uses @portabletext/to-html under the hood.
 * The output targets the `.blog-content` CSS class defined in src/styles/common.css,
 * which styles h2, h3, h4, p, ul, ol, strong, hr, a, blockquote, etc.
 */

import { toHTML, uriLooksSafe } from '@portabletext/to-html'
import type { PortableTextBlock } from './sanity'
import { urlFor } from './sanity'

/**
 * Convert a Sanity Portable Text body array to an HTML string.
 * Safe to call in Astro frontmatter (server-side only).
 */
export function portableTextToHtml(blocks: PortableTextBlock[] | undefined | null): string {
  if (!blocks || blocks.length === 0) return ''

  return toHTML(blocks as Parameters<typeof toHTML>[0], {
    components: {
      // ── Block-level elements ──────────────────────────────────────
      block: {
        normal: ({ children }) => `<p>${children}</p>`,
        h2: ({ children, value }) => `<h2 id="${slugify(textFromChildren(value))}">${children}</h2>`,
        h3: ({ children, value }) => `<h3 id="${slugify(textFromChildren(value))}">${children}</h3>`,
        h4: ({ children, value }) => `<h4 id="${slugify(textFromChildren(value))}">${children}</h4>`,
        blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
      },

      // ── List wrappers ─────────────────────────────────────────────
      list: {
        bullet: ({ children }) => `<ul>${children}</ul>`,
        number: ({ children }) => `<ol>${children}</ol>`,
      },
      listItem: {
        bullet: ({ children }) => `<li>${children}</li>`,
        number: ({ children }) => `<li>${children}</li>`,
      },

      // ── Inline marks ──────────────────────────────────────────────
      marks: {
        strong: ({ children }) => `<strong>${children}</strong>`,
        em: ({ children }) => `<em>${children}</em>`,
        code: ({ children }) => `<code>${children}</code>`,
        link: ({ children, value }) => {
          const href = value?.href ?? ''
          const safe = uriLooksSafe(href)
          if (!safe) return children as string
          const target = value?.blank ? ' target="_blank" rel="noopener noreferrer"' : ''
          return `<a href="${href}"${target}>${children}</a>`
        },
      },

      // ── Block types ───────────────────────────────────────────────
      types: {
        image: ({ value }) => {
          if (!value?.asset) return ''
          const url = urlFor(value).width(1200).auto('format').url()
          const alt = value.alt ? ` alt="${escapeAttr(value.alt)}"` : ' alt=""'
          const caption = value.caption
            ? `<figcaption>${escapeHtml(value.caption)}</figcaption>`
            : ''
          return `<figure><img src="${url}"${alt} loading="lazy" decoding="async" />${caption}</figure>`
        },
      },
    },
  })
}

/**
 * Extract heading items for the Table of Contents from a Portable Text body.
 * Returns only h2 and h3 blocks.
 */
export function extractTocHeadings(
  blocks: PortableTextBlock[] | undefined | null,
): Array<{ id: string; label: string; depth: number }> {
  if (!blocks) return []

  return blocks
    .filter(b => b._type === 'block' && (b.style === 'h2' || b.style === 'h3'))
    .map(b => {
      const text = textFromChildren(b)
      return {
        id: slugify(text),
        label: text,
        depth: b.style === 'h2' ? 2 : 3,
      }
    })
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function textFromChildren(block: PortableTextBlock): string {
  return (block.children ?? []).map(c => c.text ?? '').join('')
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}
