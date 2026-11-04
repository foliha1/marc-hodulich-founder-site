import { useEffect, useState, useRef } from "react";
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
        setIsVideoVisible(entry.isIntersecting);
      },
      { rootMargin: '200px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Play when visible, pause when out of view; respect reduced motion
  useEffect(() => {
    const video = videoElementRef.current;
    if (!video) return;

    if (!isVideoVisible) {
      video.pause();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    video.play().catch(() => {
      // Silently handle autoplay restrictions (rare with muted videos)
    });
  }, [isVideoVisible]);

  if (!content) return null;

  const posterUrl = content.video_url.replace(/\.mp4(\?.*)?$/, '.jpg$1');

  return <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="reveal">
          <h2 className="display-title text-brand-ink mb-6">{content.title}</h2>
          <p className="body-text text-brand-ink-sub max-w-3xl mb-12 leading-relaxed">{content.description}</p>
        </div>
        
        {/* Movement Video - Autoplay on scroll */}
        <div
          ref={videoRef}
          className="relative w-full h-[400px] rounded-[4px] mb-24 lg:mb-[200px] overflow-hidden group reveal"
        >
          <video
            ref={videoElementRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="none"
            poster={posterUrl}
            aria-hidden="true"
          >
            <source src={content.video_url} type="video/mp4" />
          </video>
          
          {/* "Discover 29029" CTA overlay on hover */}
          <a
            href={content.video_link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-gradient-to-t from-[#FB0D1B]/60 to-[#FB0D1B]/0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white smooth-transition flex items-end justify-center pb-8 lg:items-center lg:pb-0 z-10"
          >
            <span className="text-white text-2xl font-bold tracking-wider">DISCOVER 29029</span>
          </a>
        </div>
        
        <div className="reveal">
          <div className="flex flex-col items-center">
            <blockquote className="mx-auto text-left md:text-center max-w-5xl px-0 md:px-8">
              <p className="display-title text-brand-ink italic text-[1.375rem] leading-snug md:text-4xl lg:text-5xl max-md:text-balance">
                "{content.quote}"
              </p>
              <cite className="body-text text-brand-ink-sub mt-8 block not-italic">
                — {content.quote_author}
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>;
};
