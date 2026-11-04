import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSectionContent = (sectionName: string) =>
  useQuery({
    queryKey: ["section-content", sectionName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("section_content")
        .select("title, paragraph")
        .eq("section_name", sectionName)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
