import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CarouselSlide {
  id: string;
  caption: string;
  subcaption: string;
  image_url: string;
  display_order: number;
}

interface SectionContent {
  title: string;
  paragraph: string;
}

export const useCarouselSlides = () => {
  return useQuery({
    queryKey: ["carousel-slides"],
    queryFn: async () => {
      const [slidesResponse, sectionResponse] = await Promise.all([
        supabase.from("carousel_slides").select("*").order("display_order"),
        supabase.from("section_content").select("title, paragraph").eq("section_name", "failures_firsts").maybeSingle()
      ]);
      
      if (slidesResponse.error) throw slidesResponse.error;
      if (sectionResponse.error) throw sectionResponse.error;
      
      return {
        slides: slidesResponse.data as CarouselSlide[],
        section: sectionResponse.data as SectionContent | null
      };
    },
    
  });
};
