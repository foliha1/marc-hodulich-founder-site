import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ChevronRight } from "lucide-react";
import { useCarouselSlides } from "@/hooks/useCarouselSlides";

export const FailuresFirsts = () => {
  const { data, isLoading } = useCarouselSlides();

  if (isLoading || !data || data.slides.length === 0) return null;

  const { slides, section } = data;

  return (
    <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up">
          <h1 className="display-title text-brand-ink mb-6">{section?.title || "FAILURES, FIRSTS, AND FOUNDATIONS"}</h1>
          <p className="body-text text-brand-ink-sub max-w-3xl leading-relaxed mb-8">
            {section?.paragraph || "Marc's path as an entrepreneur and athlete proves that failure isn't the end, it's the making of a meaningful story. He sold payroll door-to-door in Manhattan, spent years in management consulting while raising millions for pediatric cancer research through The Wall Street Decathlon, and launched BeerFit, a nationwide mash-up of craft beer and fun runs. Each chapter, whether success or setback, was a step toward 29029, built from day one to be more than a race, a brand defined by You vs. You."}
          </p>
          <div className="flex justify-start mb-16">
            <div className="animate-bounce-horizontal">
              <ChevronRight className="w-6 h-6 text-brand-ink" />
            </div>
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
          className="w-full"
        >
          <CarouselContent className="ml-6 lg:ml-8">
            {slides.map((slide, index) => (
              <CarouselItem key={slide.id} className="basis-auto">
                <div className="mr-3 md:mr-6">
                  <div className="relative h-[20rem] sm:h-[24rem] md:h-[36rem] lg:h-[48rem]">
                    <figure className="relative w-full h-full">
                      <img
                        src={slide.image_url}
                        alt={`Marc Hodulich as ${slide.caption} - ${slide.subcaption}`}
                        draggable="false"
                        className="block h-full object-cover rounded-[4px]"
                        loading="lazy"
                      />
                    </figure>
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