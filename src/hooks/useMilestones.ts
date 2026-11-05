import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Milestone = Tables<"entrepreneurial_milestones">;

export const useMilestones = () => useQuery({
  queryKey: ["entrepreneurial-milestones"],
  queryFn: async () => {
    const [rows, section] = await Promise.all([
      supabase.from("entrepreneurial_milestones").select("*").order("display_order").order("id"),
      supabase.from("section_content").select("id, title, paragraph").eq("section_name", "failures_firsts").maybeSingle(),
    ]);
    if (rows.error) throw rows.error;
    if (section.error) throw section.error;
    return { milestones: rows.data, section: section.data };
  },
});