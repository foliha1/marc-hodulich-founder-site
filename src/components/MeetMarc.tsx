import familyImage from "@/assets/family-man-soccer.jpg";
import entrepreneurImage from "@/assets/entrepreneur-office.jpg";
import athleteImage from "@/assets/endurance-athlete-mountain.jpg";
import founderImage from "@/assets/29029-founder-summit.jpg";

const identityPillars = [
  {
    title: "Family Man",
    copy: "Marc is most proud of his role as a husband and father. Backyard soccer, travel, and daily time with his kids are non‑negotiables—growth means nothing if home is sacrificed.",
    img: familyImage,
  },
  {
    title: "Entrepreneur",
    copy: "A serial builder who has launched ventures from scratch. Marc applies high standards, intentional design, and care for how people feel in every product and experience.",
    img: entrepreneurImage,
  },
  {
    title: "Endurance Athlete",
    copy: "From Ironmans to the Leadville 100, Marc has embraced struggle as teacher. Endurance revealed that transformation lives in discomfort and patience.",
    img: athleteImage,
  },
  {
    title: "29029 Founder",
    copy: "What began with a brutal night climb on Brasstown Bald grew into 29029: a movement where thousands discover new versions of themselves.",
    img: founderImage,
  },
];

export const MeetMarc = () => {
  return (
    <section className="w-full bg-brand-warm py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up">
          <h2 className="display-title text-brand-ink mb-6">Meet Marc</h2>
          <p className="body-text text-brand-ink-sub max-w-4xl mb-16">
            Great days share a pattern: Be Building. Be Learning. Be Helping. Be Moving. Be Present. Be Still. Be with the people I love. 
            The point of all of it is simple: a calm mind, a fit body, a house full of love.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {identityPillars.map((pillar, index) => (
            <div 
              key={index} 
              className="group animate-fade-in card-shadow rounded-2xl overflow-hidden bg-white smooth-transition hover:elegant-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={pillar.img} 
                  alt={pillar.title}
                  className="w-full h-full object-cover smooth-transition group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <h3 className="section-title text-brand-ink mb-4">{pillar.title}</h3>
                <p className="body-text text-brand-ink-sub leading-relaxed">
                  {pillar.copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};