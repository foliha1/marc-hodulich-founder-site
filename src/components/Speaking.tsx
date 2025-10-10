import { useState } from "react";
import { VideoModal } from "@/components/VideoModal";
import { usePodcasts } from "@/hooks/usePodcasts";
import { SpeakingSkeleton } from "@/components/SpeakingSkeleton";

export const Speaking = () => {
  const { data: podcasts, isLoading } = usePodcasts();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  if (isLoading || !podcasts || podcasts.length === 0) return <SpeakingSkeleton />;

  return (
    <section className="w-full bg-white section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up mb-16">
          <h1 className="display-title text-brand-ink mb-6">Marc in Conversation</h1>
          <p className="body-text text-brand-ink-sub max-w-3xl">
            Talks and conversations on leadership, endurance, and designing a life with intention.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {podcasts.map((podcast, index) => (
            <div 
              key={podcast.id}
              onClick={() => setSelectedVideo(podcast.podcast_url)}
              className="group animate-fade-in rounded-[4px] overflow-hidden smooth-transition cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s`, backgroundColor: '#f2f2f2' }}
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={podcast.thumbnail_url}
                  alt={podcast.title}
                  className="w-full h-full object-cover smooth-transition group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
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
                <h3 className="body-text text-brand-ink group-hover:text-brand-red smooth-transition">
                  {podcast.title}
                </h3>
              </div>
            </div>
          ))}
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