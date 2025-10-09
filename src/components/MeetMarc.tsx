import { useMeetMarcCards } from "@/hooks/useMeetMarcCards";
import { MeetMarcSkeleton } from "@/components/MeetMarcSkeleton";

export const MeetMarc = () => {
  const { data, isLoading } = useMeetMarcCards();

  if (isLoading || !data || data.cards.length === 0) return <MeetMarcSkeleton />;

  const { cards, section } = data;

  return (
    <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-24">
          <div className="animate-slide-up">
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
            return (
              <div 
                key={card.id}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="lg:w-1/2">
                  <img 
                    src={card.image_url} 
                    alt={card.title} 
                    className="w-full h-auto object-cover rounded sm:hidden" 
                    loading="lazy"
                    decoding="async"
                  />
                  <img 
                    src={card.image_url} 
                    alt={card.title} 
                    className="hidden sm:block w-full aspect-[16/9] object-cover rounded" 
                    loading="lazy"
                    decoding="async"
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