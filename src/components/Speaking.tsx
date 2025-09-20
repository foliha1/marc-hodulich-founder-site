const podcasts = [
  {
    title: "The Tim Ferriss Show",
    description: "On designing transformative experiences and the philosophy behind 29029",
    thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=560&h=315&fit=crop&crop=center",
  },
  {
    title: "Rich Roll Podcast", 
    description: "Endurance, entrepreneurship, and finding balance in extreme pursuits",
    thumbnail: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=560&h=315&fit=crop&crop=center",
  },
  {
    title: "The School of Greatness",
    description: "Building movements that matter and leading through vulnerability", 
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=560&h=315&fit=crop&crop=center",
  },
];

export const Speaking = () => {
  return (
    <section className="w-full bg-white section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up mb-16">
          <h1 className="display-title text-brand-ink mb-6">Marc in Conversation</h1>
          <p className="body-text text-brand-ink-sub max-w-3xl">
            Talks and conversations on leadership, endurance, and designing a life with intention.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {podcasts.map((podcast, index) => (
            <a 
              key={index}
              href="#"
              className="group animate-fade-in card-shadow rounded-[4px] overflow-hidden bg-white smooth-transition hover:elegant-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={podcast.thumbnail} 
                  alt={podcast.title}
                  className="w-full h-full object-cover smooth-transition group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="section-title text-brand-ink mb-3 group-hover:text-brand-red smooth-transition">
                  {podcast.title}
                </h3>
                <p className="body-text text-brand-ink-sub">
                  {podcast.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};