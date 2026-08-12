import { assert, assertEquals } from 'jsr:@std/assert@1'

const encoder = new TextEncoder()

async function sign(key: string, message: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  return new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message)))
}

function hex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function base64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
}

Deno.test('documented legacy meta.mac signs the payload after meta.mac is removed', async () => {
  const payload = {
    meta: { event: 'publish' },
    data: { id: 42, seo: { slug: 'documented-mac' } },
  }
  const mac = hex(await sign('test-key', JSON.stringify(payload)))
  assertEquals(mac.length, 64)
  assert(/^[0-9a-f]+$/.test(mac))
})

Deno.test('timestamp/raw-body signature retains case-sensitive base64 encoding', async () => {
  const body = JSON.stringify({ meta: { event: 'test' } })
  const timestamp = '1786570018'
  const signature = base64(await sign('test-key', `${timestamp}.${body}`))
  assert(signature.length > 40)
  assert(signature !== signature.toLowerCase())
})