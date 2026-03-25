import { ChevronDown } from "lucide-react";
import { useHeroContent } from "@/hooks/useHeroContent";
import { getOptimizedImageUrl, getResponsiveSrcSet } from "@/utils/imageOptimization";
import { Navigation } from "@/components/Navigation";

export const Hero = () => {
  const { data: content, isLoading } = useHeroContent();

  if (isLoading || !content) {
    return (
      <section className="w-full bg-brand-red text-white lg:min-h-screen relative overflow-hidden">
      </section>
    );
  }

  return (
    <section className="w-full bg-brand-red text-white lg:min-h-screen relative overflow-hidden">
      <Navigation variant="light" />
      
      {/* Hero Image - Desktop: Right bleed with limited scaling (±20%) */}
      <div className="hidden lg:block absolute bottom-0 right-0 w-[clamp(56.16vw,70.2vw,84.24vw)] min-h-[84vh] max-h-[100vh] h-[93.6vh] animate-in">
        <img 
          srcSet={getResponsiveSrcSet(content.background_image_url, [854, 1280, 1920], 85)}
          sizes="(min-width: 1024px) 70vw, 100vw"
          src={getOptimizedImageUrl(content.background_image_url, 1280, 85)}
          alt="Marc Hodulich - Endurance athlete and entrepreneur"
          width={(content as any).background_image_width || 1280}
          height={(content as any).background_image_height || 1920}
          className="w-full h-full object-contain object-bottom"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      
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
          <div className="animate-bounce opacity-100">
            <ChevronDown className="w-6 h-6 text-white/80" />
          </div>
        </div>
      </div>

      {/* Tablet Hero Image - Below content with appropriate sizing */}
      <div className="hidden md:block lg:hidden relative w-full animate-in">
        <img 
          srcSet={getResponsiveSrcSet(content.background_image_url, [640, 854, 1280], 85)}
          sizes="(min-width: 768px) 100vw, 640px"
          src={getOptimizedImageUrl(content.background_image_url, 854, 85)}
          alt="Marc Hodulich - Endurance athlete and entrepreneur"
          width={(content as any).background_image_width || 854}
          height={(content as any).background_image_height || 1280}
          className="w-full h-auto object-contain object-bottom"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Mobile Hero Image - Below content with no cropping */}
      <div className="md:hidden relative w-full min-h-80 animate-in">
        <img 
          srcSet={getResponsiveSrcSet(content.background_image_url, [356, 640], 85)}
          sizes="100vw"
          src={getOptimizedImageUrl(content.background_image_url, 640, 85)}
          alt="Marc Hodulich - Endurance athlete and entrepreneur"
          width={(content as any).background_image_width || 640}
          height={(content as any).background_image_height || 960}
          className="w-full h-full object-contain object-bottom"
          loading="eager"
          decoding="async"
        />
      </div>
    </section>
  );
};
