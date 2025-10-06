import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SocialPost {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
}

interface SocialLink {
  id: string;
  name: string;
  url: string;
  display_order: number;
}

export const Social = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [postsData, linksData] = await Promise.all([
        supabase.from("social_posts").select("*").order("display_order"),
        supabase.from("social_links").select("*").order("display_order"),
      ]);
      if (postsData.data) setPosts(postsData.data);
      if (linksData.data) setLinks(linksData.data);
    };
    fetchData();
  }, []);

  if (posts.length === 0 && links.length === 0) return null;

  return (
    <section className="w-full bg-white section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up mb-16">
          <h1 className="display-title text-brand-ink mb-6">In the Wild</h1>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {posts.map((post, index) => (
              <div 
                key={post.id}
                className="animate-fade-in card-shadow rounded-[4px] overflow-hidden flex-shrink-0 smooth-transition hover:elegant-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img 
                  src={post.image_url}
                  alt={post.alt_text}
                  className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 object-cover"
                />
              </div>
            ))}
          </div>
          
        </div>
        
        <div className="flex gap-6">
          {links.map((link, index) => (
            <a 
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="body-text text-brand-ink hover:text-brand-red smooth-transition underline font-medium"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};