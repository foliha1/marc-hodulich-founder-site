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
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

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
            if (videoRef.current) observer.unobserve(videoRef.current);
          }
        });
      },
      {
        rootMargin: '800px', // Start loading 800px before section is visible
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

  // Manual play control with comprehensive diagnostics
  useEffect(() => {
    if (!isVideoVisible || !videoElementRef.current || playAttempted) return;

    const video = videoElementRef.current;
    let cleaned = false;

    const mediaErrorToText = (err?: MediaError | null) => {
      if (!err) return 'Unknown media error';
      switch (err.code) {
        case MediaError.MEDIA_ERR_ABORTED: return 'Playback aborted';
        case MediaError.MEDIA_ERR_NETWORK: return 'Network error';
        case MediaError.MEDIA_ERR_DECODE: return 'Decoding error';
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: return 'Source not supported';
        default: return 'Unknown media error';
      }
    };

    const onError = () => {
      const message = mediaErrorToText(video.error);
      console.error('Video error:', message, video.error);
      setHasError(true);
      setErrorInfo(message);
      setPlayAttempted(true);
    };

    const onPlaying = () => {
      console.log('Video event: playing');
      setIsPlaying(true);
    };

    const attemptPlay = () => {
      // Ensure muted + inline before play to satisfy mobile Safari
      video.muted = true;
      (video as any).playsInline = true;

      setTimeout(() => {
        video.play()
          .then(() => {
            console.log('Video autoplay started successfully');
            setIsPlaying(true);
            setPlayAttempted(true);
          })
          .catch((err) => {
            console.warn('Autoplay prevented or failed:', err?.message || err);
            setPlayAttempted(true);
          });
      }, 120);
    };

    const onCanPlay = () => {
      console.log('Video event: canplay');
      attemptPlay();
      video.removeEventListener('canplay', onCanPlay);
    };
    const onCanPlayThrough = () => {
      console.log('Video event: canplaythrough');
      if (!isPlaying) attemptPlay();
      video.removeEventListener('canplaythrough', onCanPlayThrough);
    };
    const onLoadedData = () => {
      console.log('Video event: loadeddata');
      if (!isPlaying && !playAttempted) attemptPlay();
      video.removeEventListener('loadeddata', onLoadedData);
    };
    const onLoadedMetadata = () => {
      console.log('Video event: loadedmetadata');
      if (!isPlaying && !playAttempted) attemptPlay();
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
    const onWaiting = () => console.warn('Video event: waiting');
    const onStalled = () => console.warn('Video event: stalled');
    const onSuspend = () => console.warn('Video event: suspend');
    const onAbort = () => console.warn('Video event: abort');

    video.addEventListener('error', onError);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('canplaythrough', onCanPlayThrough);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('stalled', onStalled);
    video.addEventListener('suspend', onSuspend);
    video.addEventListener('abort', onAbort);

    // If video already has data, try immediately
    if (video.readyState >= 3) attemptPlay();

    // Safety timeout: ensure playAttempted is set after 1500ms
    const safetyTimeout = setTimeout(() => {
      if (!playAttempted) {
        console.warn('Video: Safety timeout triggered, showing tap-to-play');
        setPlayAttempted(true);
      }
    }, 1500);

    return () => {
      if (cleaned) return;
      cleaned = true;
      clearTimeout(safetyTimeout);
      video.removeEventListener('error', onError);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('canplaythrough', onCanPlayThrough);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('stalled', onStalled);
      video.removeEventListener('suspend', onSuspend);
      video.removeEventListener('abort', onAbort);
    };
  }, [isVideoVisible, playAttempted, isPlaying]);

  if (!content) return null;

  // Derive poster image from video URL
  const posterUrl = content.video_url.replace(/\.mp4(\?.*)?$/, '.jpg$1');

  return <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up">
          <h1 className="display-title text-brand-ink mb-6">{content.title}</h1>
          <p className="body-text text-brand-ink-sub max-w-3xl mb-12 leading-relaxed">{content.description}</p>
        </div>
        
        {/* Movement Video */}
        <div ref={videoRef} className="w-full h-[400px] rounded-[4px] mb-[200px] overflow-hidden relative group">
          {isVideoVisible ? (
            <video 
              ref={videoElementRef}
              className="w-full h-full object-cover" 
              muted 
              loop 
              playsInline
              preload="auto"
              crossOrigin="anonymous"
              poster={posterUrl}
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

          {/* Tap-to-play overlay */}
          {!hasError && playAttempted && !isPlaying && (
            <button
              type="button"
              onClick={() => videoElementRef.current?.play().catch(() => {})}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 text-white font-medium text-lg hover:bg-black/40 smooth-transition"
            >
              Tap to play
            </button>
          )}

          {/* Error overlay */}
          {hasError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/40 text-white text-center px-6">
              <div className="text-sm opacity-80">
                We couldn't load this video{errorInfo ? `: ${errorInfo}` : ''}.
              </div>
              <div className="flex gap-3">
                <a 
                  className="underline hover:no-underline" 
                  href={content.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Open video
                </a>
                <a 
                  className="underline hover:no-underline" 
                  href={content.video_link_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Learn about 29029
                </a>
              </div>
            </div>
          )}

          {/* "Discover 29029" CTA overlay */}
          <a
            href={content.video_link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10 bg-gradient-to-t from-[#FB0D1B]/60 to-[#FB0D1B]/0 opacity-0 group-hover:opacity-100 smooth-transition flex items-center justify-center pointer-events-none group-hover:pointer-events-auto focus-within:pointer-events-auto"
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