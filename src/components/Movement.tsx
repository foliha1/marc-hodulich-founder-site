const logos = [
  { name: "Wall Street Journal", width: "140px" },
  { name: "Forbes", width: "120px" },
  { name: "Outside Magazine", width: "160px" },
  { name: "Spotify", width: "100px" },
];

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
          
          <div className="flex flex-wrap gap-8 mb-12 items-center justify-center md:justify-start">
            {logos.map((logo, index) => (
              <div 
                key={index}
                className="animate-fade-in card-shadow rounded-lg bg-white px-6 py-4 smooth-transition hover:elegant-shadow"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  width: logo.width 
                }}
              >
                <div className="text-brand-ink font-bold text-center text-lg">
                  {logo.name}
                </div>
              </div>
            ))}
          </div>
          
          <blockquote className="border-l-4 border-brand-red pl-6 max-w-4xl">
            <p className="body-text text-brand-ink italic leading-relaxed">
              "Marc's presence isn't about the summit—it's about the belief he instills 
              that you can climb further than you thought possible."
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
};