import type { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const HERO_CACHE_KEY = "hero-content-cache-v1";

export type PublicContentKey =
  | "hero-content"
  | "meet-marc-cards"
  | "carousel-slides"
  | "movement-content"
  | "podcasts"
  | "contact-content"
  | "section-content"
  | "press-features";

/** Drop cached public content so the live site shows fresh data after a CMS save. */
export const refreshPublicContent = (queryClient: QueryClient, ...keys: PublicContentKey[]) => {
  for (const key of keys) {
    if (key === "hero-content") {
      try {
        localStorage.removeItem(HERO_CACHE_KEY);
      } catch {
        // ignore storage failures
      }
    }
    queryClient.invalidateQueries({ queryKey: [key] });
  }
};

/** Renumber display_order to 1..n (no gaps, no duplicates), keeping the current sequence. */
export const compactDisplayOrder = async (
  table: "meet_marc_cards" | "carousel_slides" | "podcasts" | "press_features",
) => {
  const { data, error } = await supabase.from(table).select("id, display_order").order("display_order").order("id");
  if (error || !data) return;
  await Promise.all(
    data
      .map((row, i) => ({ row, order: i + 1 }))
      .filter(({ row, order }) => row.display_order !== order)
      .map(({ row, order }) => supabase.from(table).update({ display_order: order }).eq("id", row.id)),
  );
};
