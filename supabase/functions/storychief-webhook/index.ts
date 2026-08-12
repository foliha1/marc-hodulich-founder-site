// StoryChief Headless Website destination webhook.
//
// Receives StoryChief `test`, `publish`, `update` and `delete` events, validates
// the request with the server-side STORYCHIEF_WEBHOOK_KEY, and invalidates the
// short-lived cache held by the `storychief-posts` function.
//
// Secrets (env only, never returned to the client or logged):
//   STORYCHIEF_WEBHOOK_KEY — shared signing key configured on the destination
//
// Signature validation covers every documented StoryChief variant. The RAW,
// unmodified request body is always used for the header-based schemes:
//   1) X-Storychief-Signature            = HMAC-SHA256(raw body, key)
//   2) X-Storychief-Signature + X-Storychief-Timestamp
//                                        = HMAC-SHA256(`${ts}.${raw body}`, key)
//   3) In-payload meta.mac (documented legacy publish webhook) = HMAC-SHA256
//      over `data` using PHP `json_encode` semantics. The older
//      `meta.signature` alias remains accepted for backwards compatibility.

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const SITE_ORIGIN = 'https://marchodulich.com'
const MAX_BODY_BYTES = 1_000_000
const TIMESTAMP_TOLERANCE_S = 60 * 10

const encoder = new TextEncoder()

async function hmacBytes(key: string, message: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  return new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message)))
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

function decodeSignature(value: string): Uint8Array | null {
  const normalized = value.trim().replace(/^sha256=/i, '')
  if (/^[0-9a-f]{64}$/i.test(normalized)) {
    return Uint8Array.from(normalized.match(/.{2}/g) ?? [], (byte) => parseInt(byte, 16))
  }

  try {
    const base64 = normalized.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const binary = atob(padded)
    return Uint8Array.from(binary, (char) => char.charCodeAt(0))
  } catch {
    return null
  }
}

async function signatureMatches(key: string, message: string, provided: string): Promise<boolean> {
  const decoded = decodeSignature(provided)
  if (!decoded) return false
  return timingSafeEqualBytes(decoded, await hmacBytes(key, message))
}

/** Mimic PHP json_encode() defaults: escaped slashes and \uXXXX for non-ASCII. */
function phpJsonEncode(value: unknown): string {
  const s = JSON.stringify(value) ?? 'null'
  return s
    .replace(/\//g, '\\/')
    .replace(/[\u0080-\uFFFF]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))
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
    req.headers.get('storychief-signature') ??
    req.headers.get('x-signature')
  if (!raw) return null
  return raw.trim()
}

interface SCPayload {
  meta?: { event?: string; mac?: string; signature?: string; test?: boolean }
  data?: Record<string, unknown>
  event?: string
  [k: string]: unknown
}

