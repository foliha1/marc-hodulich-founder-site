import { useCarouselSlides } from "@/hooks/useCarouselSlides";
import { FailuresFirstsSkeleton } from "@/components/FailuresFirstsSkeleton";
import { getOptimizedImageUrl, fallbackToOriginal, fadeInProps } from "@/utils/imageOptimization";

// Numbered chapter list. Every row comes from the Admin "Failures & Firsts"
// slides: caption = chapter name, subcaption = description, image = thumbnail.
export const FailuresFirsts = () => {
  const { data, isLoading } = useCarouselSlides();

  if (isLoading) return <FailuresFirstsSkeleton />;
  if (!data || data.slides.length === 0) return null;

  const { slides, section } = data;

  return (
    <section className="w-full bg-brand-night text-brand-warm section-spacing border-t border-brand-warm/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="reveal mb-14 lg:mb-20">
          <p className="eyebrow mb-6">{section?.title || "Failures, Firsts, and Foundations"}</p>
          <h2 className="font-display text-brand-warm text-[clamp(2.6rem,5.5vw,5rem)] max-w-4xl">
            Failure isn't<br />the end.
          </h2>
          {section?.paragraph && (
            <p className="font-editorial text-brand-warm/80 text-[clamp(1.2rem,1.8vw,1.6rem)] leading-snug max-w-3xl mt-8">
              {section.paragraph}
            </p>
          )}
        </div>

        <ol className="border-t border-brand-warm/10">
          {slides.map((slide, i) => (
            <li
              key={slide.id}
              className="grid grid-cols-[3rem_1fr] md:grid-cols-[5rem_1.3fr_1fr_6rem] gap-x-6 gap-y-3 items-start py-8 md:py-10 border-b border-brand-warm/10 reveal"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className="font-display text-brand-red text-2xl md:text-3xl">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-brand-warm text-2xl md:text-3xl">{slide.caption}</h3>
              <p className="col-start-2 md:col-start-auto body-text text-brand-warm/70">{slide.subcaption}</p>
              {slide.image_url && (
                <div className="hidden md:block w-24 aspect-square overflow-hidden bg-brand-warm/5 justify-self-end">
                  <img
                    src={getOptimizedImageUrl(slide.image_url, 200, 75)}
                    alt=""
                    className="img-fade w-full h-full object-cover grayscale"
                    {...fadeInProps}
                    loading="lazy"
                    decoding="async"
                    onError={fallbackToOriginal(slide.image_url)}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
