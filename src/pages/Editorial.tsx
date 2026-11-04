import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { NewsletterBox, NewsletterMasthead } from "@/components/Newsletter";
import { fadeInProps, getOptimizedImageUrl, fallbackToOriginal } from "@/utils/imageOptimization";
import { usePressFeatures } from "@/hooks/usePressFeatures";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useGhostPostList, type GhostPostListItem } from "@/hooks/useGhostPosts";

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

const PostCard = ({ post, index }: { post: GhostPostListItem; index: number }) => (
  <Link
    to={`/editorial/${post.slug}`}
    className="group reveal rounded-[4px] overflow-hidden smooth-transition block"
    style={{ animationDelay: `${index * 0.08}s`, backgroundColor: "#f2f2f2" }}
  >
    {post.featured_image && (
      <div className="aspect-[4/3] overflow-hidden bg-brand-stone">
        <img
          src={post.featured_image}
          alt={post.title}
          className="img-fade w-full h-full object-cover group-hover:scale-105"
          {...fadeInProps}
          loading="lazy"
          decoding="async"
        />
      </div>
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

// Upcoming letters shown until they are published in Ghost.
interface UpcomingLetter {
  title: string;
  date: string;
}

const UPCOMING: UpcomingLetter[] = [
  { title: "What if fulfillment happens before the finish line?", date: "Nov. 10" },
];

const UpcomingCard = ({ item, index }: { item: UpcomingLetter; index: number }) => (
  <div
    className="group reveal rounded-[4px] overflow-hidden smooth-transition flex flex-col p-6"
    style={{ animationDelay: `${index * 0.08}s`, backgroundColor: "#f2f2f2" }}
  >
    <h3 className="body-text text-brand-ink group-hover:text-brand-red smooth-transition mb-3">{item.title}</h3>
    <div className="flex items-center justify-between text-brand-muted mt-auto pt-4">
      <span className="caption-text">Marc Hodulich</span>
      <span className="caption-text">{item.date}</span>
    </div>
  </div>
);

const LINKEDIN_URL = "https://www.linkedin.com/in/marchodulich/";

const PressSection = () => {
  const { data } = usePressFeatures();
  const press = (data ?? []).filter((f) => f.kind === "press");
  const linkedin = (data ?? []).filter((f) => f.kind === "linkedin" && f.excerpt);

  return (
    <>
      {press.length > 0 && (
        <section className="mt-20 lg:mt-24 pt-12 border-t border-brand-ink/10">
          <p className="caption-text uppercase tracking-[0.2em] text-brand-red mb-3 reveal">Features &amp; Press</p>
          <h2 className="body-text text-brand-ink mb-10 reveal">Marc in the press</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {press.map((f, index) => (
              <a
                key={f.id}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group reveal rounded-[4px] overflow-hidden smooth-transition block"
                style={{ animationDelay: `${index * 0.08}s`, backgroundColor: "#f2f2f2" }}
              >
                {f.image_url && (
                  <div className="aspect-[4/3] overflow-hidden bg-brand-stone">
                    <img
                      src={getOptimizedImageUrl(f.image_url, 640, 80)}
                      alt={f.title}
                      className="img-fade w-full h-full object-cover object-top group-hover:scale-105"
                      {...fadeInProps}
                      onError={fallbackToOriginal(f.image_url)}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
                <div className="p-6">
                  <span className="block caption-text uppercase tracking-wider text-brand-red mb-3">{f.outlet}</span>
                  <h3 className="body-text text-brand-ink group-hover:text-brand-red smooth-transition mb-3">{f.title}</h3>
                  {f.excerpt && <p className="caption-text text-brand-ink-sub line-clamp-3 mb-4">{f.excerpt}</p>}
                  <span className="caption-text text-brand-muted">Read the feature ↗</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="mt-20 lg:mt-24 pt-12 border-t border-brand-ink/10">
        <p className="caption-text uppercase tracking-[0.2em] text-brand-red mb-3 reveal">From LinkedIn</p>
        <h2 className="body-text text-brand-ink mb-8 reveal">Notes from Marc</h2>
        {linkedin.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {linkedin.map((p) => (
              <a
                key={p.id}
                href={p.url || LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group reveal block border-l-2 border-brand-red pl-5"
              >
                <p className="body-text italic text-brand-ink line-clamp-5 mb-3">“{p.excerpt}”</p>
                <span className="caption-text text-brand-muted group-hover:text-brand-red smooth-transition">
                  Read on LinkedIn ↗
                </span>
              </a>
            ))}
          </div>
        )}
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="reveal inline-block caption-text uppercase tracking-wider text-brand-ink hover:text-brand-red smooth-transition border-b border-current pb-0.5"
        >
          Follow Marc on LinkedIn ↗
        </a>
      </section>
    </>
  );
};

const Editorial = () => {
  const { data: posts, isLoading, error } = useGhostPostList();
  useDocumentTitle("Editorial");

  return (
    <section className="w-full bg-brand-warm text-brand-ink min-h-screen flex flex-col">
      <Navigation variant="dark" />

      <div className="flex-1 px-6 lg:px-8 pt-32 pb-24">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-16 reveal">
            <h1 className="display-title text-brand-ink mb-6">Editorial</h1>
            <p className="body-text text-brand-ink-sub max-w-3xl">
              Writing on leadership, endurance, and building a life with intention.
            </p>
          </div>

          <div className="mb-8 md:mb-10">
            <NewsletterMasthead />
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
              {UPCOMING.slice(0, Math.max(0, 3 - posts.length)).map((item, i) => (
                <UpcomingCard key={item.title} item={item} index={posts.length + i} />
              ))}
            </div>
          )}

          <PressSection />

          <section className="mt-20 lg:mt-24 pt-12 border-t border-brand-ink/10 reveal">
            <p className="caption-text uppercase tracking-[0.2em] text-brand-red mb-3">Listen</p>
            <h2 className="body-text text-brand-ink mb-2">Marc in Conversation</h2>
            <p className="caption-text text-brand-ink-sub mb-5 max-w-xl">
              Podcasts and talks on leadership, endurance, and designing a life with intention.
            </p>
            <a
              href="/#conversation"
              className="caption-text uppercase tracking-wider text-brand-ink hover:text-brand-red smooth-transition border-b border-current pb-0.5"
            >
              Watch the conversations →
            </a>
          </section>

          <NewsletterBox />
        </div>
      </div>
    </section>
  );
};

export default Editorial;
