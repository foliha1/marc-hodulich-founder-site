import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type SocialPost = Tables<"social_posts">;
export const useSocialPosts = () => useQuery({
  queryKey: ["social-posts"],
  queryFn: async () => {
    const { data, error } = await supabase.from("social_posts").select("*").order("display_order").order("id");
    if (error) throw error;
    return data;
  },
});