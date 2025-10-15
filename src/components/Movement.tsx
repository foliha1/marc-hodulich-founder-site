import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MovementContent {
  title: string;
  description: string;
  video_url: string;
  video_link_url: string;
  quote: string;
  quote_author: string;
}

export const Movement = () => {
  const [content, setContent] = useState<MovementContent | null>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("movement_content")
        .select("*")
        .single();
      if (data) setContent(data);
    };
    fetchContent();
  }, []);

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

    const attemptPlay = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (error) {
        console.log('Autoplay prevented, waiting for user interaction');
        setIsPlaying(false);
      }
    };

    attemptPlay();
  }, [isVideoVisible]);

  const handleVideoClick = () => {
    const video = videoElementRef.current;
    if (!video) return;

    if (!isPlaying) {
      video.play();
      setIsPlaying(true);
    } else {
      setIsMuted(!isMuted);
    }
  };

  if (!content) return null;

  const posterUrl = content.video_url.replace(/\.mp4(\?.*)?$/, '.jpg$1');

  return <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up">
          <h1 className="display-title text-brand-ink mb-6">{content.title}</h1>
          <p className="body-text text-brand-ink-sub max-w-3xl mb-12 leading-relaxed">{content.description}</p>
        </div>
        
        {/* Movement Video - Autoplay on scroll */}
        <div
          ref={videoRef}
          className="relative w-full h-[400px] rounded-[4px] mb-[200px] overflow-hidden group cursor-pointer"
          onClick={handleVideoClick}
        >
          <video
            ref={videoElementRef}
            className="w-full h-full object-cover"
            muted={isMuted}
            loop
            playsInline
            preload="auto"
            poster={posterUrl}
          >
            <source src={content.video_url} type="video/mp4" />
          </video>
          
          {/* Play button overlay - shows if autoplay failed */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-30">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-ink ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <span className="text-white text-lg font-medium">Tap to Play</span>
              </div>
            </div>
          )}
          
          {/* Unmute button - shows when video is playing */}
          {isPlaying && (
            <div className="absolute bottom-6 right-6 z-20">
              <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 smooth-transition">
                {isMuted ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </div>
            </div>
          )}
          
          {/* "Discover 29029" CTA overlay on hover */}
          <a
            href={content.video_link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-gradient-to-t from-[#FB0D1B]/60 to-[#FB0D1B]/0 opacity-0 group-hover:opacity-100 smooth-transition flex items-center justify-center z-10"
            onClick={(e) => e.stopPropagation()}
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
    </section>;
};
