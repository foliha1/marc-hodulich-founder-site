// Ghost Content API proxy for the Editorial page.
// Secrets: GHOST_CONTENT_API_KEY, GHOST_API_URL (never returned to the client).
// Body: { action: "list" } or { slug: "post-slug" }
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const CACHE_TTL_MS = 120_000
const cache = new Map<string, { at: number; body: unknown }>()

interface GhostPost {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  custom_excerpt?: string | null
  html?: string | null
  feature_image?: string | null
  published_at?: string | null
  reading_time?: number | null
  meta_description?: string | null
  primary_author?: { name?: string; profile_image?: string | null } | null
  tags?: Array<{ name: string; visibility?: string }>
}

function normalize(p: GhostPost, withHtml: boolean) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title || 'Untitled',
    excerpt: (p.custom_excerpt || p.excerpt || '').trim(),
    featured_image: p.feature_image ?? null,
    published_at: p.published_at ?? null,
    author: p.primary_author?.name
      ? { name: p.primary_author.name, avatar: p.primary_author.profile_image ?? null }
      : null,
    tags: (p.tags ?? []).filter((t) => t.visibility !== 'internal').map((t) => t.name),
    reading_time: p.reading_time ?? null,
    ...(withHtml ? { content_html: p.html || '', meta_description: p.meta_description ?? null } : {}),
  }
}

class HttpError extends Error {
  constructor(public status: number, message: string) { super(message) }
}

async function ghost(path: string, params: Record<string, string>) {
  const key = Deno.env.get('GHOST_CONTENT_API_KEY')
  const base = Deno.env.get('GHOST_API_URL')?.replace(/\/+$/, '')
  if (!key || !base) throw new HttpError(500, 'Ghost is not configured.')
  const qs = new URLSearchParams({ key, include: 'tags,authors', ...params })
  const res = await fetch(`${base}/ghost/api/content${path}?${qs}`, {
    headers: { 'Accept-Version': 'v5.0' },
  })
  if (res.status === 404) throw new HttpError(404, 'Article not found.')
  if (!res.ok) {
    console.error('Ghost upstream error', res.status, (await res.text().catch(() => '')).slice(0, 300))
    throw new HttpError(502, 'Failed to reach Ghost.')
  }
  return res.json()
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=120' },
  })

async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.body as T
  const body = await fn()
  cache.set(key, { at: Date.now(), body })
  return body
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    let slug: string | undefined
    if (req.method === 'GET') {
      slug = new URL(req.url).searchParams.get('slug') ?? undefined
    } else {
      const body = await req.json().catch(() => ({}))
      if (typeof body?.slug === 'string' && body.slug.trim()) slug = body.slug.trim()
      else if (body?.action !== undefined && body.action !== 'list') return json({ error: 'Invalid request body.' }, 400)
    }

    if (slug !== undefined) {
      if (!/^[a-z0-9](?:[a-z0-9-]{0,198}[a-z0-9])?$/i.test(slug)) return json({ error: 'Invalid slug.' }, 400)
      const post = await cached(`post:${slug}`, async () => {
        const data = await ghost(`/posts/slug/${encodeURIComponent(slug!)}/`, {})
        if (!data.posts?.[0]) throw new HttpError(404, 'Article not found.')
        return normalize(data.posts[0], true)
      })
      return json({ data: post })
    }

    const list = await cached('list', async () => {
      const data = await ghost('/posts/', { limit: '50', order: 'published_at desc' })
      return (data.posts ?? []).map((p: GhostPost) => normalize(p, false))
    })
    return json({ data: list })
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status)
    console.error('ghost-posts error', e)
    return json({ error: 'Failed to fetch Ghost content.' }, 502)
  }
})
