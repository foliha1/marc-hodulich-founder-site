import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialPost {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  post_type: string;
  instagram_url?: string;
}

interface SocialLink {
  id: string;
  name: string;
  url: string;
  display_order: number;
}

const extractInstagramPostId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

export const Social = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
        
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide px-12"
          >
            {posts.map((post, index) => (
              <div 
                key={post.id}
                className="animate-fade-in card-shadow rounded-[4px] overflow-hidden flex-shrink-0 smooth-transition hover:elegant-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {post.post_type === "instagram_embed" && post.instagram_url ? (
                  (() => {
                    const postId = extractInstagramPostId(post.instagram_url);
                    return postId ? (
                      <iframe
                        src={`https://www.instagram.com/p/${postId}/embed/`}
                        className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 border-0"
                        scrolling="no"
                        title={`Instagram post ${index + 1}`}
                      />
                    ) : (
                      <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center bg-muted">
                        <p className="text-sm text-muted-foreground">Invalid Instagram URL</p>
                      </div>
                    );
                  })()
                ) : (
                  <img 
                    src={post.image_url}
                    alt={post.alt_text}
                    className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
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