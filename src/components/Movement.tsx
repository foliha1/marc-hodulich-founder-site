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
  const videoRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playAttempted, setPlayAttempted] = useState(false);

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

  // Lazy load video with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVideoVisible) {
            setIsVideoVisible(true);
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before section is visible
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [isVideoVisible]);

  // Manual play control for cross-browser compatibility
  useEffect(() => {
    if (!isVideoVisible || !videoElementRef.current || playAttempted) return;

    const video = videoElementRef.current;
    
    const attemptPlay = () => {
      // Safari needs a slight delay after mounting
      setTimeout(() => {
        video.play()
          .then(() => {
            console.log('Video autoplay started successfully');
            setIsPlaying(true);
            setPlayAttempted(true);
          })
          .catch((error) => {
            console.warn('Autoplay prevented:', error.message);
            // Autoplay blocked - video will show first frame (acceptable UX)
            setPlayAttempted(true);
          });
      }, 100); // Small delay ensures video is ready
    };

    // If video already has data loaded, play immediately
    if (video.readyState >= 3) { // HAVE_FUTURE_DATA
      attemptPlay();
    } else {
      // Wait for enough data to be loaded
      const handleCanPlay = () => {
        attemptPlay();
        video.removeEventListener('canplay', handleCanPlay);
      };
      video.addEventListener('canplay', handleCanPlay);
      
      return () => video.removeEventListener('canplay', handleCanPlay);
    }
  }, [isVideoVisible, playAttempted]);

  if (!content) return null;

  return <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up">
          <h1 className="display-title text-brand-ink mb-6">{content.title}</h1>
          <p className="body-text text-brand-ink-sub max-w-3xl mb-12 leading-relaxed">{content.description}</p>
        </div>
        
        {/* Movement Video */}
        <div ref={videoRef} className="w-full h-[400px] rounded-[4px] mb-[200px] overflow-hidden relative group">
          <a 
            href={content.video_link_url}
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full h-full relative"
          >
            {isVideoVisible ? (
              <video 
                ref={videoElementRef}
                className="w-full h-full object-cover" 
                muted 
                loop 
                playsInline
                preload="auto"
                poster=""
              >
                <source src={content.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-ink/5 to-brand-ink/10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 border-4 border-brand-ink/20 border-t-brand-ink/60 rounded-full animate-spin"></div>
                  <span className="text-brand-ink-sub text-sm">Loading video...</span>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FB0D1B]/60 to-[#FB0D1B]/0 opacity-0 group-hover:opacity-100 smooth-transition flex items-center justify-center">
              <span className="text-white text-2xl font-bold tracking-wider">DISCOVER 29029</span>
            </div>
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