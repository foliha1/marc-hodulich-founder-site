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
  const portrait = section?.image_url || "";

  return (
    <section className="w-full bg-brand-night text-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)] gap-10 lg:gap-11">
          {/* Left: heading + portrait */}
          <div className="reveal">
            <p className="font-editorial text-brand-red text-2xl md:text-3xl mb-4">
              Growth lives at the edge.
            </p>
            <h2 className="font-display text-[clamp(3rem,6.5vw,6rem)] mb-8 lg:mb-12">
              {words.length > 0 && (
                <span className="block text-brand-warm">{words.join(" ")}</span>
              )}
              <span className="block text-brand-red">{last}.</span>
            </h2>

            {portrait && (
              <div className="aspect-[4/5] overflow-hidden bg-brand-warm/5">
                <img
                  srcSet={getResponsiveSrcSet(portrait, [480, 640, 800], 82)}
                  sizes="(min-width: 1024px) 32vw, 100vw"
                  src={getOptimizedImageUrl(portrait, 800, 82)}
                  alt="Marc Hodulich"
                  className="img-fade w-full h-full object-cover object-top"
                  {...fadeInProps}
                  loading="lazy"
                  decoding="async"
                  onError={fallbackToOriginal(portrait)}
                />
              </div>
            )}
          </div>

          {/* Right: paragraph + cards */}
          <div>
            <p className="font-editorial text-brand-warm/90 text-[clamp(1.3rem,2.3vw,2.1rem)] leading-snug reveal-delay">
              {section?.paragraph}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 md:[&>*:nth-child(even)]:border-l md:[&>*:nth-child(even)]:border-brand-warm/10 mt-12 lg:mt-16">
              {cards.map((card, i) => (
                <article
                  key={card.id}
                  className="reveal"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-brand-warm/5">
                    <img
                      srcSet={getResponsiveSrcSet(card.image_url, [640, 854], 80)}
                      sizes="(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw"
                      src={getOptimizedImageUrl(card.image_url, 854, 80)}
                      alt={card.title}
                      className="img-fade w-full h-full object-cover"
                      {...fadeInProps}
                      loading="lazy"
                      decoding="async"
                      onError={fallbackToOriginal(card.image_url)}
                    />
                  </div>
                  <div className="px-8 lg:px-9 pt-10 pb-10 lg:pt-11">
                    <h3 className="text-base md:text-lg font-bold tracking-[0.3em] uppercase text-brand-warm mb-6">
                      {card.title}
                    </h3>
                    <p className="text-[15px] text-brand-warm/75 leading-[1.7]">
                      {card.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
