const socialPosts = [
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&h=320&fit=crop&crop=center", alt: "Marc on the mountain" },
  { src: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=320&h=320&fit=crop&crop=center", alt: "Family adventure" },  
  { src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=320&h=320&fit=crop&crop=center", alt: "29029 community" },
  { src: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=320&h=320&fit=crop&crop=center", alt: "Training session" },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com/marchodulich" },
  { name: "LinkedIn", href: "https://linkedin.com/in/marchodulich" },
  { name: "X", href: "https://x.com/marchodulich" },
];

export const Social = () => {
  return (
    <section className="w-full bg-white section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up mb-16">
          <h1 className="display-title text-brand-ink mb-6">In the Wild</h1>
        </div>
        
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {socialPosts.map((post, index) => (
              <div 
                key={index}
                className="animate-fade-in card-shadow rounded-[4px] overflow-hidden flex-shrink-0 smooth-transition hover:elegant-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img 
                  src={post.src} 
                  alt={post.alt}
                  className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 object-cover"
                />
              </div>
            ))}
          </div>
          
        </div>
        
        <div className="flex gap-6">
          {socialLinks.map((link, index) => (
            <a 
              key={index}
              href={link.href}
              className="body-text text-brand-ink hover:text-brand-red smooth-transition underline font-medium"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};