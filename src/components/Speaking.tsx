import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Podcast {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  podcast_url: string;
  display_order: number;
}

export const Speaking = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const fetchPodcasts = async () => {
      const { data } = await supabase
        .from("podcasts")
        .select("*")
        .order("display_order");
      if (data) setPodcasts(data);
    };
    fetchPodcasts();
  }, []);

  if (podcasts.length === 0) return null;

  return (
    <section className="w-full bg-white section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up mb-16">
          <h1 className="display-title text-brand-ink mb-6">Marc in Conversation</h1>
          <p className="body-text text-brand-ink-sub max-w-3xl">
            Talks and conversations on leadership, endurance, and designing a life with intention.
          </p>
        </div>
        
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide px-12"
          >
            {podcasts.map((podcast, index) => (
              <a 
                key={podcast.id}
                href={podcast.podcast_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group animate-fade-in card-shadow rounded-[4px] overflow-hidden bg-white smooth-transition hover:elegant-shadow flex-shrink-0 w-80"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={podcast.thumbnail_url}
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
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};