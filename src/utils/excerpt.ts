// Ghost auto-cuts the excerpt from the article body, so the letter page would
// otherwise open with the same line twice. Treat an excerpt as duplicative when
// it simply restates how the article already begins.

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&[a-z0-9#]+;/gi, " ");

const normalize = (value: string) =>
  value.replace(/\s+/g, " ").trim().toLowerCase();

const commonPrefixLength = (a: string, b: string) => {
  const limit = Math.min(a.length, b.length);
  let i = 0;
  while (i < limit && a[i] === b[i]) i += 1;
  return i;
};

/** 30 characters of identical opening is enough to call it a repeat. */
export const isDuplicativeExcerpt = (
  excerpt: string | null | undefined,
  contentHtml: string | null | undefined
): boolean => {
  if (!excerpt || !contentHtml) return false;
  return commonPrefixLength(normalize(excerpt), normalize(stripHtml(contentHtml))) >= 30;
};
