# StoryChief Editorial Integration Plan

## Context (verified)
- **Backend:** Lovable Cloud (managed Supabase, ref `ontkueksqeqypaxvysvu`). Service role key / DB password not accessible — all backend work goes through Edge Functions.
- **Ghost:** fully removed. No package, no `src/lib/ghost.ts`, no `/editorial/:slug` route. Only `src/pages/Editorial.tsx` blank placeholder + `path="/editorial"` in `App.tsx`.
- **Secrets:** `STORYCHIEF_CDA_TOKEN`, `STORYCHIEF_DESTINATION_ID`, `STORYCHIEF_WEBHOOK_KEY` all present and available to Edge Functions as env vars. Never sent to the client.

## Decisions
- **Sync:** Pull via Edge Function (CDA on each request, short cache). Webhook cache-invalidation deferred.
- **Cutover:** Build on a preview route, verify live, then flip `/editorial` over and remove the preview.

## Phase A — Edge Function `storychief-posts`
File: `supabase/functions/storychief-posts/index.ts`
- Reads `STORYCHIEF_CDA_TOKEN`, `STORYCHIEF_DESTINATION_ID` from env (webhook key unused for now).
- Routes (all GET, public read — no auth needed to list published posts):
  - `?list=1` → published posts list (title, slug, excerpt, featured_image, published_at, author, tags).
  - `?slug=<slug>` → single post full body/html.
- Calls StoryChief Content Delivery API; normalizes to a stable JSON shape so frontend stays decoupled from raw StoryChief schema.
- Caches responses ~120s via `Cache-Control` header (and in-memory where possible) to limit upstream calls.
- CORS via `npm:@supabase/supabase-js@2/cors`; `OPTIONS` preflight handled; CORS headers on all responses including errors.
- Input validation: `slug` constrained to safe slug chars; rejects empty/oversized.
- Errors return JSON `{ error }` with proper status (400/404/502).
- `verify_jwt = false` (default for Lovable-managed public functions).

## Phase B — Frontend (no disruption to existing pages)
- `src/hooks/useStoryChiefPosts.ts` — React Query hooks: `useStoryChiefPostList()`, `useStoryChiefPost(slug)`. Invoke the edge function via `supabase.functions.invoke('storychief-posts', { ... })`.
- `src/pages/EditorialPreview.tsx` — temporary grid feed, styled with existing brand tokens (`bg-brand-warm`, `text-brand-ink`, `hero-title`, `.animate-in`, 4:3 image ratios). No redesign of other pages.
- `src/pages/EditorialPost.tsx` — full article page (the future `/editorial/:slug`), styled to match site typography.
- Add routes (no removal of existing ones yet):
  - `path="/editorial-preview"` → `<EditorialPreview />`
  - `path="/editorial-preview/:slug"` → `<EditorialPost />`

## Phase C — Verify (before cutover)
- Test the edge function live with `curl_edge_functions` (list + single slug).
- Drive the browser: load `/editorial-preview`, confirm grid renders, open a post, confirm body/images load, no console errors, images use the optimized-image path.
- Confirm `/editorial` (blank placeholder) is untouched during this phase.

## Phase D — Cutover (only after Phase C passes)
- Repoint `path="/editorial"` → `<EditorialPreview />` and `path="/editorial/:slug"` → `<EditorialPost />`.
- Remove `EditorialPreview` route alias and the temp preview routes; keep `EditorialPreview.tsx` as the real `Editorial.tsx` (or rename) — final `/editorial` shows the feed.
- Delete the old blank `Editorial.tsx` content.
- Re-verify `/editorial` and `/editorial/some-slug` live.

## Phase E — Cleanup
- Confirm no Ghost references anywhere (already true).
- Remove any temp flags/preview routes.
- No changes to design, layout, or styling of any other page.

## Out of scope / guardrails
- No client exposure of StoryChief secrets.
- No edits to `auth`/`storage`/`realtime`/`vault` schemas, `client.ts`, `types.ts`, or `.env`.
- No changes to existing pages' design/layout/styling.
- Webhook (`storychief-webhook`) function deferred — added later only if near-real-time updates are needed.
