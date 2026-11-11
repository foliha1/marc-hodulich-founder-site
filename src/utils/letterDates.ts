/**
 * Temporary display dates for published Ghost letters.
 *
 * Ghost's own publish date is the source of truth. These overrides exist only
 * until the dates in Ghost are corrected — delete an entry to fall back to
 * the date Ghost reports.
 */
const DISPLAY_DATES: Record<string, string> = {
  "the-founding-letter": "Nov. 12",
};

/**
 * Returns the pinned display date for a letter slug, or null when the
 * date coming from Ghost should be used instead.
 */
export const displayDateOverride = (slug?: string | null): string | null => {
  if (!slug) return null;
  return Object.prototype.hasOwnProperty.call(DISPLAY_DATES, slug)
    ? DISPLAY_DATES[slug]
    : null;
};
