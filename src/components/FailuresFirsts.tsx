import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useCarouselSlides } from "@/hooks/useCarouselSlides";
import { FailuresFirstsSkeleton } from "@/components/FailuresFirstsSkeleton";
import { useEffect, useState } from "react";
import { getOptimizedImageUrl, getResponsiveSrcSet, fallbackToOriginal, fadeInProps } from "@/utils/imageOptimization";

export const FailuresFirsts = () => {
  const { data, isLoading } = useCarouselSlides();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  if (isLoading) return <FailuresFirstsSkeleton />;
  if (!data || data.slides.length === 0) return null;

  const { slides, section } = data;

  return (
    <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="reveal">
          <h2 className="display-title text-brand-ink mb-6">{section?.title || "FAILURES, FIRSTS, AND FOUNDATIONS"}</h2>
          <p className="body-text text-brand-ink-sub max-w-3xl leading-relaxed mb-8">
            {section?.paragraph || "Marc's path as an entrepreneur and athlete proves that failure isn't the end, it's the making of a meaningful story. He sold payroll door-to-door in Manhattan, spent years in management consulting while raising millions for pediatric cancer research through The Wall Street Decathlon, and launched BeerFit, a nationwide mash-up of craft beer and fun runs. Each chapter, whether success or setback, was a step toward 29029, built from day one to be more than a race, a brand defined by You vs. You."}
          </p>
          <div className="flex items-center gap-8 lg:gap-12 mb-10 lg:mb-16">
            <button 
              onClick={() => carouselApi?.scrollPrev()} 
              className="press -m-1.5 flex items-center justify-center w-11 h-11 hover:scale-110 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-4 rounded"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-8 h-8 text-brand-ink" />
            </button>
            <button 
              onClick={() => carouselApi?.scrollNext()} 
              className="press -m-1.5 flex items-center justify-center w-11 h-11 hover:scale-110 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-4 rounded"
              aria-label="Next slide"
            >
              <ChevronRight className="w-8 h-8 text-brand-ink" />
            </button>
          </div>
        </div>
        
      </div>
      
      {/* Journey Slider */}
      <div className="reveal -mx-6 lg:-mx-8">
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
                  <div className="aspect-[4/3] rounded-[4px] bg-brand-stone">
                    <img
                      srcSet={getResponsiveSrcSet(slide.image_url, [356, 640, 854, 1280], 80)}
                      sizes="(max-width: 640px) 356px, (max-width: 768px) 427px, (max-width: 1024px) 640px, 854px"
                      src={getOptimizedImageUrl(slide.image_url, 854, 80)}
                      alt={`Marc Hodulich as ${slide.caption} - ${slide.subcaption}`}
                      width={(slide as any).width || 854}
                      height={(slide as any).height || 640}
                      draggable="false"
                      className="img-fade w-full h-full object-cover rounded-[4px]"
                      {...fadeInProps}
                      loading="lazy"
                      onError={fallbackToOriginal(slide.image_url)}
                    />
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