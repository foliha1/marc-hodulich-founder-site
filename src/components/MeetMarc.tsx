import familyImage from "@/assets/family-skiing-image.jpg";
import entrepreneurImage from "@/assets/entrepreneur-summit-image.jpg";
import athleteImage from "@/assets/endurance-athlete-mountain.jpg";
import founderImage from "@/assets/29029-founder-summit.jpg";

export const MeetMarc = () => {
  return (
    <section className="w-full bg-brand-warm">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-36 pb-24">
        <div className="animate-slide-up">
          <h3 className="hero-title text-brand-ink">MEET MARC</h3>
        </div>
      </div>

      {/* Staggered Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-48">
        <div className="space-y-32">
          {/* Card 1: Family - Image Left, Content Right */}
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <img 
                src={familyImage} 
                alt="Marc with his family"
                className="w-full h-[400px] object-cover rounded"
              />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h4 className="subtitle text-brand-ink">Grounded in Family</h4>
              <p className="body-text text-brand-ink-sub leading-relaxed">
                Beyond the business, Marc is a devoted husband and father, proudest of the time 
                spent traveling and creating memories with his wife and their two boys. He speaks 
                of the balance between ambition and presence.
              </p>
            </div>
          </div>

          {/* Card 2: Struggle - Image Right, Content Left */}
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            <div className="lg:w-1/2">
              <img 
                src={athleteImage} 
                alt="Marc as an endurance athlete"
                className="w-full h-[400px] object-cover rounded"
              />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h4 className="subtitle text-brand-ink">Lessons in Struggle</h4>
              <p className="body-text text-brand-ink-sub leading-relaxed">
                Across ultramarathons, Ironmans, and countless climbs, Marc has discovered that 
                real transformation comes in the struggle, in those moments where it feels 
                impossible and you continue anyway.
              </p>
            </div>
          </div>

          {/* Card 3: Building - Image Left, Content Right */}
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <img 
                src={entrepreneurImage} 
                alt="Marc in his entrepreneur role"
                className="w-full h-[400px] object-cover rounded"
              />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h4 className="subtitle text-brand-ink">Building Beyond Limits</h4>
              <p className="body-text text-brand-ink-sub leading-relaxed">
                From that moment on, Marc has been building environments that push people past 
                their perceived limits, not for the sake of conquering summits, but to reveal 
                new versions of themselves along the way.
              </p>
            </div>
          </div>

          {/* Card 4: Mapping - Image Right, Content Left */}
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            <div className="lg:w-1/2">
              <img 
                src={founderImage} 
                alt="29029 Founder Summit"
                className="w-full h-[400px] object-cover rounded"
              />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h4 className="subtitle text-brand-ink">Mapping the Edges</h4>
              <p className="body-text text-brand-ink-sub leading-relaxed">
                His role is to be a cartographer of limits, drawing new maps for people to 
                follow into deeper, truer versions of themselves. He believes that discomfort 
                is not a punishment but a teacher.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};