export const Movement = () => {
  return (
    <section className="w-full bg-brand-warm pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up">
          <h2 className="display-title text-brand-ink mb-6">From Idea to Movement</h2>
          <p className="body-text text-brand-ink-sub max-w-4xl mb-12 leading-relaxed">
            29029 isn't a race; it's a container for belief. One expression of a broader philosophy: 
            challenge reveals character, and care scales transformation.
          </p>
        </div>
        
        {/* Movement Video */}
        <div className="w-full h-[400px] rounded-lg mb-16 overflow-hidden">
          <video 
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://res.cloudinary.com/dlb8cwtfd/video/upload/v1757398003/ssvid_1920x1080_-_02_r63sn4.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="animate-slide-up">
          <blockquote className="mx-auto text-center max-w-6xl mt-16 px-8">
            <p className="display-title text-brand-ink italic leading-relaxed text-3xl md:text-4xl lg:text-5xl">
              "Marc's presence isn't about the summit—it's about the belief he instills 
              that you can climb further than you thought possible."
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
};