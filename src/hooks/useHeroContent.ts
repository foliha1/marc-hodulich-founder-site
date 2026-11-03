import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface HeroContent {
  title: string;
  description: string;
  subtitle: string;
  background_image_url: string;
  background_image_width?: number | null;
  background_image_height?: number | null;
}

const CACHE_KEY = "hero-content-cache-v1";

const readCachedHeroContent = (): HeroContent | undefined => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as HeroContent) : undefined;
  } catch {
    return undefined;
  }
};

export const useHeroContent = () => {
  return useQuery({
    queryKey: ["hero-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_content")
        .select("*")
        .single();

      if (error) throw error;

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch {
        // Ignore storage failures (e.g. private browsing)
      }

      return data as HeroContent;
    },
    placeholderData: readCachedHeroContent,
  });
};
