import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import familySkiingImage from "@/assets/family-skiing-image.jpg";
import entrepreneurSummitImage from "@/assets/entrepreneur-summit-image.jpg";
import marcHeroPortrait from "@/assets/marc-hero-portrait.jpg";
import everestingHat from "@/assets/29029-everesting-hat.webp";
import enduranceAthlete from "@/assets/endurance-athlete-mountain.jpg";

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
    image: marcHeroPortrait,
    caption: "Leader",
    subcaption: "(Visionary)"
  }
];

export const FailuresFirsts = () => {
  return (
    <section className="w-full bg-brand-warm py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up">
          <h3 className="display-title text-brand-ink mb-6">FAILURES, FIRSTS, AND FOUNDATIONS</h3>
          <p className="body-text text-brand-ink-sub max-w-3xl leading-relaxed mb-16">
            Marc's path as an entrepreneur and athlete proves that failure isn't the end, it's the making of a meaningful story. He sold payroll door-to-door in Manhattan, spent years in management consulting while raising millions for pediatric cancer research through The Wall Street Decathlon, and launched BeerFit, a nationwide mash-up of craft beer and fun runs. Each chapter, whether success or setback, was a step toward 29029, built from day one to be more than a race, a brand defined by You vs. You.
          </p>
        </div>
        
      </div>
      
      {/* Journey Slider - Full Width */}
      <div className="animate-fade-in -mx-6 lg:-mx-8 xl:-mx-[calc((100vw-1280px)/2)]">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="ml-6 lg:ml-8 xl:ml-[calc((100vw-1280px)/2+2rem)]">
            {journeySlides.map((slide, index) => (
              <CarouselItem key={index} className="basis-auto">
                <div className="mr-3 md:mr-6">
                  <div className="relative h-[24rem] md:h-[48rem]">
                    <figure className="relative w-full h-full">
                      <img
                        src={slide.image}
                        alt={`${slide.caption} - ${slide.subcaption}`}
                        draggable="false"
                        className="block h-full object-cover rounded-[4px]"
                        loading="lazy"
                      />
                    </figure>
                  </div>
                  <p className="uppercase text-sm md:text-base font-semibold text-brand-ink mt-4 md:mt-5 leading-tight">
                    {slide.caption}®<br />
                    {slide.subcaption}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};