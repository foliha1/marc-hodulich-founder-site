const socialPosts = [
  { src: "https://placehold.co/320x320?text=Instagram+Post+1", alt: "Marc on the mountain" },
  { src: "https://placehold.co/320x320?text=Instagram+Post+2", alt: "Family adventure" },  
  { src: "https://placehold.co/320x320?text=Instagram+Post+3", alt: "29029 community" },
  { src: "https://placehold.co/320x320?text=Instagram+Post+4", alt: "Training session" },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com/marchodulich" },
  { name: "LinkedIn", href: "https://linkedin.com/in/marchodulich" },
  { name: "X", href: "https://x.com/marchodulich" },
];

export const Social = () => {
  return (
    <section className="w-full bg-brand-warm py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up mb-16">
          <h2 className="display-title text-brand-ink mb-6">In the Wild</h2>
        </div>
        
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {socialPosts.map((post, index) => (
              <div 
                key={index}
                className="animate-fade-in card-shadow rounded-2xl overflow-hidden flex-shrink-0 smooth-transition hover:elegant-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img 
                  src={post.src} 
                  alt={post.alt}
                  className="w-80 h-80 object-cover"
                />
              </div>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-brand-warm via-brand-warm/50 to-transparent pointer-events-none"></div>
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