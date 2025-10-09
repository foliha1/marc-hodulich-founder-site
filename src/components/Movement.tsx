import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MovementContent {
  title: string;
  description: string;
  video_url: string;
  video_link_url: string;
  profile_image_url: string;
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

  return <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up">
          <h1 className="display-title text-brand-ink mb-6">{content.title}</h1>
          <p className="body-text text-brand-ink-sub max-w-3xl mb-12 leading-relaxed">{content.description}</p>
        </div>
        
        {/* Movement Video */}
        <div className="w-full h-[400px] rounded-[4px] mb-[200px] overflow-hidden relative group">
          <a 
            href={content.video_link_url}
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full h-full relative"
          >
            <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
              <source src={content.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#FB0D1B]/60 to-[#FB0D1B]/0 opacity-0 group-hover:opacity-100 smooth-transition flex items-center justify-center">
              <span className="text-white text-2xl font-bold tracking-wider">DISCOVER 29029</span>
            </div>
          </a>
        </div>
        
        <div className="animate-slide-up">
          <div className="flex flex-col items-center">
            <img 
              src={content.profile_image_url}
              alt="Marc Hodulich" 
              className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px] rounded-full object-cover mb-20"
            />
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