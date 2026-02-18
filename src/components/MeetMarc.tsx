import { useMeetMarcCards } from "@/hooks/useMeetMarcCards";
import { MeetMarcSkeleton } from "@/components/MeetMarcSkeleton";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { getOptimizedImageUrl, getResponsiveSrcSet } from "@/utils/imageOptimization";

export const MeetMarc = () => {
  const { data, isLoading } = useMeetMarcCards();
   const headerAnimation = useScrollAnimation({ 
     threshold: 0.08, 
     rootMargin: "0px 0px 160px 0px",
     triggerOnce: true,
     fallbackTimeout: 1500
   });

  if (isLoading || !data || data.cards.length === 0) return <MeetMarcSkeleton />;
  
  const { cards, section } = data;

  return (
    <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header with scroll animation */}
        <div className="mb-24" ref={headerAnimation.ref}>
          <div className={`transition-all duration-700 will-change-[opacity,transform] ${headerAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="hero-title text-brand-ink">
              {section?.title || "MEET MARC"}
            </h1>
          </div>
          <div className={`mt-12 max-w-3xl transition-all duration-700 delay-150 will-change-[opacity,transform] ${headerAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="body-text text-brand-ink-sub leading-relaxed">
              {section?.paragraph || "Marc Hodulich is a builder, athlete, and father who believes growth lives at the edge of comfort. His days are guided by simple virtues—curiosity, care, resilience, and presence. Whether starting companies, running ultramarathons, or playing with his boys - Marc leads with the conviction that struggle is a teacher, community is strength, and life is richest when built with intention and shared while fully present with others."}
            </p>
          </div>
        </div>

        {/* Staggered Content Cards with individual scroll animations */}
        <div className="space-y-32">
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

// Separate component for individual cards with their own scroll animation
const MeetMarcCard = ({ 
  card, 
  isEven
}: { 
  card: any; 
  isEven: boolean;
}) => {
   const cardAnimation = useScrollAnimation({ 
     threshold: 0.04,
     rootMargin: "0px 0px 240px 0px",
     triggerOnce: true,
     fallbackTimeout: 1500
   });

  return (
    <div 
      ref={cardAnimation.ref}
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center transition-all duration-700 will-change-[opacity,transform] ${cardAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="lg:w-1/2">
        <img 
          srcSet={getResponsiveSrcSet(card.image_url, [356, 640], 80)}
          sizes="(max-width: 640px) 100vw, 356px"
          src={getOptimizedImageUrl(card.image_url, 640, 80)}
          alt={card.title}
          width={(card as any).width || 640}
          height={(card as any).height || 480}
          className="w-full h-auto object-cover rounded sm:hidden" 
          loading="lazy" 
          decoding="async" 
        />
        <img 
          srcSet={getResponsiveSrcSet(card.image_url, [640, 854], 80)}
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={getOptimizedImageUrl(card.image_url, 854, 80)}
          alt={card.title}
          width={(card as any).width || 854}
          height={(card as any).height || 480}
          className="hidden sm:block w-full aspect-[16/9] object-cover rounded" 
          loading="lazy" 
          decoding="async" 
        />
      </div>
      <div className="lg:w-1/2 space-y-6">
        <h4 className="subtitle text-brand-ink text-lg">{card.title}</h4>
        <p className="body-text text-brand-ink-sub leading-relaxed">
          {card.description}
        </p>
      </div>
    </div>
  );
};
