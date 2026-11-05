import { useSectionContent } from "@/hooks/useSectionContent";
import { useSocialPosts } from "@/hooks/useSocialPosts";
import { getInstagramPostUrl, hasSocialThumbnail } from "@/lib/socialMedia";
import { getOptimizedImageUrl, fallbackToOriginal, fadeInProps } from "@/utils/imageOptimization";

export const Social = () => {
  const { data: section } = useSectionContent("social");
  const { data: posts } = useSocialPosts();
  const visiblePosts = (posts ?? []).filter(post => hasSocialThumbnail(post.image_url));
  // Never present the old stock images as Marc's Instagram posts.
  if (!visiblePosts.length) return null;

  return <section className="w-full bg-brand-night text-brand-warm section-spacing border-t border-brand-warm/10">
    <div className="container-wide">
      <div className="mb-10 lg:mb-16 reveal">
        <p className="eyebrow mb-6">Proof of Life</p>
        <h2 className="font-display text-brand-warm text-[clamp(2.6rem,6vw,5.5rem)]">{section?.title || "In the Wild"}.</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
        {visiblePosts.map(post => {
          const url = getInstagramPostUrl(post.instagram_url);
          const thumbnail = <>
            <img src={getOptimizedImageUrl(post.image_url, 640)} alt={post.alt_text} loading="lazy" decoding="async" className="img-fade w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]" {...fadeInProps} onError={fallbackToOriginal(post.image_url)} />
          </>;
          return url
            ? <a key={post.id} href={url} target="_blank" rel="noopener noreferrer" aria-label={`View on Instagram: ${post.alt_text}`} className="group relative aspect-[3/4] overflow-hidden bg-brand-warm/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red">{thumbnail}</a>
            : <div key={post.id} className="relative aspect-[3/4] overflow-hidden bg-brand-warm/5">{thumbnail}</div>;
        })}
      </div>
    </div>
  </section>;
};
