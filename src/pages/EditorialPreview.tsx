import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useStoryChiefPostList, type StoryChiefPostListItem } from "@/hooks/useStoryChiefPosts";

const formatDate = (iso: string | null): string => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const PostCard = ({ post, index }: { post: StoryChiefPostListItem; index: number }) => (
  <Link
    to={`/editorial-preview/${post.slug}`}
    className="group animate-in rounded-[4px] overflow-hidden smooth-transition block"
    style={{ animationDelay: `${index * 0.08}s`, backgroundColor: "#f2f2f2" }}
  >
    {post.featured_image ? (
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={post.featured_image}
          alt={post.title}
          className="w-full h-full object-cover smooth-transition group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>
    ) : (
      <div className="aspect-[4/3] bg-brand-stone" />
    )}
    <div className="p-6">
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="caption-text uppercase tracking-wider text-brand-red"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <h3 className="body-text text-brand-ink group-hover:text-brand-red smooth-transition mb-3">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="caption-text text-brand-ink-sub line-clamp-3 mb-4">{post.excerpt}</p>
      )}
      <div className="flex items-center justify-between text-brand-muted">
        <span className="caption-text">{post.author?.name ?? ""}</span>
        <span className="caption-text">{formatDate(post.published_at)}</span>
      </div>
    </div>
  </Link>
);

const EditorialPreview = () => {
  const { data: posts, isLoading, error } = useStoryChiefPostList();

  return (
    <section className="w-full bg-brand-warm text-brand-ink min-h-screen flex flex-col">
      <Navigation variant="dark" />

      <div className="flex-1 px-6 lg:px-8 pt-32 pb-24">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-16 animate-in">
            <h1 className="display-title text-brand-ink mb-6">Editorial</h1>
            <p className="body-text text-brand-ink-sub max-w-3xl">
              Writing on leadership, endurance, and building a life with intention.
            </p>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-[4px] overflow-hidden" style={{ backgroundColor: "#f2f2f2" }}>
                  <div className="aspect-[4/3] bg-brand-stone animate-pulse" />
                  <div className="p-6">
                    <div className="h-4 w-1/3 bg-brand-stone animate-pulse mb-3" />
                    <div className="h-5 w-3/4 bg-brand-stone animate-pulse mb-2" />
                    <div className="h-5 w-1/2 bg-brand-stone animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="max-w-2xl text-center py-20">
              <p className="body-text text-brand-ink-sub">
                There was a problem loading the editorial feed. Please check back shortly.
              </p>
            </div>
          )}

          {!isLoading && !error && posts && posts.length === 0 && (
            <div className="max-w-2xl text-center py-20">
              <p className="body-text text-brand-ink-sub">No articles published yet.</p>
            </div>
          )}

          {!isLoading && !error && posts && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EditorialPreview;
