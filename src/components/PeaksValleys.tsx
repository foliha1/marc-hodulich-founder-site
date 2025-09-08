import { Badge } from "@/components/ui/badge";

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
  const valleys = peaksValleys.filter(item => item.type === "valley");
  const peaks = peaksValleys.filter(item => item.type === "peak");
  
  return (
    <section className="w-full bg-brand-warm py-24">
      <div className="w-full px-6 lg:px-8">
        <div className="max-w-6xl mx-auto animate-slide-up mb-16 text-center">
          <h2 className="display-title text-brand-ink mb-6">Peaks & Valleys</h2>
          <p className="body-text text-brand-muted">
            The map isn't linear. After every low, an inevitable high.
          </p>
        </div>
        
        {/* Staggered Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto">
          {/* Valleys Column - Left */}
          <div className="space-y-12">
            <div className="lg:text-right">
              <h3 className="section-title text-brand-ink mb-8 lg:mb-12">Valleys</h3>
            </div>
            {valleys.map((valley, index) => (
              <div 
                key={`valley-${index}`}
                className="group animate-fade-in py-8 border-b border-brand-ink/20 last:border-b-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="lg:text-right space-y-4">
                  <div className="flex items-center justify-start lg:justify-end gap-3">
                    <Badge className="bg-brand-ink text-white text-sm font-bold uppercase tracking-wider">
                      Valley
                    </Badge>
                    <div className="caption-text text-brand-muted font-medium">
                      {valley.year}
                    </div>
                  </div>
                  <h4 className="section-title text-brand-ink group-hover:text-brand-red smooth-transition">
                    {valley.title}
                  </h4>
                  <p className="body-text text-brand-ink-sub leading-relaxed">
                    {valley.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Peaks Column - Right */}
          <div className="space-y-12">
            <div className="lg:text-left">
              <h3 className="section-title text-brand-ink mb-8 lg:mb-12">Peaks</h3>
            </div>
            {peaks.map((peak, index) => (
              <div 
                key={`peak-${index}`}
                className="group animate-fade-in py-8 border-b border-brand-ink/20 last:border-b-0"
                style={{ animationDelay: `${(index + valleys.length) * 0.1}s` }}
              >
                <div className="lg:text-left space-y-4">
                  <div className="flex items-center justify-start gap-3">
                    <Badge className="bg-brand-red text-white text-sm font-bold uppercase tracking-wider">
                      Peak
                    </Badge>
                    <div className="caption-text text-brand-muted font-medium">
                      {peak.year}
                    </div>
                  </div>
                  <h4 className="section-title text-brand-ink group-hover:text-brand-red smooth-transition">
                    {peak.title}
                  </h4>
                  <p className="body-text text-brand-ink-sub leading-relaxed">
                    {peak.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};