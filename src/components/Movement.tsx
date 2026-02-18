import { useEffect, useRef, useState } from "react";
import { useMovementContent } from "@/hooks/useMovementContent";

export const Movement = () => {
  const { data: content } = useMovementContent();
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  // IntersectionObserver for scroll-triggered autoplay
  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVideoVisible(true);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Attempt autoplay when video becomes visible
  useEffect(() => {
    const video = videoElementRef.current;
    if (!video || !isVideoVisible) return;

    video.play().catch(() => {
      // Silently handle autoplay restrictions (rare with muted videos)
    });
  }, [isVideoVisible]);

  if (!content) return null;

  const posterUrl = content.video_url.replace(/\.mp4(\?.*)?$/, '.jpg$1');

  return (
    <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up">
          <h1 className="display-title text-brand-ink mb-6">{content.title}</h1>
          <p className="body-text text-brand-ink-sub max-w-3xl mb-12 leading-relaxed">{content.description}</p>
        </div>
        
        {/* Movement Video - Autoplay on scroll */}
        <div
          ref={videoRef}
          className="relative w-full h-[400px] rounded-[4px] mb-24 md:mb-32 lg:mb-48 overflow-hidden group"
        >
          <video
            ref={videoElementRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            poster={posterUrl}
          >
            <source src={content.video_url} type="video/mp4" />
          </video>
          
          {/* "Discover 29029" CTA overlay on hover */}
          <a
            href={content.video_link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-gradient-to-t from-[#FB0D1B]/60 to-[#FB0D1B]/0 opacity-0 group-hover:opacity-100 smooth-transition flex items-center justify-center z-10"
          >
            <span className="text-white text-2xl font-bold tracking-wider">DISCOVER 29029</span>
          </a>
        </div>
        
        <div className="animate-slide-up">
          <div className="flex flex-col items-center">
            <blockquote className="mx-auto text-center max-w-5xl px-8">
              <p className="display-title text-brand-ink italic leading-relaxed text-3xl md:text-4xl lg:text-5xl">
                "{content.quote}"
              </p>
              <cite className="body-text text-brand-ink-sub mt-8 block not-italic">
                — {content.quote_author}
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};
