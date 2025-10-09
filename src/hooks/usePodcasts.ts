import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Podcast {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  podcast_url: string;
  display_order: number;
}

export const usePodcasts = () => {
  return useQuery({
    queryKey: ["podcasts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("podcasts")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data as Podcast[];
    },
    staleTime: 5 * 60 * 1000,
  });
};
