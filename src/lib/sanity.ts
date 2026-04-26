import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// During build without env vars set, use a placeholder projectId.
// Actual API calls to Sanity will only succeed when PUBLIC_SANITY_PROJECT_ID is set.
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
})

/**
 * Safe fetch wrapper that returns an empty result on error.
 * Used during builds where Sanity credentials are not configured.
 */
export async function safeFetch<T>(query: string, params?: Record<string, unknown>, fallback?: T): Promise<T> {
  try {
    return await client.fetch<T>(query, params)
  } catch {
    return (fallback !== undefined ? fallback : ([] as unknown as T))
  }
}

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SanityPost {
  _id: string
  title: string
  slug: { current: string }
  description: string
  pubDate: string
  category: 'Agency Ops' | 'Revenue' | 'Projects' | 'Product'
  readTime: number
  featured: boolean
  thumbnail?: SanityImageSource
  body?: PortableTextBlock[]
}

export interface PortableTextBlock {
  _type: string
  _key: string
  style?: string
  children?: Array<{
    _type: string
    _key: string
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _key: string
    _type: string
    href?: string
    blank?: boolean
  }>
  listItem?: string
  level?: number
  asset?: { _ref: string; _type: string }
  alt?: string
  caption?: string
}

// ─── GROQ Queries ─────────────────────────────────────────────────────────────

/**
 * Fetch all posts ordered by pubDate descending.
 * Used by blog/index.astro.
 */
export const postsQuery = `*[_type == "post"] | order(pubDate desc) {
  _id,
  title,
  slug,
  description,
  pubDate,
  category,
  readTime,
  featured,
  thumbnail
}`

/**
 * Fetch a single post by slug.
 * Used by blog/[slug].astro.
 */
export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  pubDate,
  category,
  readTime,
  featured,
  thumbnail,
  body[] {
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  }
}`

/**
 * Fetch all slugs — used in getStaticPaths.
 */
export const allSlugsQuery = `*[_type == "post"] { "slug": slug.current }`

/**
 * Fetch related posts: same category first, then by date, excluding current.
 */
export const relatedPostsQuery = `*[_type == "post" && slug.current != $slug] | order(
  category == $category desc,
  pubDate desc
)[0...3] {
  _id,
  title,
  slug,
  description,
  pubDate,
  category,
  readTime,
  featured,
  thumbnail
}`
