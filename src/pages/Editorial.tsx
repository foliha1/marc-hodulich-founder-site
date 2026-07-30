import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useGhostPosts } from "@/hooks/useGhostPosts";
import { formatPostDate } from "@/lib/ghost";

const Editorial = () => {
  const { data: posts, isLoading, isError } = useGhostPosts();

  return (
    <section className="w-full bg-brand-warm text-brand-ink min-h-screen flex flex-col">
      <Navigation variant="dark" />

      <div className="flex-1 flex flex-col items-center px-6 lg:px-8 pt-40 pb-24">
        <div className="max-w-2xl text-center animate-in">
          <h1 className="hero-title mb-6">EDITORIAL</h1>
        </div>

        <div className="w-full max-w-6xl mt-16">
          {isLoading && (
            <p className="caption-text text-center text-brand-muted uppercase tracking-widest">
              Loading posts…
            </p>
          )}

          {isError && (
            <p className="caption-text text-center text-brand-muted uppercase tracking-widest">
              Posts are unavailable right now.
            </p>
          )}

          {posts && posts.length === 0 && (
            <p className="caption-text text-center text-brand-muted uppercase tracking-widest">
              No posts yet.
            </p>
          )}

          {posts && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/editorial/${post.slug}`}
                  className="group flex flex-col animate-in"
                >
                  {post.feature_image && (
                    <div className="w-full aspect-[4/3] overflow-hidden mb-5 bg-brand-stone">
                      <img
                        src={post.feature_image}
                        alt={post.feature_image_alt || post.title}
                        loading="lazy"
                        className="w-full h-full object-cover smooth-transition group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <span className="caption-text uppercase tracking-widest text-brand-muted mb-2">
                    {formatPostDate(post.published_at)}
                  </span>
                  <h2 className="section-title group-hover:text-brand-red smooth-transition">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="body-text text-brand-ink-sub mt-3 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Editorial;
