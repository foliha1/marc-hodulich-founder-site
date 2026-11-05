import { CSSProperties, useEffect, useRef } from "react";

// Masthead for the UNSETTLED newsletter: real text, not an image, so the
// title always renders. Mirrors the artwork's lockup — bold tracked caps for
// the wordmark, italic serif for the byline.
export const NewsletterMasthead = ({ subtitle }: { subtitle?: string }) => (
  <div className="reveal">
    <p className="caption-text uppercase tracking-[0.2em] text-brand-red mb-3">
      The Newsletter
    </p>
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-1 md:py-2">
      <span className="font-bold uppercase tracking-[0.1em] text-brand-ink leading-none text-[clamp(1.6rem,3.4vw,2.4rem)]">
        Unsettled
      </span>
      <span
        className="italic text-brand-ink-sub text-[clamp(1.05rem,2.1vw,1.5rem)]"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        with Marc Hodulich
      </span>
    </div>
    {subtitle && (
      <p
        className="text-brand-ink-sub max-w-2xl mt-2 md:mt-3 leading-relaxed text-[clamp(0.9rem,1.5vw,1.02rem)]"
      >
        {subtitle}
      </p>
    )}
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

// Night, form-only variant for dark-themed pages (Editorial).
const GHOST_MINIMAL_NIGHT_ATTRS: Record<string, string> = {
  ...GHOST_MINIMAL_ATTRS,
  "data-background-color": "#08090c",
  "data-text-color": "#FFFFFF",
};

export const GhostSignupForm = ({
  style,
  className,
  minimal = false,
  night = false,
}: {
  style?: CSSProperties;
  className?: string;
  minimal?: boolean;
  night?: boolean;
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
      Object.entries(minimal ? (night ? GHOST_MINIMAL_NIGHT_ATTRS : GHOST_MINIMAL_ATTRS) : GHOST_SIGNUP_ATTRS).forEach(([k, v]) => s.setAttribute(k, v));
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
  }, [minimal, night]);

  return <div ref={ref} className={className} style={style} />;
};

// Full-width dark band used on the homepage.
export const Newsletter = () => (
  <section
    className="w-full bg-brand-night border-t border-brand-warm/10 pt-[clamp(100px,12vw,160px)] pb-[clamp(40px,5vw,72px)]"
    aria-label="Newsletter signup"
  >
    <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
      <div className="reveal mb-1">
        <p className="eyebrow">The Newsletter</p>
      </div>
      <GhostSignupForm style={{ height: "40vmin", minHeight: 360, maxHeight: 520 }} />
    </div>
  </section>
);

// Quiet, minimal signup row at the bottom of the Editorial page.
export const NewsletterBox = ({ night = false }: { night?: boolean }) => (
  <section className="mt-8 md:mt-12 pt-8 md:pt-10 border-t border-brand-ink/10 reveal" aria-label="Newsletter signup">
    <div className="max-w-xl text-left">
      <p className="text-xs font-medium text-brand-red tracking-[0.2em] uppercase mb-3">The Newsletter</p>
      <p className="body-text text-brand-ink-sub mb-6">Get new letters in your inbox.</p>
      <GhostSignupForm minimal night={night} style={{ height: 64 }} />
    </div>
  </section>
);
