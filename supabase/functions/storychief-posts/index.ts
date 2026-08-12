// TEMPORARY probe to find the correct StoryChief CDA base URL.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const token = Deno.env.get('STORYCHIEF_CDA_TOKEN')!
const dest = Deno.env.get('STORYCHIEF_DESTINATION_ID')!

const variants = [
  `https://delivery-api.storychief.io/${dest}/articles?count=3`,
  `https://delivery-api.storychief.io/1.0/${dest}/articles?count=3`,
  `https://delivery-api.storychief.io/1/${dest}/articles?count=3`,
]

const results: any[] = []
for (const url of variants) {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
    const body = await res.text()
    results.push({
      url,
      status: res.status,
      body: body.slice(0, 400),
    })
  } catch (e: any) {
    results.push({ url, error: String(e) })
  }
}

Deno.serve(() => {
  return new Response(JSON.stringify({ hasToken: !!token, destLength: dest.length, results }, null, 2), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
