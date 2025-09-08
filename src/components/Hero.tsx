const marcEmbrace = "/lovable-uploads/2a692b10-4325-4606-baae-8b39af723027.png";

export const Hero = () => {
  return (
    <section className="w-full bg-brand-red text-white min-h-screen relative overflow-hidden">
      {/* Hero Image - positioned to bleed off right and align bottom */}
      <div className="absolute inset-0">
        <img 
          src={marcEmbrace} 
          alt="Marc Hodulich - Endurance athlete and entrepreneur embracing challenge" 
          className="absolute bottom-0 right-0 h-full w-auto object-cover object-bottom translate-x-1/4 lg:translate-x-1/3"
        />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 min-h-screen flex items-center">
        <div className="animate-fade-in max-w-2xl">
          <h1 className="hero-title text-white mb-6">
            Cartographer of Limits
          </h1>
          <p className="body-text mb-8 text-white/90">
            I design transformative environments that guide people beyond their perceived edge.
            The peak isn't the point—the point is who you become by climbing.
          </p>
          <div className="caption-text text-white/80">
            Co‑founder of 29029 • Builder • Speaker
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};