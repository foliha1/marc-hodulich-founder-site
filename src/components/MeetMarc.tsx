import familyImage from "@/assets/family-man-soccer.jpg";
import entrepreneurImage from "@/assets/entrepreneur-office.jpg";
import athleteImage from "@/assets/endurance-athlete-mountain.jpg";
import founderImage from "@/assets/29029-founder-summit.jpg";

export const MeetMarc = () => {
  return (
    <section className="w-full bg-brand-warm">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-36 pb-6">
        <div className="animate-slide-up">
          <h2 className="display-title text-brand-ink-sub uppercase tracking-wide">About Marc</h2>
        </div>
      </div>

      {/* Hero Statement Block */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <img 
              src={athleteImage} 
              alt="Marc as an endurance athlete"
              className="w-full h-[500px] lg:h-[775px] object-cover rounded"
            />
          </div>
          <div className="lg:col-span-5 lg:pl-12">
            <h3 className="hero-title text-brand-ink uppercase tracking-wider leading-[0.9] mb-8">
              I don't<br/>build events.
            </h3>
          </div>
        </div>
      </div>

      {/* Philosophy Block */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="flex flex-col items-end">
          <div className="lg:max-w-2xl">
            <h3 className="display-title text-brand-ink uppercase tracking-wide mb-12">
              I build environments that remake people.
            </h3>
            <div className="body-text text-brand-ink-sub leading-relaxed space-y-6">
              <p>
                Transformation doesn't happen at the peak—it happens in the push, the pain, and the belief that returns when you almost gave up.
              </p>
              <p>
                The climb is the ritual. The story you write on the way up, that's who you become.
              </p>
              <p>
                And Marc's story is no different.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mapping the Edges Block */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="space-y-12">
              <h3 className="display-title text-brand-ink uppercase tracking-wide">
                Mapping the Edges
              </h3>
              <div className="body-text text-brand-ink-sub leading-relaxed space-y-6">
                <p>
                  Marc Hodulich has spent his life mapping the edges of what people believe is possible.
                </p>
                <p>
                  His journey didn't begin with the backing of big investors or the spotlight of media; it started with two friends hiking a mountain through the night, testing whether the idea would break first or if they would.
                </p>
                <p>
                  From that moment on, Marc has been building environments that push people past their perceived limits, not for the sake of conquering summits, but to reveal new versions of themselves along the way.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <img 
              src={founderImage} 
              alt="29029 Founder Summit"
              className="w-full h-[400px] lg:h-[546px] object-cover rounded"
            />
          </div>
        </div>
      </div>

      {/* Grounded in Family Block */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <img 
              src={familyImage} 
              alt="Marc with his family"
              className="w-full h-[500px] lg:h-[740px] object-cover rounded"
            />
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="space-y-12">
              <h3 className="display-title text-brand-ink uppercase tracking-wide">
                Grounded in Family
              </h3>
              <div className="body-text text-brand-ink-sub leading-relaxed space-y-6">
                <p>
                  Beyond the business, Marc is a devoted husband and father, proudest of the time spent traveling and creating memories with his wife and their two boys.
                </p>
                <p>
                  He speaks of the balance between ambition and presence; sharing that his non-negotiable is time with his children, whether that means playing soccer in the backyard or hiking together outdoors.
                </p>
                <p>
                  This grounding in family fuels his approach: growth without losing sight of what matters most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson in Struggle Block */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="space-y-12">
              <h3 className="display-title text-brand-ink uppercase tracking-wide">
                Lesson in struggle
              </h3>
              <div className="body-text text-brand-ink-sub leading-relaxed space-y-6">
                <p>
                  Across ultramarathons, Ironmans, and countless climbs, Marc has discovered that real transformation comes in the struggle, in those moments where it feels impossible and you continue anyway.
                </p>
                <p>
                  He believes that discomfort is not a punishment but a teacher, that care is not a weakness but a strength, and that the stories we write in our hardest moments are the ones that last.
                </p>
                <p>
                  His role is to be a cartographer of limits, drawing new maps for people to follow into deeper, truer versions of themselves.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <img 
              src={entrepreneurImage} 
              alt="Marc in his entrepreneur role"
              className="w-full h-[400px] lg:h-[594px] object-cover rounded"
            />
          </div>
        </div>
      </div>
    </section>
  );
};