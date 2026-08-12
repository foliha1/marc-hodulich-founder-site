import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useStoryChiefPost } from "@/hooks/useStoryChiefPosts";

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

const EditorialPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useStoryChiefPost(slug);

  return (
    <section className="w-full bg-brand-warm text-brand-ink min-h-screen flex flex-col">
      <Navigation variant="dark" />

      <div className="flex-1 px-6 lg:px-8 pt-32 pb-24">
        <div className="max-w-3xl mx-auto w-full">
          <Link
            to="/editorial-preview"
            className="caption-text uppercase tracking-wider text-brand-muted hover:text-brand-red smooth-transition inline-block mb-8"
          >
            ← Back to Editorial
          </Link>

          {isLoading && (
            <div className="animate-in">
              <div className="h-8 w-2/3 bg-brand-stone animate-pulse mb-6" />
              <div className="h-5 w-1/2 bg-brand-stone animate-pulse mb-10" />
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-4 w-full bg-brand-stone animate-pulse" />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-20 animate-in">
              <h1 className="section-title text-brand-ink mb-4">Article not found</h1>
              <p className="body-text text-brand-ink-sub mb-8">
                The article you're looking for doesn't exist or has been moved.
              </p>
              <Link
                to="/editorial-preview"
                className="caption-text uppercase tracking-wider text-brand-red hover:text-brand-red-dark smooth-transition"
              >
                Return to Editorial
              </Link>
            </div>
          )}

          {!isLoading && !error && post && (
            <article className="animate-in">
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="caption-text uppercase tracking-wider text-brand-red">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="display-title text-brand-ink mb-6">{post.title}</h1>

              <div className="flex items-center gap-4 mb-10 text-brand-muted">
                {post.author?.name && <span className="caption-text">{post.author.name}</span>}
                {post.published_at && (
                  <>
                    <span className="text-brand-stone">•</span>
                    <span className="caption-text">{formatDate(post.published_at)}</span>
                  </>
                )}
                {post.reading_time ? (
                  <>
                    <span className="text-brand-stone">•</span>
                    <span className="caption-text">{post.reading_time} min read</span>
                  </>
                ) : null}
              </div>

              {post.featured_image && (
                <div className="aspect-[16/9] overflow-hidden rounded-[4px] mb-10 elegant-shadow">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}

              {post.excerpt && (
                <p className="body-text text-brand-ink-sub font-medium mb-10 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div
                className="prose-editorial body-text text-brand-ink"
                dangerouslySetInnerHTML={{ __html: post.content_html }}
              />
            </article>
          )}
        </div>
      </div>
    </section>
  );
};

export default EditorialPost;
