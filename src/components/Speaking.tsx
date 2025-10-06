import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Podcast {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  podcast_url: string;
  display_order: number;
}

export const Speaking = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      const { data } = await supabase
        .from("podcasts")
        .select("*")
        .order("display_order");
      if (data) setPodcasts(data);
    };
    fetchPodcasts();
  }, []);

  if (podcasts.length === 0) return null;

  return (
    <section className="w-full bg-white section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up mb-16">
          <h1 className="display-title text-brand-ink mb-6">Marc in Conversation</h1>
          <p className="body-text text-brand-ink-sub max-w-3xl">
            Talks and conversations on leadership, endurance, and designing a life with intention.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {podcasts.map((podcast, index) => (
            <a 
              key={podcast.id}
              href={podcast.podcast_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group animate-fade-in card-shadow rounded-[4px] overflow-hidden bg-white smooth-transition hover:elegant-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={podcast.thumbnail_url}
                  alt={podcast.title}
                  className="w-full h-full object-cover smooth-transition group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="section-title text-brand-ink mb-3 group-hover:text-brand-red smooth-transition">
                  {podcast.title}
                </h3>
                <p className="body-text text-brand-ink-sub">
                  {podcast.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};