function pickSlug(data: Record<string, unknown> | undefined | null): string | null {
  if (!data || typeof data !== 'object') return null
  const seo = (data.seo ?? null) as Record<string, unknown> | null
  const candidates = [seo?.slug, data.seo_slug, data.slug, data.permalink, data.url]
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) {
      const last = c.trim().replace(/[?#].*$/, '').replace(/\/+$/, '').split('/').pop()
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

  // Reachability probe (StoryChief and uptime checks may GET/HEAD the URL).
  if (req.method === 'GET' || req.method === 'HEAD') {
    return json({ ok: true })
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

  // Diagnostics: header names only + body size. Never values, never secrets.
  const headerNames = [...req.headers.keys()].filter((h) => !/authorization|apikey|cookie/i.test(h))
  console.log('storychief-webhook request', {
    headers: headerNames,
    body_bytes: rawBody.length,
    content_type: req.headers.get('content-type'),
  })

  let payload: SCPayload = {}
  if (rawBody.trim()) {
    try {
      payload = JSON.parse(rawBody)
    } catch {
      // StoryChief may post form-encoded data; try that before failing.
      try {
        const params = new URLSearchParams(rawBody)
        const obj: Record<string, unknown> = {}
        for (const [k, v] of params) obj[k] = v
        payload = obj as SCPayload
      } catch {
        return json({ error: 'Invalid body.' }, 400)
      }
    }
  }

  const event = String(payload.meta?.event ?? payload.event ?? 'test').toLowerCase()

  // ---- signature validation (raw body for all header-based schemes) ----
  const provided = headerSignature(req)
  const timestamp =
    req.headers.get('x-storychief-timestamp') ?? req.headers.get('storychief-timestamp')

  let valid = false
  let matched = 'none'

  if (provided) {
    if (timestamp) {
      const ts = Number(timestamp)
      if (Number.isFinite(ts)) {
        const now = Math.floor(Date.now() / 1000)
        const tsSeconds = ts > 1e11 ? Math.floor(ts / 1000) : ts
        if (Math.abs(now - tsSeconds) <= TIMESTAMP_TOLERANCE_S) {
          if (await signatureMatches(key, `${timestamp}.${rawBody}`, provided)) {
            valid = true
            matched = 'header+timestamp'
          }
        } else {
          console.warn('storychief-webhook stale timestamp')
        }
      }
    }
    if (!valid && (await signatureMatches(key, rawBody, provided))) {
      valid = true
      matched = 'header-raw-body'
    }
  }

  const inPayloadMac = typeof payload.meta?.mac === 'string' ? payload.meta.mac : null
  const inPayloadSignature =
    typeof payload.meta?.signature === 'string' ? payload.meta.signature : null
  const inPayloadAuth = inPayloadMac ?? inPayloadSignature

  if (!valid && inPayloadAuth) {
    const stripped: SCPayload = {
      ...payload,
      meta: { ...(payload.meta ?? {}) },
    }
    delete (stripped.meta as Record<string, unknown>).mac
    delete (stripped.meta as Record<string, unknown>).signature

    const candidates: Array<[string, string]> = inPayloadMac
      ? [
          ['meta.mac-data-php', phpJsonEncode(payload.data ?? {})],
          ['meta.mac-data-js', JSON.stringify(payload.data ?? {})],
        ]
      : [
          ['payload-js', JSON.stringify(stripped)],
          ['payload-php', phpJsonEncode(stripped)],
          ['data-js', JSON.stringify(payload.data ?? {})],
          ['data-php', phpJsonEncode(payload.data ?? {})],
        ]
    for (const [name, message] of candidates) {
      if (await signatureMatches(key, message, inPayloadAuth)) {
        valid = true
        matched = name
        break
      }
    }
  }

  if (!valid) {
    console.warn('storychief-webhook rejected: signature mismatch', {
      event,
      has_header_signature: !!provided,
      has_payload_mac: !!inPayloadMac,
      has_payload_signature: !!inPayloadSignature,
      has_timestamp: !!timestamp,
    })
    return json({ error: 'Invalid signature.' }, 401)
  }

  console.log('storychief-webhook accepted', { event, scheme: matched })

  // ---- event handling --------------------------------------------------
  const allowed = ['test', 'publish', 'update', 'delete']
  if (!allowed.includes(event)) {
    console.warn('storychief-webhook unsupported event', { event })
    return json({ error: `Unsupported event: ${event}` }, 400)
  }

  // The test event must succeed with no article, slug or cache record.
  if (event === 'test') {
    return json({ success: true, received: true, event: 'test' })
  }

  try {
    await purgePostsCache()
  } catch (e) {
    console.error('cache purge threw (ignored):', e)
  }

  const data = (payload.data && typeof payload.data === 'object' ? payload.data : {}) as Record<
    string,
    unknown
  >
  const id = data.id ?? data.article_id ?? payload.id ?? null
  const slug = pickSlug(data) ?? pickSlug(payload as Record<string, unknown>)
  const permalink = slug ? `${SITE_ORIGIN}/editorial/${slug}` : null

  if (event === 'delete') {
    return json({ success: true, received: true, event, id })
  }

  return json({ success: true, received: true, event, id, permalink })
})
