import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface HeroContent {
  title: string;
  description: string;
  subtitle: string;
  background_image_url: string;
}

export const useHeroContent = () => {
  return useQuery({
    queryKey: ["hero-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_content")
        .select("*")
        .single();
      
      if (error) throw error;
      return data as HeroContent;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
