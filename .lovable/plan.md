

# Fix Image Loading Performance

## Root Cause

The `getOptimizedImageUrl` function appends `?width=X&quality=Y` to storage URLs, but uses the **wrong endpoint**. The current URLs look like:

```
/storage/v1/object/public/cms-images/hero/image.png?width=1280&quality=85
```

These query params are completely ignored -- the original full-size file is served every time. Observed sizes:
- Hero PNG: **1.9 MB** (should be ~100-200 KB after resize + format conversion)
- Meet Marc JPG: **2.98 MB** (should be ~50-100 KB at 640px wide)

The correct endpoint for on-the-fly image transformations is:

```
/storage/v1/render/image/public/cms-images/hero/image.png?width=1280&quality=85
```

## Fix

**Single file change:** `src/utils/imageOptimization.ts`

Update `getOptimizedImageUrl` to rewrite `/object/public/` to `/render/image/public/` in storage URLs, and add `format=webp` for modern browser compression:

```typescript
export const getOptimizedImageUrl = (url: string, width: number, quality: number = 80): string => {
  if (!url) return url;
  if (!url.includes('supabase.co')) return url;

  // Switch from /object/public/ to /render/image/public/ for on-the-fly transforms
  const transformUrl = url.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/'
  );

  return `${transformUrl}?width=${width}&quality=${quality}&format=origin`;
};
```

Note: Using `format=origin` keeps the original format (PNG/JPG). If the project's Supabase plan supports WebP conversion, we could use `format=webp` for even smaller files -- but `origin` is safe and universally supported.

## Expected Impact

- Hero image: ~1.9 MB down to ~200-400 KB (resized to 1280px wide)
- Meet Marc images: ~3 MB down to ~80-150 KB (resized to 640px wide)  
- Carousel images: Similar 5-10x reductions
- **Total page weight reduction: roughly 70-80%** for images

## Files Modified

- `src/utils/imageOptimization.ts` -- one function change (swap endpoint path)

