import { useEffect, useState } from "react";
import { VideoModal } from "@/components/VideoModal";
import { usePodcasts } from "@/hooks/usePodcasts";
import { usePressFeatures } from "@/hooks/usePressFeatures";
import { useSectionContent } from "@/hooks/useSectionContent";
import { SpeakingSkeleton } from "@/components/SpeakingSkeleton";
import { getOptimizedImageUrl, getResponsiveSrcSet, fallbackToOriginal, fadeInProps } from "@/utils/imageOptimization";

export const Speaking = () => {
  const { data: podcasts, isLoading } = usePodcasts();
  const { data: section } = useSectionContent("speaking");
  const { data: features } = usePressFeatures();
  const press = (features ?? []).filter((f) => f.kind === "press");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && window.location.hash === "#conversation") {
      document.getElementById("conversation")?.scrollIntoView();
    }
  }, [isLoading]);

  if (isLoading) return <SpeakingSkeleton />;
  if (!podcasts || podcasts.length === 0) return null;

  return (
    <section id="conversation" className="w-full bg-white section-spacing scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10 lg:mb-16 reveal">
          <h2 className="display-title text-brand-ink mb-6">{section?.title || "Marc in Conversation"}</h2>
          <p className="body-text text-brand-ink-sub max-w-3xl">
            {section?.paragraph || "Talks and conversations on leadership, endurance, and designing a life with intention."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {podcasts.map((podcast, index) => (
            <button
              type="button"
              key={podcast.id}
              onClick={() => setSelectedVideo(podcast.podcast_url)}
              aria-label={`Play: ${podcast.title}`}
              className="group reveal rounded-[4px] overflow-hidden smooth-transition press active:scale-[0.97] cursor-pointer block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-4"
              style={{ animationDelay: `${index * 0.1}s`, backgroundColor: '#f2f2f2' }}
            >
              <div className="aspect-video overflow-hidden relative bg-brand-stone">
                <img 
                  srcSet={getResponsiveSrcSet(podcast.thumbnail_url, [356, 640], 80)}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  src={getOptimizedImageUrl(podcast.thumbnail_url, 640, 80)}
                  alt={podcast.title}
                  className="img-fade w-full h-full object-cover group-hover:scale-105"
                  {...fadeInProps}
                  loading="lazy"
                  decoding="async"
                  onError={fallbackToOriginal(podcast.thumbnail_url)}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-black/20 group-hover:bg-black/30 smooth-transition flex items-center justify-center">
                  <div className="w-16 h-16 bg-brand-red/90 rounded-full flex items-center justify-center smooth-transition group-hover:scale-110">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <span className="block body-text tracking-tight text-brand-ink group-hover:text-brand-red smooth-transition">
                  {podcast.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {press.length > 0 && (
          <div className="mt-16 lg:mt-20 pt-10 border-t border-brand-ink/10">
            <p className="caption-text uppercase tracking-[0.2em] text-brand-red mb-8 reveal">Features &amp; Press</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {press.map((f, index) => (
                <a
                  key={f.id}
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group reveal flex items-center gap-4 rounded-[4px] p-3 smooth-transition"
                  style={{ animationDelay: `${index * 0.08}s`, backgroundColor: "#f2f2f2" }}
                >
                  {f.image_url && (
                    <div className="w-20 h-20 shrink-0 overflow-hidden rounded-[2px] bg-brand-stone">
                      <img
                        src={getOptimizedImageUrl(f.image_url, 160, 80)}
                        alt=""
                        className="img-fade w-full h-full object-cover object-top"
                        {...fadeInProps}
                        onError={fallbackToOriginal(f.image_url)}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="block caption-text uppercase tracking-wider text-brand-red mb-1">{f.outlet}</span>
                    <span className="block caption-text text-brand-ink group-hover:text-brand-red smooth-transition line-clamp-2">
                      {f.title} <span aria-hidden="true" className="text-brand-muted">↗</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <VideoModal 
        videoUrl={selectedVideo || ''} 
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  );
};