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

class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
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
  if (!token) throw new HttpError(500, 'StoryChief token is not configured.')
  if (!destinationId) throw new HttpError(500, 'StoryChief destination is not configured.')

  const url = `${BASE_URL}/${destinationId}${path}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })

  if (res.status === 404) {
    throw new HttpError(404, 'Article not found.')
  }
  if (res.status === 429) {
    throw new HttpError(429, 'StoryChief rate limit reached. Please try again shortly.')
  }
  if (!res.ok) {
    // Upstream error — log detail server-side, return a generic message.
    const detail = await res.text().catch(() => '')
    console.error('StoryChief upstream error:', res.status, detail.slice(0, 300))
    throw new HttpError(502, 'Failed to reach StoryChief.')
  }
  return res.json()
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

    // Cache invalidation, called server-side by the storychief-webhook function.
    const purgeKey = req.headers.get('x-purge-key')
    if (purgeKey) {
      const expected = Deno.env.get('STORYCHIEF_WEBHOOK_KEY')
      if (!expected || purgeKey !== expected) {
        return errorJson('Unauthorized.', 401)
      }
      cache.clear()
      return json({ purged: true })
    }

    const reqUrl = new URL(req.url)
    if (reqUrl.searchParams.get('diag') === '1') {
      const token = Deno.env.get('STORYCHIEF_CDA_TOKEN')
      const destinationId = Deno.env.get('STORYCHIEF_DESTINATION_ID')
      const target = `${BASE_URL}/${destinationId}/articles?count=10&page=1&sort_by=published&sort_order=desc`
      const res = await fetch(target, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      const text = await res.text().catch(() => '')
      return json({
        diag: {
          request_url_shape: `${BASE_URL}/{destination_id}/articles?count=10&page=1&sort_by=published&sort_order=desc`,
          base_url_used: BASE_URL,
          auth_scheme: 'Bearer',
          token_present: !!token,
          destination_id_present: !!destinationId,
          destination_id_length: destinationId?.length ?? 0,
          status: res.status,
          content_type: res.headers.get('content-type'),
          body_snippet: text.slice(0, 500),
        },
      })
    }

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
