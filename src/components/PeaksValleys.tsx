import { Badge } from "@/components/ui/badge";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const peaksValleys = [
  {
    type: "valley",
    year: "College Years",
    title: "Short races, short horizons",
    desc: "As a miler at Auburn, races were decided in minutes. No lasting transformation, only the sting of bad days and fleeting highs.",
  },
  {
    type: "peak",
    year: "First Ironman",
    title: "Endurance as identity",
    desc: "Completing an Ironman revealed that long struggle builds quiet confidence and rewrites who you believe you are.",
  },
  {
    type: "valley",
    year: "Brasstown Bald Trial",
    title: "Doubt in the dark",
    desc: "On a hot, endless night climb testing 29029, Marc hit insurmountable doubt—then shifted to gratitude: I don't have to push, I get to.",
  },
  {
    type: "peak",
    year: "2017",
    title: "29029 Launches",
    desc: "From a wild idea to a movement—hundreds at the first event discovered that the summit is who you become along the way.",
  },
  {
    type: "valley",
    year: "Leadville 100",
    title: "Pendulum swings",
    desc: "Training 80+ mile weeks tested balance—kids, work, marriage stretched. Marc learned to honor non‑negotiables and communicate through strain.",
  },
  {
    type: "peak",
    year: "Community Stories",
    title: "Ashes on the mountain",
    desc: "Participants spread a father's ashes, forged friendships, and redirected careers—proof that shared struggle compounds impact.",
  },
  {
    type: "valley",
    year: "Injuries & Setbacks",
    title: "Progress isn't linear",
    desc: "Injuries and missed targets forced patience and humility. The map redraws; the climb continues.",
  },
  {
    type: "peak",
    year: "Now",
    title: "Calm / Fit / Love",
    desc: "Marc's north star: A calm mind. A fit body. A house full of love. Every venture and climb points back here.",
  },
];

export const PeaksValleys = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [centeredIndex, setCenteredIndex] = useState(Math.floor(peaksValleys.length / 2));

  const scrollByCard = (direction: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('[data-peak-card]') as HTMLElement;
    const step = card ? card.getBoundingClientRect().width + 16 : 376; // 360px + gap
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      
      const cards = el.querySelectorAll('[data-peak-card]');
      const containerCenter = el.offsetLeft + el.offsetWidth / 2;
      
      let closestIndex = 0;
      let minDistance = Infinity;
      
      cards.forEach((card, index) => {
        const cardElement = card as HTMLElement;
        const cardCenter = cardElement.offsetLeft + cardElement.offsetWidth / 2 - el.scrollLeft;
        const distance = Math.abs(cardCenter - containerCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      
      setCenteredIndex(closestIndex);
    };

    const el = trackRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  return (
    <section className="w-full bg-white pt-24 pb-24" aria-labelledby="pv-title">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Centered Header */}
        <div className="text-center mb-6">
          <h2 id="pv-title" className="display-title text-brand-ink">PEAKS & VALLEYS</h2>
        </div>

        <div className="text-center mb-16">
          <p className="body-text text-brand-muted max-w-2xl mx-auto">
            The map isn't linear. After every low, an inevitable high.
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center gap-2 mb-8">
          <button 
            onClick={() => scrollByCard(-1)}
            aria-label="Scroll left"
            className="p-2 rounded-[4px] border border-brand-ink/20 bg-white text-brand-ink hover:bg-brand-ink hover:text-white smooth-transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scrollByCard(1)}
            aria-label="Scroll right"
            className="p-2 rounded-[4px] border border-brand-ink/20 bg-white text-brand-ink hover:bg-brand-ink hover:text-white smooth-transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Full Width Horizontal Scroller Container */}
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          {/* Full Width Timeline Stroke */}
          <div className="absolute top-6 left-0 right-0 h-3 pointer-events-none z-20">
            {/* Full Width Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-brand-ink transform -translate-y-1/2" />
            
            {/* Single Centered Dot */}
            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-brand-ink rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Left Fade Overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          
          {/* Right Fade Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

          {/* Scrollable Track */}
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide pt-16 px-6"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {peaksValleys.map((item, index) => (
              <article
                key={`${item.type}-${index}`}
                data-peak-card
                className={`min-w-[360px] max-w-[360px] snap-start bg-white border border-brand-ink/10 rounded-[4px] shadow-sm hover:shadow-md smooth-transition animate-fade-in ${
                  centeredIndex === index ? 'opacity-100' : 'opacity-40'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6 flex flex-col gap-4">
                  {/* Header with Badge and Year */}
                  <header className="flex items-baseline justify-between">
                    <Badge 
                      className={`text-xs font-bold uppercase tracking-wider ${
                        item.type === "peak" 
                          ? "bg-brand-red text-white border-brand-red" 
                          : "bg-brand-ink text-white border-brand-ink"
                      }`}
                    >
                      {item.type}
                    </Badge>
                    <span className="caption-text text-brand-muted font-medium uppercase tracking-[0.02em]">
                      {item.year}
                    </span>
                  </header>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-brand-ink uppercase tracking-[0.02em]">
                    {item.title}
                  </h3>
                  <p className="body-text text-brand-ink-sub leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};