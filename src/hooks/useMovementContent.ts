import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MovementContent {
  title: string;
  description: string;
  video_url: string;
  video_link_url: string;
  quote: string;
  quote_author: string;
}

export const useMovementContent = () => {
  return useQuery({
    queryKey: ["movement-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movement_content")
        .select("*")
        .single();

      if (error) throw error;
      return data as MovementContent;
    },
  });
};
