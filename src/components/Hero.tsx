import { useHeroContent } from "@/hooks/useHeroContent";
import { getOptimizedImageUrl, getResponsiveSrcSet, fallbackToOriginal, fadeInProps } from "@/utils/imageOptimization";
import { Navigation } from "@/components/Navigation";

// Split the Admin-managed title so the last words carry the red accent
// ("CARTOGRAPHER" / "OF LIMITS").
const splitTitle = (html: string) => {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ");
  const redCount = words.length >= 3 ? 2 : words.length === 2 ? 1 : 0;
  return {
    lead: words.slice(0, words.length - redCount).join(" "),
    accent: words.slice(words.length - redCount).join(" "),
  };
};

export const Hero = () => {
  const { data: content } = useHeroContent();

  if (!content) {
    return (
      <section className="w-full bg-brand-night min-h-screen relative overflow-hidden">
        <Navigation variant="night" />
      </section>
    );
  }

  const { lead, accent } = splitTitle(content.title);

  return (
    <section className="w-full bg-brand-night text-brand-warm min-h-[100svh] relative overflow-hidden flex items-end">
      <Navigation variant="night" />

      <img
        srcSet={getResponsiveSrcSet(content.background_image_url, [640, 854, 1280, 1920], 85)}
        sizes="100vw"
        src={getOptimizedImageUrl(content.background_image_url, 1920, 85)}
        alt="Marc Hodulich - Endurance athlete and entrepreneur"
        className="img-fade absolute inset-0 w-full h-full object-cover object-center grayscale brightness-[0.62]"
        {...fadeInProps}
        loading="eager"
        {...({ fetchpriority: "high" } as object)}
        decoding="async"
        onError={fallbackToOriginal(content.background_image_url)}
      />
      <div aria-hidden="true" className="absolute inset-0 hero-shade" />

      <div className="hero-composition relative z-10 container-wide pt-32 pb-12 lg:pb-16">
        <div className="reveal">
          <p className="eyebrow eyebrow-readable text-brand-warm font-bold mb-5 md:mb-7 [&]:text-brand-warm tracking-normal">{content.subtitle}</p>
          <h1 className="hero-headline font-display text-[clamp(1.5rem,5.5vw,6.6rem)]">
            <span className="block text-brand-warm">{lead}</span>
            {accent && <span className="block text-brand-red">{accent}</span>}
          </h1>
          <p className="font-editorial text-brand-warm/85 text-[clamp(1.1rem,1.4vw,1.55rem)] leading-[1.5] max-w-[46rem] mt-7 md:mt-10">
            {content.description}
          </p>
        </div>
      </div>
    </section>
  );
};
