import { CSSProperties, useEffect, useRef } from "react";

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

export const GhostSignupForm = ({
  style,
  className,
}: {
  style?: CSSProperties;
  className?: string;
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
      Object.entries(GHOST_SIGNUP_ATTRS).forEach(([k, v]) => s.setAttribute(k, v));
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
  }, []);

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

// Contained signup panel used at the bottom of the Editorial page.
// Full-bleed on phones so the form keeps its full width; a centered card above.
export const NewsletterBox = () => (
  <div className="mt-24 md:mt-32 reveal" aria-label="Newsletter signup">
    <div className="max-md:-mx-6 md:mx-auto md:max-w-3xl bg-brand-night max-md:rounded-none md:rounded-[4px] elegant-shadow px-6 py-10 md:px-12 md:py-12 text-center">
      <p className="text-2xl md:text-3xl font-medium text-brand-red tracking-[0.2em] uppercase mb-6">
        The Newsletter
      </p>
      <GhostSignupForm style={{ height: "40vmin", minHeight: 360, maxHeight: 460 }} />
    </div>
  </div>
);
