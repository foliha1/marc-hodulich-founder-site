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
  return (
    <section className="w-full bg-brand-warm py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up mb-16">
          <h2 className="display-title text-brand-ink mb-6">Peaks & Valleys</h2>
          <p className="body-text text-brand-muted">
            The map isn't linear. After every low, an inevitable high.
          </p>
        </div>
        
        <div className="space-y-6">
          {peaksValleys.map((item, index) => (
            <div 
              key={index}
              className="group animate-fade-in card-shadow rounded-2xl bg-white p-8 smooth-transition hover:elegant-shadow"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
                <div className="flex flex-col items-center md:items-start">
                  <Badge 
                    variant={item.type === "peak" ? "default" : "destructive"}
                    className={`text-sm font-bold uppercase tracking-wider mb-2 ${
                      item.type === "peak" 
                        ? "bg-brand-red text-white" 
                        : "bg-brand-ink text-white"
                    }`}
                  >
                    {item.type}
                  </Badge>
                  <div className="caption-text text-brand-muted font-medium">
                    {item.year}
                  </div>
                </div>
                
                <div>
                  <h3 className="section-title text-brand-ink mb-4 group-hover:text-brand-red smooth-transition">
                    {item.title}
                  </h3>
                  <p className="body-text text-brand-ink-sub leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};