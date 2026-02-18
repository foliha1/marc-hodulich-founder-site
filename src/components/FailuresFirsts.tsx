import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useCarouselSlides } from "@/hooks/useCarouselSlides";
import { FailuresFirstsSkeleton } from "@/components/FailuresFirstsSkeleton";
import { useEffect, useState } from "react";
import { getOptimizedImageUrl, getResponsiveSrcSet } from "@/utils/imageOptimization";

export const FailuresFirsts = () => {
  const { data, isLoading } = useCarouselSlides();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  if (isLoading || !data || data.slides.length === 0) return <FailuresFirstsSkeleton />;

  const { slides, section } = data;

  return (
    <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up">
          <h1 className="display-title text-brand-ink mb-6">{section?.title || "FAILURES, FIRSTS, AND FOUNDATIONS"}</h1>
          <p className="body-text text-brand-ink-sub max-w-3xl leading-relaxed mb-8">
            {section?.paragraph || "Marc's path as an entrepreneur and athlete proves that failure isn't the end, it's the making of a meaningful story. He sold payroll door-to-door in Manhattan, spent years in management consulting while raising millions for pediatric cancer research through The Wall Street Decathlon, and launched BeerFit, a nationwide mash-up of craft beer and fun runs. Each chapter, whether success or setback, was a step toward 29029, built from day one to be more than a race, a brand defined by You vs. You."}
          </p>
          <div className="flex items-center gap-12 mb-16">
            <button 
              onClick={() => carouselApi?.scrollPrev()} 
              className="transition-transform hover:scale-110 focus:outline-none rounded"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-8 h-8 text-brand-ink" />
            </button>
            <button 
              onClick={() => carouselApi?.scrollNext()} 
              className="transition-transform hover:scale-110 focus:outline-none rounded"
              aria-label="Next slide"
            >
              <ChevronRight className="w-8 h-8 text-brand-ink" />
            </button>
          </div>
        </div>
        
      </div>
      
      {/* Journey Slider */}
      <div className="animate-fade-in -mx-6 lg:-mx-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setCarouselApi}
          className="w-full"
        >
          <CarouselContent className="ml-6 lg:ml-8">
            {slides.map((slide, index) => (
              <CarouselItem key={slide.id} className="basis-auto">
                <div 
                  className="mr-3 md:mr-6 w-[356px] sm:w-[427px] md:w-[640px] lg:w-[854px] cursor-pointer"
                  onClick={() => carouselApi?.scrollNext()}
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      srcSet={getResponsiveSrcSet(slide.image_url, [356, 640, 854, 1280], 80)}
                      sizes="(max-width: 640px) 356px, (max-width: 768px) 427px, (max-width: 1024px) 640px, 854px"
                      src={getOptimizedImageUrl(slide.image_url, 854, 80)}
                      alt={`Marc Hodulich as ${slide.caption} - ${slide.subcaption}`}
                      width={(slide as any).width || 854}
                      height={(slide as any).height || 640}
                      draggable="false"
                      className="w-full h-full object-cover rounded-[4px]"
                      loading="lazy"
                    />
                    {(slide.caption || slide.subcaption) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12 rounded-b-[4px]">
                        {slide.caption && (
                          <p className="text-white font-semibold text-sm md:text-base">{slide.caption}</p>
                        )}
                        {slide.subcaption && (
                          <p className="text-white/80 text-xs md:text-sm mt-1">{slide.subcaption}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};