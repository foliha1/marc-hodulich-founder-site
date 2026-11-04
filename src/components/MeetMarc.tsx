import { useMeetMarcCards } from "@/hooks/useMeetMarcCards";
import { MeetMarcSkeleton } from "@/components/MeetMarcSkeleton";
import { getOptimizedImageUrl, getResponsiveSrcSet, fallbackToOriginal, fadeInProps } from "@/utils/imageOptimization";

export const MeetMarc = () => {
  const { data, isLoading } = useMeetMarcCards();

  if (isLoading) return <MeetMarcSkeleton />;
  if (!data || data.cards.length === 0) return null;

  const { cards, section } = data;
  const title = (section?.title || "Meet Marc").trim();
  const words = title.split(/\s+/);
  const last = words.pop();

  return (
    <section className="w-full bg-brand-night text-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-12 mb-16 lg:mb-20">
          <div className="reveal">
            <p className="font-editorial text-brand-red text-2xl md:text-3xl mb-4">Growth lives at the edge.</p>
            <h2 className="font-display text-[clamp(3rem,6.5vw,6rem)]">
              {words.length > 0 && <span className="block text-brand-warm">{words.join(" ")}</span>}
              <span className="block text-brand-red">{last}.</span>
            </h2>
          </div>
          <p className="font-editorial text-brand-warm/90 text-[clamp(1.3rem,2.3vw,2.1rem)] leading-snug reveal-delay">
            {section?.paragraph}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-brand-warm/10">
          {cards.map((card, i) => (
            <article key={card.id} className="border-r border-b border-brand-warm/10 reveal" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="aspect-[4/3] overflow-hidden bg-brand-warm/5">
                <img
                  srcSet={getResponsiveSrcSet(card.image_url, [640, 854], 80)}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  src={getOptimizedImageUrl(card.image_url, 854, 80)}
                  alt={card.title}
                  className="img-fade w-full h-full object-cover"
                  {...fadeInProps}
                  loading="lazy"
                  decoding="async"
                  onError={fallbackToOriginal(card.image_url)}
                />
              </div>
              <div className="p-8 lg:p-10">
                <h3 className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-brand-warm mb-4">{card.title}</h3>
                <p className="body-text text-brand-warm/70 leading-relaxed">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
