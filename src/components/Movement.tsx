import { useEffect, useState } from "react";
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

  if (!content) return null;

  // Derive poster image from video URL
  const posterUrl = content.video_url.replace(/\.mp4(\?.*)?$/, '.jpg$1');

  return <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up">
          <h1 className="display-title text-brand-ink mb-6">{content.title}</h1>
          <p className="body-text text-brand-ink-sub max-w-3xl mb-12 leading-relaxed">{content.description}</p>
        </div>
        
        {/* Movement Video - Click to watch */}
        <a
          href={content.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-[400px] rounded-[4px] mb-[200px] overflow-hidden relative group cursor-pointer"
        >
          <img
            src={posterUrl}
            alt="29029 Movement Video"
            className="w-full h-full object-cover"
          />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 smooth-transition">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-ink ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span className="text-white text-lg font-medium">Watch Video</span>
            </div>
          </div>
          
          {/* "Discover 29029" CTA overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FB0D1B]/60 to-[#FB0D1B]/0 opacity-0 group-hover:opacity-100 smooth-transition flex items-center justify-center pointer-events-none">
            <span className="text-white text-2xl font-bold tracking-wider">DISCOVER 29029</span>
          </div>
        </a>
        
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
