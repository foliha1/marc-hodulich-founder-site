import familyImage from "@/assets/family-skiing-image.jpg";
import entrepreneurImage from "@/assets/entrepreneur-summit-image.jpg";
import athleteImage from "@/assets/marc-hodulich-portrait.jpg";
import founderImage from "@/assets/29029-everesting-hat.webp";
export const MeetMarc = () => {
  return <section className="w-full bg-brand-warm">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-36 pb-24">
        <div className="animate-slide-up">
          <h3 className="hero-title text-brand-ink">MEET MARC</h3>
        </div>
        <div className="mt-12 max-w-4xl">
          <p className="body-text text-brand-ink-sub leading-relaxed">
            Marc Hodulich is a builder, athlete, and father who believes growth lives at the edge of comfort. His days are guided by simple virtues—curiosity, care, resilience, and presence. Whether starting companies, running ultramarathons, or chasing his kids around the backyard, Marc leads with the conviction that struggle is a teacher, community is strength, and life is richest when built with intention.
          </p>
        </div>
      </div>

      {/* Staggered Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-48">
        <div className="space-y-32">
          {/* Card 1: Family - Image Left, Content Right */}
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <img src={familyImage} alt="Marc with his family" className="w-full h-[400px] object-cover rounded" />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h4 className="subtitle text-brand-ink">Grounded in Family</h4>
              <p className="body-text text-brand-ink-sub leading-relaxed">
                It all starts at home. Marc is a devoted father and husband, proudest of the men his boys are becoming and the relationship he shares with his wife and parents. He speaks of the balance between setting big goals and prioritizing moments with loved ones.
              </p>
            </div>
          </div>

          {/* Card 2: Struggle - Image Right, Content Left */}
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            <div className="lg:w-1/2">
              <img src={athleteImage} alt="Marc as an endurance athlete" className="w-full h-[400px] object-cover rounded" />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h4 className="subtitle text-brand-ink">Lessons in Struggle</h4>
              <p className="body-text text-brand-ink-sub leading-relaxed">Through countless summits and 100 mile finish lines, Marc has discovered the best version of himself appears in the struggle, in those moments where it feels impossible and your world narrows to simple decisions that can change your perception of who you truly are.</p>
            </div>
          </div>

          {/* Card 3: Building - Image Left, Content Right */}
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <img src={entrepreneurImage} alt="Marc in his entrepreneur role" className="w-full h-[400px] object-cover rounded" />
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
              <img src={founderImage} alt="29029 Founder Summit" className="w-full h-[400px] object-cover rounded" />
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
    </section>;
};