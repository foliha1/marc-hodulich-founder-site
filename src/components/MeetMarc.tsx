import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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

export const MeetMarc = () => {
  const [cards, setCards] = useState<MeetMarcCard[]>([]);
  const [section, setSection] = useState<SectionContent | null>(null);
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation();

  useEffect(() => {
    const fetchData = async () => {
      const [cardsResponse, sectionResponse] = await Promise.all([
        supabase.from("meet_marc_cards").select("*").order("display_order"),
        supabase.from("section_content").select("title, paragraph").eq("section_name", "meet_marc").maybeSingle()
      ]);
      
      if (cardsResponse.data) setCards(cardsResponse.data);
      if (sectionResponse.data) setSection(sectionResponse.data);
    };
    fetchData();
  }, []);

  if (cards.length === 0) return null;

  return (
    <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className={`scroll-fade-in ${headerVisible ? 'visible' : ''} mb-24`}>
          <div>
            <h1 className="hero-title text-brand-ink">{section?.title || "MEET MARC"}</h1>
          </div>
          <div className="mt-12 max-w-3xl">
            <p className="body-text text-brand-ink-sub leading-relaxed">
              {section?.paragraph || "Marc Hodulich is a builder, athlete, and father who believes growth lives at the edge of comfort. His days are guided by simple virtues—curiosity, care, resilience, and presence. Whether starting companies, running ultramarathons, or playing with his boys - Marc leads with the conviction that struggle is a teacher, community is strength, and life is richest when built with intention and shared while fully present with others."}
            </p>
          </div>
        </div>

        {/* Staggered Content */}
        <div className="space-y-32">
          {cards.map((card, index) => {
            const isEven = index % 2 === 0;
            const { elementRef, isVisible } = useScrollAnimation();
            return (
              <div 
                key={card.id}
                ref={elementRef}
                className={`scroll-fade-in ${isVisible ? 'visible' : ''} flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="lg:w-1/2">
                  <img 
                    src={card.image_url} 
                    alt={card.title} 
                    className="w-full h-auto object-cover rounded sm:hidden" 
                  />
                  <img 
                    src={card.image_url} 
                    alt={card.title} 
                    className="hidden sm:block w-full aspect-[16/9] object-cover rounded" 
                  />
                </div>
                <div className="lg:w-1/2 space-y-6">
                  <h4 className="subtitle text-brand-ink">{card.title}</h4>
                  <p className="body-text text-brand-ink-sub leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};