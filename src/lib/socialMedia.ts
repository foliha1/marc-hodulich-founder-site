/** Only original Instagram post/reel URLs are valid gallery destinations. */
export const getInstagramPostUrl = (value: string | null | undefined): string | null => {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !["instagram.com", "www.instagram.com"].includes(url.hostname)) return null;
    if (!/^\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)) return null;
    return url.href;
  } catch { return null; }
};

/** Exclude legacy stock placeholders; gallery thumbnails come from the CMS image library. */
export const hasSocialThumbnail = (value: string): boolean => {
  try { return new URL(value).pathname.includes("/storage/v1/object/public/cms-images/"); }
  catch { return false; }
};