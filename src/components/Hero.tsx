import marcPortrait from "@/assets/marc-hero-portrait.jpg";

export const Hero = () => {
  return (
    <section className="w-full bg-brand-red text-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-in">
            <h1 className="hero-title text-white mb-6">
              Cartographer of Limits
            </h1>
            <p className="body-text mb-8 text-white/90 max-w-2xl">
              I design transformative environments that guide people beyond their perceived edge.
              The peak isn't the point—the point is who you become by climbing.
            </p>
            <div className="caption-text text-white/80">
              Co‑founder of 29029 • Builder • Speaker
            </div>
          </div>
          
          <div className="relative animate-scale-in">
            <div className="hero-shadow rounded-2xl overflow-hidden">
              <img 
                src='https://res.cloudinary.com/dlb8cwtfd/image/upload/v1757315529/Screenshot_2025-06-05_at_9.21.55_PM_1_2_eedrtd.png' 
                alt="Marc Hodulich - Endurance athlete and entrepreneur" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};