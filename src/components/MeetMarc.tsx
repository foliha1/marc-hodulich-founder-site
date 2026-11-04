import { useMeetMarcCards } from "@/hooks/useMeetMarcCards";
import { MeetMarcSkeleton } from "@/components/MeetMarcSkeleton";
import { getOptimizedImageUrl, getResponsiveSrcSet, fallbackToOriginal, fadeInProps } from "@/utils/imageOptimization";

export const MeetMarc = () => {
  const { data, isLoading } = useMeetMarcCards();

  if (isLoading) return <MeetMarcSkeleton />;
  if (!data || data.cards.length === 0) return null;
  
  const { cards, section } = data;

  return (
    <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 lg:mb-24">
          <div className="reveal">
            <h2 className="hero-title text-brand-ink">
              {section?.title || "MEET MARC"}
            </h2>
          </div>
          <div className="mt-8 lg:mt-12 max-w-3xl reveal-delay">
            <p className="body-text text-brand-ink-sub leading-relaxed">
              {section?.paragraph || "Marc Hodulich is a builder, athlete, and father who believes growth lives at the edge of comfort. His days are guided by simple virtues—curiosity, care, resilience, and presence. Whether starting companies, running ultramarathons, or playing with his boys - Marc leads with the conviction that struggle is a teacher, community is strength, and life is richest when built with intention and shared while fully present with others."}
            </p>
          </div>
        </div>

        {/* Staggered Content Cards */}
        <div className="space-y-20 lg:space-y-32">
          {cards.map((card, index) => {
            const isEven = index % 2 === 0;
            return (
              <MeetMarcCard 
                key={card.id}
                card={card}
                isEven={isEven}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const MeetMarcCard = ({ 
  card, 
  isEven
}: { 
  card: any; 
  isEven: boolean;
}) => {
  return (
    <div 
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center reveal`}
    >
      <div className="lg:w-1/2 w-full">
        <img 
          srcSet={getResponsiveSrcSet(card.image_url, [356, 640], 80)}
          sizes="(max-width: 640px) 100vw, 356px"
          src={getOptimizedImageUrl(card.image_url, 640, 80)}
          alt={card.title}
          width={(card as any).width || 640}
          height={(card as any).height || 480}
          className="img-fade w-full h-auto object-cover rounded bg-brand-stone sm:hidden"
          {...fadeInProps}
          loading="lazy"
          decoding="async"
          onError={fallbackToOriginal(card.image_url)}
        />
        <img 
          srcSet={getResponsiveSrcSet(card.image_url, [640, 854], 80)}
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={getOptimizedImageUrl(card.image_url, 854, 80)}
          alt={card.title}
          width={(card as any).width || 854}
          height={(card as any).height || 480}
          className="img-fade hidden sm:block w-full aspect-[16/9] object-cover rounded bg-brand-stone"
          {...fadeInProps}
          loading="lazy"
          decoding="async"
          onError={fallbackToOriginal(card.image_url)}
        />
      </div>
      <div className="lg:w-1/2 space-y-6">
        <h3 className="subtitle text-brand-ink text-lg">{card.title}</h3>
        <p className="body-text text-brand-ink-sub leading-relaxed">
          {card.description}
        </p>
      </div>
    </div>
  );
};
