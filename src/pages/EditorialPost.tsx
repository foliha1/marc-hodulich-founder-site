import { Link, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useGhostPost } from "@/hooks/useGhostPosts";
import { formatPostDate } from "@/lib/ghost";

const EditorialPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useGhostPost(slug);

  return (
    <section className="w-full bg-brand-warm text-brand-ink min-h-screen flex flex-col">
      <Navigation variant="dark" />

      <article className="flex-1 w-full max-w-3xl mx-auto px-6 lg:px-8 pt-40 pb-24">
        <Link
          to="/editorial"
          className="caption-text uppercase tracking-widest text-brand-muted hover:text-brand-red smooth-transition"
        >
          ← Editorial
        </Link>

        {isLoading && (
          <p className="caption-text uppercase tracking-widest text-brand-muted mt-16">
            Loading…
          </p>
        )}

        {(isError || (!isLoading && !post)) && (
          <p className="caption-text uppercase tracking-widest text-brand-muted mt-16">
            This article could not be found.
          </p>
        )}

        {post && (
          <div className="mt-10 animate-in">
            <span className="caption-text uppercase tracking-widest text-brand-muted">
              {formatPostDate(post.published_at)}
            </span>
            <h1 className="display-title mt-4 mb-8">{post.title}</h1>

            {post.feature_image && (
              <img
                src={post.feature_image}
                alt={post.feature_image_alt || post.title}
                className="w-full h-auto mb-12"
              />
            )}

            <div
              className="ghost-content body-text text-brand-ink-sub"
              dangerouslySetInnerHTML={{ __html: post.html || "" }}
            />
          </div>
        )}
      </article>
    </section>
  );
};

export default EditorialPost;
