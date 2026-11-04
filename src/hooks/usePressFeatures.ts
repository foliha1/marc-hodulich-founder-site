import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PressFeature {
  id: string;
  kind: "press" | "linkedin";
  outlet: string;
  title: string;
  excerpt: string;
  url: string;
  image_url: string;
  display_order: number;
}

export const usePressFeatures = () =>
  useQuery({
    queryKey: ["press-features"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("press_features")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return (data ?? []) as PressFeature[];
    },
    staleTime: 5 * 60 * 1000,
  });
