// StoryChief Content Delivery API proxy.
// Fetches published articles for the Editorial page, normalized to a stable
// JSON shape so the frontend stays decoupled from StoryChief's raw schema.
//
// Secrets (available as env vars, never returned to the client):
//   STORYCHIEF_CDA_TOKEN       — Bearer token (scope: content:read)
//   STORYCHIEF_DESTINATION_ID  — Headless Website destination id
//
// Request shapes (supports POST JSON body from supabase.functions.invoke,
// and GET ?slug=<slug> for direct testing):
//   { action: "list" }          -> list of published posts
//   { slug: "my-post" }         -> single post by slug
//   GET ?slug=my-post           -> single post by slug
//   GET (no params)             -> list of published posts

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const BASE_URL = 'https://delivery-api.storychief.io/1.0'
const CACHE_TTL_MS = 120_000 // 2 minutes

interface CacheEntry {
  at: number
  body: unknown
}
const cache = new Map<string, CacheEntry>()

interface SCFeatureImage {
  url?: string
  alt?: string | null
  sizes?: { regular?: string; large?: string; full?: string }
}

interface SCAuthor {
  data?: {
    first_name?: string | null
    last_name?: string | null
    profile_picture?: string | null
  } | null
}

interface SCTag {
  data?: Array<{ id: number | string; name: string; slug: string }>
}

interface SCArticle {
  id: number | string
  title: string
  slug: string
  excerpt?: string | null
  html?: string | null
  feature_image?: SCFeatureImage | null
  published_at?: string | null
  seo_description?: string | null
  author?: SCAuthor
  tags?: SCTag
}

interface NormalizedListItem {
  id: string
  slug: string
  title: string
  excerpt: string
  featured_image: string | null
  published_at: string | null
  author: { name: string; avatar: string | null } | null
  tags: string[]
  reading_time: number | null
}

interface NormalizedPost extends NormalizedListItem {
  content_html: string
  meta_description: string | null
}

function authorName(a: SCArticle['author']): string {
  const d = a?.data
  if (!d) return ''
  return [d.first_name, d.last_name].filter(Boolean).join(' ').trim()
}

function pickFeatureImage(img: SCFeatureImage | null | undefined): string | null {
  if (!img) return null
  return img.url || img.sizes?.large || img.sizes?.regular || img.sizes?.full || null
}

function tagNames(t: SCArticle['tags']): string[] {
  return (t?.data ?? []).map((x) => x.name).filter(Boolean)
}

function estimateReadingTime(html: string | null | undefined): number | null {
  if (!html) return null
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!text) return null
  const words = text.split(' ').length
  return Math.max(1, Math.round(words / 200))
}

function normalizeListItem(a: SCArticle): NormalizedListItem {
  return {
    id: String(a.id),
    slug: a.slug,
    title: a.title || 'Untitled',
    excerpt: (a.excerpt || '').trim(),
    featured_image: pickFeatureImage(a.featured_image),
    published_at: a.published_at ?? null,
    author: a.author?.data
      ? { name: authorName(a.author), avatar: a.author.data.profile_picture ?? null }
      : null,
    tags: tagNames(a.tags),
    reading_time: estimateReadingTime(a.html),
  }
}

function normalizePost(a: SCArticle): NormalizedPost {
  return {
    ...normalizeListItem(a),
    content_html: a.html || '',
    meta_description: a.seo_description ?? null,
  }
}

async function fetchStoryChief(path: string): Promise<unknown> {
  const token = Deno.env.get('STORYCHIEF_CDA_TOKEN')
  const destinationId = Deno.env.get('STORYCHIEF_DESTINATION_ID')
  if (!token) throw new Error('STORYCHIEF_CDA_TOKEN is not configured.')
  if (!destinationId) throw new Error('STORYCHIEF_DESTINATION_ID is not configured.')

  const url = `${BASE_URL}/${destinationId}${path}`
  console.log('storychief request:', JSON.stringify({ path, hasToken: !!token, destinationIdLength: destinationId.length }))
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })

  console.log('storychief upstream status:', res.status)
  if (res.status === 404) {
    const detail = await res.text().catch(() => '')
    console.log('storychief 404 body:', detail.slice(0, 500))
    throw new HttpError(404, `Article not found. [upstream=${res.status}] ${detail.slice(0, 300)}`)
  }
  if (res.status === 429) {
    throw new HttpError(429, 'StoryChief rate limit reached. Please try again shortly.')
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new HttpError(502, `StoryChief request failed (${res.status}). ${detail.slice(0, 200)}`)
  }
  return res.json()
}

class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=120, s-maxage=120',
      ...extra,
    },
  })
}

function errorJson(message: string, status: number) {
  return json({ error: message }, status)
}

function validSlug(slug: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{0,198}[a-z0-9])?$/i.test(slug)
}

async function getList(): Promise<NormalizedListItem[]> {
  const cacheKey = 'list'
  const hit = cache.get(cacheKey)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return hit.body as NormalizedListItem[]
  }

  const includes = ['tags', 'categories', 'author']
    .map((i) => `includes[]=${i}`)
    .join('&')
  const path = `/articles?count=50&page=1&sort_by=published&sort_order=desc&${includes}`
  const payload = (await fetchStoryChief(path)) as { data?: SCArticle[] }
  const items = (payload.data ?? []).map(normalizeListItem)

  cache.set(cacheKey, { at: Date.now(), body: items })
  return items
}

async function getPost(slug: string): Promise<NormalizedPost> {
  const cacheKey = `post:${slug}`
  const hit = cache.get(cacheKey)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return hit.body as NormalizedPost
  }

  const includes = ['tags', 'categories', 'author']
    .map((i) => `includes[]=${i}`)
    .join('&')
  const path = `/articles/slug/${encodeURIComponent(slug)}?${includes}`
  const payload = (await fetchStoryChief(path)) as { data?: SCArticle }
  if (!payload.data) throw new HttpError(404, 'Article not found.')

  const post = normalizePost(payload.data)
  cache.set(cacheKey, { at: Date.now(), body: post })
  return post
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let action: 'list' | 'single' = 'list'
    let slug: string | undefined

    if (req.method === 'GET') {
      const url = new URL(req.url)
      slug = url.searchParams.get('slug') ?? undefined
      action = slug ? 'single' : 'list'
    } else {
      // POST from supabase.functions.invoke
      const body = await req.json().catch(() => ({}))
      if (typeof body?.slug === 'string' && body.slug.trim()) {
        slug = body.slug.trim()
        action = 'single'
      } else if (body?.action === 'list' || body?.action === undefined) {
        action = 'list'
      } else {
        return errorJson('Invalid request body.', 400)
      }
    }

    if (action === 'single') {
      if (!slug || !validSlug(slug)) {
        return errorJson('Invalid slug.', 400)
      }
      const post = await getPost(slug)
      return json({ data: post })
    }

    const items = await getList()
    return json({ data: items })
  } catch (e) {
    if (e instanceof HttpError) {
      return errorJson(e.message, e.status)
    }
    console.error('storychief-posts error:', e)
    return errorJson('Failed to fetch StoryChief content.', 502)
  }
})
