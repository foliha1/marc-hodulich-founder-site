import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoModal } from "@/components/VideoModal";

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
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
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
              <div 
                key={podcast.id}
                onClick={() => setSelectedVideo(podcast.podcast_url)}
                className="group animate-fade-in card-shadow rounded-[4px] overflow-hidden bg-white smooth-transition hover:elegant-shadow flex-shrink-0 w-80 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={podcast.thumbnail_url}
                    alt={podcast.title}
                    className="w-full h-full object-cover smooth-transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 smooth-transition flex items-center justify-center">
                    <div className="w-16 h-16 bg-brand-red/90 rounded-full flex items-center justify-center smooth-transition group-hover:scale-110">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="section-title text-brand-ink group-hover:text-brand-red smooth-transition">
                    {podcast.title}
                  </h3>
                </div>
              </div>
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

      <VideoModal 
        videoUrl={selectedVideo || ''} 
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  );
};