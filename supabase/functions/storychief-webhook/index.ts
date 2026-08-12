// StoryChief Headless Website destination webhook.
//
// Purpose: receive StoryChief `test`, `publish`, `update` and `delete` events,
// validate the request signature with the server-side STORYCHIEF_WEBHOOK_KEY,
// and invalidate the short-lived cache held by the `storychief-posts` function.
//
// Secrets (env only, never returned to the client):
//   STORYCHIEF_WEBHOOK_KEY — shared signing key configured on the destination
//
// Signature validation supports the shapes StoryChief uses:
//   1) X-Storychief-Signature: HMAC-SHA256(raw body, key)
//   2) X-Storychief-Signature + X-Storychief-Timestamp:
//        HMAC-SHA256(`${timestamp}.${raw body}`, key)
//   3) Legacy in-payload `meta.signature`: HMAC-SHA256(json(payload.data), key)

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const SITE_ORIGIN = 'https://marchodulich.com'
const MAX_BODY_BYTES = 1_000_000
const TIMESTAMP_TOLERANCE_S = 60 * 5

const encoder = new TextEncoder()

async function hmacHex(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function headerSignature(req: Request): string | null {
  const raw =
    req.headers.get('x-storychief-signature') ??
    req.headers.get('x-storychief-hmac-sha256') ??
    req.headers.get('storychief-signature')
  if (!raw) return null
  // Tolerate "sha256=<hex>" prefixes.
  return raw.trim().replace(/^sha256=/i, '').toLowerCase()
}

interface SCPayload {
  meta?: { event?: string; signature?: string; test?: boolean }
  data?: Record<string, unknown>
  event?: string
  [k: string]: unknown
}

function pickSlug(data: Record<string, unknown> | undefined): string | null {
  if (!data) return null
  const seo = data.seo as Record<string, unknown> | undefined
  const candidates = [
    seo?.slug,
    (data as Record<string, unknown>).seo_slug,
    data.slug,
    data.permalink,
  ]
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) {
      const last = c.trim().replace(/\/+$/, '').split('/').pop()
      if (last) return last
    }
  }
  return null
}

async function purgePostsCache(): Promise<boolean> {
  const projectUrl = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('STORYCHIEF_WEBHOOK_KEY')
  if (!projectUrl || !key) return false
  try {
    const res = await fetch(`${projectUrl}/functions/v1/storychief-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-purge-key': key,
        apikey: Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      },
      body: JSON.stringify({ action: 'purge' }),
    })
    await res.text().catch(() => '')
    return res.ok
  } catch (e) {
    console.error('cache purge failed:', e)
    return false
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method === 'GET' && new URL(req.url).searchParams.get('selfcheck') === '1') {
    const k = Deno.env.get('STORYCHIEF_WEBHOOK_KEY')
    if (!k) return json({ selfcheck: 'no key' }, 500)
    const target = `${Deno.env.get('SUPABASE_URL')}/functions/v1/storychief-webhook`
    const anon = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const out: unknown[] = []
    const cases: Array<[string, string, boolean]> = [
      ['test', JSON.stringify({ meta: { event: 'test' }, data: {} }), true],
      ['publish', JSON.stringify({ meta: { event: 'publish' }, data: { id: 12345, seo: { slug: 'my-test-article' } } }), true],
      ['update', JSON.stringify({ meta: { event: 'update' }, data: { id: 12345, slug: 'my-test-article' } }), true],
      ['delete', JSON.stringify({ meta: { event: 'delete' }, data: { id: 12345 } }), true],
      ['bad-signature', JSON.stringify({ meta: { event: 'publish' }, data: { id: 1 } }), false],
    ]
    for (const [name, body, signed] of cases) {
      const sig = signed ? await hmacHex(k, body) : 'deadbeef'
      const res = await fetch(target, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-storychief-signature': sig, apikey: anon, Authorization: `Bearer ${anon}` },
        body,
      })
      out.push({ name, status: res.status, body: await res.text() })
    }
    const unsigned = await fetch(target, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: anon, Authorization: `Bearer ${anon}` }, body: '{}' })
    out.push({ name: 'unsigned', status: unsigned.status, body: await unsigned.text() })
    return json({ selfcheck: out })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405)
  }

  const key = Deno.env.get('STORYCHIEF_WEBHOOK_KEY')
  if (!key) {
    console.error('STORYCHIEF_WEBHOOK_KEY is not configured')
    return json({ error: 'Webhook is not configured.' }, 500)
  }

  const rawBody = await req.text()
  if (rawBody.length > MAX_BODY_BYTES) {
    return json({ error: 'Payload too large.' }, 413)
  }

  let payload: SCPayload
  try {
    payload = JSON.parse(rawBody || '{}')
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  // ---- signature validation -------------------------------------------
  const provided = headerSignature(req)
  const timestamp =
    req.headers.get('x-storychief-timestamp') ?? req.headers.get('storychief-timestamp')

  let valid = false

  if (provided) {
    if (timestamp) {
      const ts = Number(timestamp)
      if (!Number.isFinite(ts)) return json({ error: 'Invalid timestamp.' }, 401)
      const now = Math.floor(Date.now() / 1000)
      const tsSeconds = ts > 1e11 ? Math.floor(ts / 1000) : ts
      if (Math.abs(now - tsSeconds) > TIMESTAMP_TOLERANCE_S) {
        return json({ error: 'Stale request.' }, 401)
      }
      valid = timingSafeEqual(provided, await hmacHex(key, `${timestamp}.${rawBody}`))
    }
    if (!valid) valid = timingSafeEqual(provided, await hmacHex(key, rawBody))
  }

  if (!valid && typeof payload.meta?.signature === 'string') {
    const expected = await hmacHex(key, JSON.stringify(payload.data ?? {}))
    valid = timingSafeEqual(payload.meta.signature.toLowerCase(), expected)
  }

  if (!valid) {
    return json({ error: 'Invalid signature.' }, 401)
  }

  // ---- event handling --------------------------------------------------
  const event = String(payload.meta?.event ?? payload.event ?? 'test').toLowerCase()
  const allowed = ['test', 'publish', 'update', 'delete']
  if (!allowed.includes(event)) {
    return json({ error: `Unsupported event: ${event}` }, 400)
  }

  if (event === 'test') {
    return json({ received: true, event })
  }

  await purgePostsCache()

  const data = (payload.data ?? {}) as Record<string, unknown>
  const id = data.id ?? data.article_id ?? null
  const slug = pickSlug(data)
  const permalink = slug ? `${SITE_ORIGIN}/editorial/${slug}` : null

  if (event === 'delete') {
    return json({ received: true, event, id })
  }

  // publish + update
  return json({ received: true, event, id, permalink })
})
