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
    <section id="conversation" className="w-full bg-brand-night text-brand-warm scroll-mt-20 border-t-[14px] border-brand-red pt-[clamp(120px,15vw,200px)] pb-[clamp(64px,7vw,100px)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10 lg:mb-12 reveal">
          <h2 className="font-display text-brand-warm text-[clamp(1.85rem,4.6vw,4.25rem)] mb-4">{section?.title || "Moments"}</h2>
          <p className="body-text text-brand-warm/70 max-w-2xl">
            {section?.paragraph || "Talks and conversations on leadership, endurance, and designing a life with intention."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-brand-warm/10">
          {podcasts.map((podcast, index) => (
            <button
              type="button"
              key={podcast.id}
              onClick={() => setSelectedVideo(podcast.podcast_url)}
              aria-label={`Play: ${podcast.title}`}
              className="group reveal block w-full text-left border-r border-b border-brand-warm/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video overflow-hidden relative bg-brand-warm/5">
                <img
                  srcSet={getResponsiveSrcSet(podcast.thumbnail_url, [356, 640], 80)}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  src={getOptimizedImageUrl(podcast.thumbnail_url, 640, 80)}
                  alt={podcast.title}
                  className="img-fade w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  {...fadeInProps}
                  loading="lazy"
                  decoding="async"
                  onError={fallbackToOriginal(podcast.thumbnail_url)}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-brand-night/30 group-hover:bg-brand-night/10 smooth-transition flex items-center justify-center">
                  <div className="w-11 h-11 bg-brand-red flex items-center justify-center smooth-transition group-hover:scale-110">
                    <svg className="w-5 h-5 text-brand-warm ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </div>
              <div className="p-4 lg:p-5 pb-6">
                <span className="block font-display text-sm leading-snug text-brand-warm group-hover:text-brand-red smooth-transition">
                  {podcast.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {press.length > 0 && (
          <div className="mt-16 lg:mt-20">
            <p className="eyebrow eyebrow-readable mb-8 reveal">Features &amp; Press</p>
            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-brand-warm/10">
              {press.map((f, index) => (
                <a
                  key={f.id}
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group reveal flex items-center gap-5 p-5 border-r border-b border-brand-warm/10"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {f.image_url && (
                    <div className="w-32 h-auto sm:h-56 sm:w-40 lg:h-64 lg:w-48 shrink-0 overflow-hidden bg-brand-warm/5">
                      <img
                        src={getOptimizedImageUrl(f.image_url, 480, 85)}
                        alt=""
                        className="img-fade w-full h-auto sm:h-full object-contain"
                        {...fadeInProps}
                        onError={fallbackToOriginal(f.image_url)}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="block text-[0.65rem] font-semibold tracking-[0.3em] uppercase text-brand-red mb-2">{f.outlet}</span>
                    <span className="block text-sm text-brand-warm group-hover:text-brand-red smooth-transition line-clamp-2">
                      {f.title} <span aria-hidden="true" className="text-brand-warm/40">↗</span>
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