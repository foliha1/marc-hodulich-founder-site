import { useEffect, useRef, useState } from "react";
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

// `active` is driven by pointer/focus events in JS (not CSS :hover), so the
// color reveal and video teaser work on every device, including touch laptops
// where the hover media query reports no hover support.
const TileMedia = ({ post, active }: { post: SocialPost; active: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const poster = getOptimizedImageUrl(post.image_url, 640);
  // The filter lives on a wrapper so re-renders never reset the img's load-fade class.
  const wrapper = `w-full h-full transition-[transform,filter] duration-500 ${active ? "motion-safe:scale-[1.03]" : ""} ${post.is_grayscale && !active ? "grayscale" : "grayscale-0"}`;
  const treatment = "w-full h-full object-cover";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) void video.play().catch(() => undefined);
    else { video.pause(); video.currentTime = 0; }
  }, [active]);

  if (!post.video_url) {
    return <div className={wrapper}><img src={poster} alt={post.alt_text} loading="lazy" decoding="async" className={`img-fade ${treatment}`} {...fadeInProps} onError={fallbackToOriginal(post.image_url)} /></div>;
  }

  return <div className={wrapper}><video
    ref={videoRef}
    src={post.video_url}
    poster={poster}
    muted
    loop
    playsInline
    preload="none"
    aria-label={post.alt_text}
    className={treatment}
  /></div>;
};

const Tile = ({ post }: { post: SocialPost }) => {
  const [active, setActive] = useState(false);
  const url = getInstagramPostUrl(post.instagram_url);
  const on = () => setActive(true);
  const off = () => setActive(false);
  const base = "relative aspect-[3/4] overflow-hidden bg-brand-warm/5";

  if (!url) return <div className={base} onPointerEnter={on} onPointerLeave={off}><TileMedia post={post} active={active} /></div>;

  return <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`View on Instagram: ${post.alt_text}`}
    className={`${base} cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red`}
    onPointerEnter={on}
    onPointerLeave={off}
    onFocus={on}
    onBlur={off}
  >
    <TileMedia post={post} active={active} />
    <Instagram aria-hidden="true" className={`pointer-events-none absolute bottom-3 right-3 h-6 w-6 text-brand-warm drop-shadow-md transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`} />
  </a>;
};

export const Social = () => {
  const { data: section } = useSectionContent("social");
  const { data: posts } = useSocialPosts();
  const { data: links } = useSocialLinks();
  const visiblePosts = (posts ?? []).filter(post => hasSocialThumbnail(post.image_url));
  // Never present the old stock images as Marc's Instagram posts.
  if (!visiblePosts.length) return null;

  const instagram = links?.find(link => link.name.toLowerCase() === "instagram");
  const linkedin = links?.find(link => link.name.toLowerCase() === "linkedin");

  // Tighter top padding: the gallery sits closer under Features & Press.
  return <section className="w-full bg-brand-night text-brand-warm border-t border-brand-warm/10 pt-[clamp(40px,4.5vw,72px)] pb-[clamp(120px,15vw,200px)]">
    <div className="mx-auto w-full max-w-[760px] px-6 md:w-[72%] md:max-w-[980px] md:px-0">
      <div className="mb-10 lg:mb-16 reveal">
        <h2 className="font-display text-brand-warm text-[clamp(1.85rem,4.6vw,4.25rem)]">{section?.title || "In the Wild"}.</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
        {visiblePosts.map(post => <Tile key={post.id} post={post} />)}
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
