import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import familySkiingImage from "@/assets/new-carousel-image.jpg";
import entrepreneurSummitImage from "@/assets/new-builder-image.jpg";
import newLeaderVisionaryImage from "@/assets/new-leader-visionary-image.jpg";
import everestingHat from "@/assets/new-failures-firsts-image.jpg";
import enduranceAthlete from "@/assets/marc-profile-new.jpg";

const journeySlides = [
  {
    image: familySkiingImage,
    caption: "Father",
    subcaption: "(Family Man)"
  },
  {
    image: entrepreneurSummitImage,
    caption: "Builder",
    subcaption: "(Entrepreneur)"
  },
  {
    image: enduranceAthlete,
    caption: "Athlete",
    subcaption: "(Endurance)"
  },
  {
    image: everestingHat,
    caption: "Founder",
    subcaption: "(29029)"
  },
  {
    image: newLeaderVisionaryImage,
    caption: "Leader",
    subcaption: "(Visionary)"
  }
];

export const FailuresFirsts = () => {
  const titleAnimation = useScrollAnimation();
  const carouselAnimation = useScrollAnimation();

  return (
    <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div 
          ref={titleAnimation.ref} 
          className={`scroll-fade-up ${titleAnimation.isVisible ? 'visible' : ''}`}
        >
          <h1 className="display-title text-brand-ink mb-6">FAILURES, FIRSTS, AND FOUNDATIONS</h1>
          <p className="body-text text-brand-ink-sub max-w-3xl leading-relaxed mb-16">
            Marc's path as an entrepreneur and athlete proves that failure isn't the end, it's the making of a meaningful story. He sold payroll door-to-door in Manhattan, spent years in management consulting while raising millions for pediatric cancer research through The Wall Street Decathlon, and launched BeerFit, a nationwide mash-up of craft beer and fun runs. Each chapter, whether success or setback, was a step toward 29029, built from day one to be more than a race, a brand defined by You vs. You.
          </p>
        </div>
        
      </div>
      
      {/* Journey Slider */}
      <div 
        ref={carouselAnimation.ref} 
        className={`scroll-scale-in -mx-6 lg:-mx-8 ${carouselAnimation.isVisible ? 'visible' : ''}`}
        style={{ transitionDelay: '300ms' }}
      >
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="ml-6 lg:ml-8">
            {journeySlides.map((slide, index) => (
              <CarouselItem key={index} className="basis-auto">
                <div className="mr-3 md:mr-6">
                  <div className="relative h-[20rem] sm:h-[24rem] md:h-[36rem] lg:h-[48rem]">
                    <figure className="relative w-full h-full">
                      <img
                        src={slide.image}
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