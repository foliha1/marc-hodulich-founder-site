import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MeetMarcCard {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
}

interface SectionContent {
  title: string;
  paragraph: string;
}

export const useMeetMarcCards = () => {
  return useQuery({
    queryKey: ["meet-marc-cards"],
    queryFn: async () => {
      const [cardsResponse, sectionResponse] = await Promise.all([
        supabase.from("meet_marc_cards").select("*").order("display_order"),
        supabase.from("section_content").select("title, paragraph").eq("section_name", "meet_marc").maybeSingle()
      ]);
      
      if (cardsResponse.error) throw cardsResponse.error;
      if (sectionResponse.error) throw sectionResponse.error;
      
      return {
        cards: cardsResponse.data as MeetMarcCard[],
        section: sectionResponse.data as SectionContent | null
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
