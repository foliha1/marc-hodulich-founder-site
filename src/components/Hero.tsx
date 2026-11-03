import { ChevronDown } from "lucide-react";
import { useHeroContent } from "@/hooks/useHeroContent";
import { getOptimizedImageUrl, getResponsiveSrcSet, fallbackToOriginal } from "@/utils/imageOptimization";
import { Navigation } from "@/components/Navigation";

export const Hero = () => {
  const { data: content } = useHeroContent();

  if (!content) {
    return (
      <section className="w-full bg-brand-red text-white lg:min-h-screen relative overflow-hidden">
        <Navigation variant="light" />
      </section>
    );
  }

  return (
    <section className="w-full bg-brand-red text-white lg:min-h-screen relative overflow-hidden">
      <Navigation variant="light" />

      {/* Text Content Overlay - Left justified, starts below logo on mobile */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 pt-32 pb-8 lg:min-h-screen flex items-start lg:items-center">
        <div className="max-w-2xl animate-in">
          <h1 className="hero-title text-white mb-6" dangerouslySetInnerHTML={{ __html: content.title }} />
          <p className="body-text mb-8 text-white/90">
            {content.description}
          </p>
          <div className="caption-text text-white/80 mb-8">
            {content.subtitle}
          </div>

          {/* Scroll indicator - directly beneath subtitle */}
          <div className="animate-bounce opacity-100" aria-hidden="true">
            <ChevronDown className="w-6 h-6 text-white/80" />
          </div>
        </div>
      </div>

      {/* Hero Image - single responsive image (previously 3 separate tags downloaded the photo 3 times) */}
      <div className="relative w-full min-h-80 md:min-h-0 lg:absolute lg:bottom-0 lg:right-0 lg:w-[clamp(56.16vw,70.2vw,84.24vw)] lg:min-h-[84vh] lg:max-h-[100vh] lg:h-[93.6vh] animate-in">
        <img
          srcSet={getResponsiveSrcSet(content.background_image_url, [640, 854, 1280, 1920], 85)}
          sizes="(min-width: 1024px) 70vw, 100vw"
          src={getOptimizedImageUrl(content.background_image_url, 1280, 85)}
          alt="Marc Hodulich - Endurance athlete and entrepreneur"
          width={content.background_image_width || 1280}
          height={content.background_image_height || 1920}
          className="w-full h-auto lg:h-full object-contain object-bottom"
          loading="eager"
          {...({ fetchpriority: "high" } as object)}
          decoding="async"
          onError={fallbackToOriginal(content.background_image_url)}
        />
      </div>
    </section>
  );
};
