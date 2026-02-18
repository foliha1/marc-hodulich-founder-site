

# Fix Image Cropping After Optimization

## Problem

The `/render/image/public/` endpoint is working correctly (images reduced from ~3MB to ~57KB), but it uses `resizing_type:fill` which crops images server-side before the browser receives them. Combined with CSS aspect ratio constraints, this creates awkward cropping -- especially for portrait-oriented photos in the Meet Marc section.

**Specific issues:**
- **MeetMarc mobile**: Images use `w-full h-auto` with no aspect ratio constraint, so portrait photos stretch the full screen height (e.g., the blue sky/hat photo takes up 2+ screens)
- **MeetMarc desktop**: `aspect-[16/9] object-cover` crops portrait photos too aggressively, cutting off heads and faces
- **Carousel**: The `aspect-[4/3]` container works reasonably well but the server-side fill crop may still cut important parts

## Solution

### 1. Use `resize=fit` instead of `fill` in the render URL

Add `resize=fit` to the Supabase render URL parameters. This tells Supabase to resize the image to fit within the requested dimensions **without cropping**, preserving the full image. The CSS `object-cover` on the browser side will then handle the visual cropping with better control.

**File:** `src/utils/imageOptimization.ts`
- Change the return URL to include `&resize=fit` so the server doesn't crop

### 2. Fix MeetMarc mobile image aspect ratio

**File:** `src/components/MeetMarc.tsx`
- Replace the two separate `<img>` tags (mobile without aspect ratio, desktop with 16:9) with a single responsive image that uses a consistent, forgiving aspect ratio
- Use `aspect-[4/3]` for all screen sizes -- this works well for both landscape and portrait source images
- Keep `object-cover` for consistent visual cropping in the browser
- Use `object-top` to prioritize showing faces/heads rather than centering

### 3. No changes needed for Carousel or Hero

- Carousel already uses `aspect-[4/3]` with `object-cover` which works well
- Hero uses `object-contain` which shows the full image without any cropping

## Technical Details

**Files to modify:**
- `src/utils/imageOptimization.ts` -- add `resize=fit` parameter
- `src/components/MeetMarc.tsx` -- consolidate image tags, use consistent `aspect-[4/3] object-cover object-top`

