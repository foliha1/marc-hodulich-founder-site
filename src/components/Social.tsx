import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Linkedin, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSectionContent } from "@/hooks/useSectionContent";
import { useSocialPosts, type SocialPost } from "@/hooks/useSocialPosts";
import { getInstagramPostUrl, hasSocialThumbnail } from "@/lib/socialMedia";
import { getOptimizedImageUrl, fallbackToOriginal, fadeInProps } from "@/utils/imageOptimization";

const useSocialLinks = () => useQuery({
  queryKey: ["social-links"],
  queryFn: async () => {
    const { data, error } = await supabase.from("social_links").select("*").order("display_order");
    if (error) throw error;
    return data;
  },
});

const TileMedia = ({ post }: { post: SocialPost }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const poster = getOptimizedImageUrl(post.image_url, 640);
  const treatment = `w-full h-full object-cover transition-[transform,filter] duration-500 motion-safe:group-hover:scale-[1.03]${post.is_grayscale ? " grayscale group-hover:grayscale-0 group-focus-visible:grayscale-0" : ""}`;

  if (!post.video_url) {
    return <img src={poster} alt={post.alt_text} loading="lazy" decoding="async" className={`img-fade ${treatment}`} {...fadeInProps} onError={fallbackToOriginal(post.image_url)} />;
  }

  const play = () => { void videoRef.current?.play().catch(() => undefined); };
  const stop = () => {
    const video = videoRef.current;
    if (video) { video.pause(); video.currentTime = 0; }
  };

  return <video
    ref={videoRef}
    src={post.video_url}
    poster={poster}
    muted
    loop
    playsInline
    preload="none"
    aria-label={post.alt_text}
    className={treatment}
    onMouseEnter={play}
    onMouseLeave={stop}
    onFocus={play}
    onBlur={stop}
  />;
};

// Hover/focus overlay: darkens the tile and reveals a centered Instagram mark.
// On touch devices (no hover), a small corner mark stays visible instead.
const TileOverlay = () => <>
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-brand-night/0 transition-colors duration-300 group-hover:bg-brand-night/40 group-focus-visible:bg-brand-night/40" />
  <Instagram aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-brand-warm opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
  <Instagram aria-hidden="true" className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 text-brand-warm/90 opacity-100 transition-opacity duration-300 group-hover:opacity-0 [@media(hover:hover)]:hidden" />
</>;

export const Social = () => {
  const { data: section } = useSectionContent("social");
  const { data: posts } = useSocialPosts();
  const { data: links } = useSocialLinks();
  const visiblePosts = (posts ?? []).filter(post => hasSocialThumbnail(post.image_url));
  // Never present the old stock images as Marc's Instagram posts.
  if (!visiblePosts.length) return null;

  const instagram = links?.find(link => link.name.toLowerCase() === "instagram");
  const linkedin = links?.find(link => link.name.toLowerCase() === "linkedin");

  return <section className="w-full bg-brand-night text-brand-warm section-spacing border-t border-brand-warm/10">
    <div className="container-wide">
      <div className="mb-10 lg:mb-16 reveal">
        <p className="eyebrow mb-6">Proof of Life</p>
        <h2 className="font-display text-brand-warm text-[clamp(2.6rem,6vw,5.5rem)]">{section?.title || "In the Wild"}.</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
        {visiblePosts.map(post => {
          const url = getInstagramPostUrl(post.instagram_url);
          const media = <TileMedia post={post} />;
          return url
            ? <a key={post.id} href={url} target="_blank" rel="noopener noreferrer" aria-label={`View on Instagram: ${post.alt_text}`} className="group relative aspect-[3/4] overflow-hidden bg-brand-warm/5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red">{media}<TileOverlay /></a>
            : <div key={post.id} className="group relative aspect-[3/4] overflow-hidden bg-brand-warm/5">{media}</div>;
        })}
      </div>
      {(instagram || linkedin) && <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-12 reveal">
        {instagram && <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="group/link inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-brand-warm transition-colors hover:text-brand-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red">
          <Instagram className="h-5 w-5" aria-hidden="true" />
          <span>Follow on Instagram</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" aria-hidden="true" />
        </a>}
        {linkedin && <a href={linkedin.url} target="_blank" rel="noopener noreferrer" className="group/link inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-brand-warm/60 transition-colors hover:text-brand-warm focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red">
          <Linkedin className="h-4 w-4" aria-hidden="true" />
          <span>Connect on LinkedIn</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" aria-hidden="true" />
        </a>}
      </div>}
    </div>
  </section>;
};
