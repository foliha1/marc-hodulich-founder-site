import { CSSProperties, useEffect, useRef } from "react";
import { fadeInProps } from "@/utils/imageOptimization";

const NEWSLETTER_MASTHEAD_URL =
  "https://ontkueksqeqypaxvysvu.supabase.co/storage/v1/object/public/cms-images/newsletter-header-warm.png";

// Masthead banner for the UNSETTLED newsletter (portrait + wordmark lockup).
// The artwork's background was recolored to the page's exact background
// (#F2F2F2) and is served untransformed, so it sits on the page with no box,
// band, or seam. On phones it is scaled up past the content column for
// legibility; only its outer padding is clipped, never the artwork.
export const NewsletterMasthead = () => (
  <div className="reveal">
    <p className="caption-text uppercase tracking-[0.2em] text-brand-red mb-3 text-center">
      The Newsletter
    </p>
    <div className="flex justify-center overflow-hidden py-1 md:py-2">
      <img
        src={NEWSLETTER_MASTHEAD_URL}
        alt="UNSETTLED with Marc Hodulich"
        width={1200}
        height={240}
        className="img-fade block h-auto w-[160%] max-w-[880px] shrink-0"
        {...fadeInProps}
        loading="lazy"
        decoding="async"
      />
    </div>
  </div>
);

// Ghost signup form embed. The script injects its form next to itself,
// so we append it into our container once the section nears the viewport.
const GHOST_SIGNUP_ATTRS: Record<string, string> = {
  "data-background-color": "#08090c",
  "data-text-color": "#FFFFFF",
  "data-button-color": "#e1251b",
  "data-button-text-color": "#FFFFFF",
  "data-title": "UNSETTLED with Marc Hodulich",
  "data-description":
    "My observations, learnings, and challenges, meant to bring a little authenticity, levity, and direction to a world full of noise.",
  "data-site": "https://marc-hodulich-1.ghost.io/",
  "data-locale": "en",
};

// Light, form-only variant (no title/description) for light pages.
const GHOST_MINIMAL_ATTRS: Record<string, string> = {
  "data-background-color": "#f2f2f2",
  "data-text-color": "#1c1c1c",
  "data-button-color": "#e1251b",
  "data-button-text-color": "#FFFFFF",
  "data-site": "https://marc-hodulich-1.ghost.io/",
  "data-locale": "en",
};

export const GhostSignupForm = ({
  style,
  className,
  minimal = false,
}: {
  style?: CSSProperties;
  className?: string;
  minimal?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let loaded = false;
    const load = () => {
      if (loaded || el.querySelector("script")) return;
      loaded = true;
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/ghost/signup-form@~0.4/umd/signup-form.min.js";
      s.async = true;
      Object.entries(minimal ? GHOST_MINIMAL_ATTRS : GHOST_SIGNUP_ATTRS).forEach(([k, v]) => s.setAttribute(k, v));
      el.appendChild(s);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          load();
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [minimal]);

  return <div ref={ref} className={className} style={style} />;
};

// Full-width dark band used on the homepage.
export const Newsletter = () => (
  <section
    className="w-full bg-brand-night pt-[clamp(120px,15vw,200px)] pb-[clamp(40px,5vw,72px)]"
    aria-label="Newsletter signup"
  >
    <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
      <div className="reveal mb-1">
        <p className="text-2xl md:text-3xl font-medium text-brand-red tracking-[0.2em] uppercase">
          The Newsletter
        </p>
      </div>
      <GhostSignupForm style={{ height: "40vmin", minHeight: 360, maxHeight: 520 }} />
    </div>
  </section>
);

// Quiet, minimal signup row at the bottom of the Editorial page.
export const NewsletterBox = () => (
  <section className="mt-24 md:mt-32 pt-12 md:pt-16 border-t border-brand-ink/10 reveal" aria-label="Newsletter signup">
    <div className="max-w-xl mx-auto text-center">
      <p className="text-xs font-medium text-brand-red tracking-[0.2em] uppercase mb-3">The Newsletter</p>
      <p className="body-text text-brand-ink-sub mb-6">
        Get new letters from <em>UNSETTLED with Marc Hodulich</em> in your inbox.
      </p>
      <GhostSignupForm minimal style={{ height: 64 }} />
    </div>
  </section>
);
