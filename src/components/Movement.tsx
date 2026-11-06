import { useEffect, useState, useRef } from "react";
import { useMovementContent } from "@/hooks/useMovementContent";

export const Movement = () => {
  const { data: content } = useMovementContent();
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [hasBeenNear, setHasBeenNear] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  // IntersectionObserver for scroll-triggered autoplay
  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVideoVisible(entry.isIntersecting);
        if (entry.isIntersecting) setHasBeenNear(true);
      },
      { rootMargin: '300px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [content]);

  // Play when visible, pause when out of view; respect reduced motion
  useEffect(() => {
    const video = videoElementRef.current;
    if (!video || !hasBeenNear) return;

    if (!isVideoVisible) {
      video.pause();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    video.play().catch(() => {
      // Silently handle autoplay restrictions (rare with muted videos)
    });
  }, [isVideoVisible, hasBeenNear]);

  // Keep the placeholder up until the poster (or a first frame) is actually on screen
  useEffect(() => {
    if (!hasBeenNear || !content) return;

    const img = new Image();
    img.onload = () => setMediaReady(true);
    img.onerror = () => setMediaReady(true);
    img.src = content.video_url.replace(/\.mp4(\?.*)?$/, '.jpg$1');

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [hasBeenNear, content]);

  if (!content) return null;

  const posterUrl = content.video_url.replace(/\.mp4(\?.*)?$/, '.jpg$1');

  return <>
    <section className="w-full bg-brand-night text-brand-warm section-spacing">
      <div className="container-wide grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-12 lg:gap-x-[6%] items-center">
        <div className="reveal">
          <p className="eyebrow eyebrow-readable mb-6">29029</p>
          <h2 className="font-display text-brand-warm text-[clamp(1.6rem,3.6vw,3.25rem)] mb-8">{content.title}.</h2>
          <p className="text-[clamp(1rem,1.1vw,1.25rem)] text-brand-warm/75 max-w-[38rem] leading-[1.6] mb-12">{content.description}</p>
          <a
            href={content.video_link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-night bg-brand-red text-brand-warm hover:bg-brand-warm hover:text-brand-night"
          >
            Discover 29029 <span aria-hidden="true">→</span>
          </a>
        </div>

        <div ref={videoRef} className="relative w-full aspect-video overflow-hidden reveal bg-brand-warm/5">
          <div
            aria-hidden="true"
            className={`skeleton absolute inset-0 pointer-events-none transition-opacity duration-500 ${
              mediaReady ? "opacity-0" : "opacity-100"
            }`}
          />
          <video
            ref={videoElementRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="none"
            poster={hasBeenNear ? posterUrl : undefined}
            onCanPlay={() => setMediaReady(true)}
            aria-hidden="true"
          >
            {hasBeenNear && <source src={content.video_url} type="video/mp4" />}
          </video>
        </div>
      </div>
    </section>

    <section className="w-full bg-brand-red text-brand-warm py-14 md:py-20">
      <blockquote className="reveal container-wide text-center">
        <p className="testimonial-copy leading-[1.4] max-w-[62rem] mx-auto text-balance">
          "{content.quote?.trim()}"
        </p>
        <cite className="not-italic block mt-8 text-lg font-bold tracking-normal uppercase text-brand-warm">
          — {content.quote_author}
        </cite>
      </blockquote>
    </section>
  </>;
};
