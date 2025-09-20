export const Movement = () => {
  return <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up">
          <h1 className="display-title text-brand-ink mb-6">THE PEAK IS NOT THE POINT</h1>
          <p className="body-text text-brand-ink-sub max-w-3xl mb-12 leading-relaxed">29029 created a new category. It has redefined who endurance sport was for. And with Marc leading the way it has curated a community of thousands in search of their best self. It is a container for belief, an expression of a broader philosophy - challenge reveals character and care scales transformation.</p>
        </div>
        
        {/* Movement Video */}
        <div className="w-full h-[400px] rounded-[4px] mb-16 overflow-hidden relative group">
          <a 
            href="https://29029.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full h-full relative"
          >
            <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
              <source src="https://res.cloudinary.com/dlb8cwtfd/video/upload/v1757398003/ssvid_1920x1080_-_02_r63sn4.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 smooth-transition flex items-center justify-center">
              <span className="text-white text-2xl font-bold tracking-wider">DISCOVER 29029</span>
            </div>
          </a>
        </div>
        
        <div className="animate-slide-up">
          <blockquote className="mx-auto text-center max-w-5xl mt-16 px-8 py-[200px] md:py-[250px] lg:py-[300px]">
            <p className="display-title text-brand-ink italic leading-relaxed text-3xl md:text-4xl lg:text-5xl">
              "Marc's presence isn't about the summit—it's about the belief he instills 
              that you can climb further than you thought possible."
            </p>
            <cite className="body-text text-brand-ink-sub mt-8 block not-italic">
              — 29029 Community Member
            </cite>
          </blockquote>
        </div>
      </div>
    </section>;
};