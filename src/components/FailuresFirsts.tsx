import { useCarouselSlides } from "@/hooks/useCarouselSlides";
import { FailuresFirstsSkeleton } from "@/components/FailuresFirstsSkeleton";

// Numbered chapter list. Every row comes from the Admin "Failures & Firsts"
// slides: caption = chapter name, subcaption = description (text-only list).
export const FailuresFirsts = () => {
  const { data, isLoading } = useCarouselSlides();

  if (isLoading) return <FailuresFirstsSkeleton />;
  if (!data || data.slides.length === 0) return null;

  const { slides, section } = data;

  return (
    <section className="w-full bg-brand-night text-brand-warm section-spacing border-t border-brand-warm/10">
      <div className="container-wide">
        <div className="reveal mb-14 lg:mb-20">
          <p className="eyebrow mb-6">{section?.title || "Failures, Firsts, and Foundations"}</p>
          <h2 className="font-display text-brand-warm text-[clamp(2.6rem,5.2vw,5.5rem)]">
            Failure isn't<br />the end.
          </h2>
          {section?.paragraph && (
            <p className="font-editorial text-brand-warm/80 text-[clamp(1.2rem,1.8vw,1.6rem)] leading-[1.5] max-w-[48rem] mt-10">
              {section.paragraph}
            </p>
          )}
        </div>

        <ol className="border-t border-brand-warm/10">
          {slides.map((slide, i) => (
            <li
              key={slide.id}
              className="grid grid-cols-[3rem_1fr] md:grid-cols-[minmax(0,0.55fr)_minmax(0,3.6fr)_minmax(0,2fr)] gap-x-6 gap-y-3 items-start py-8 md:py-12 border-b border-brand-warm/10 reveal"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className="font-display text-brand-red text-2xl md:text-3xl">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-brand-warm text-2xl md:text-[clamp(1.75rem,2vw,2.25rem)] max-w-[28rem]">{slide.caption}</h3>
              <p className="col-start-2 md:col-start-auto text-base text-brand-warm/75 leading-[1.65]">{slide.subcaption}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
