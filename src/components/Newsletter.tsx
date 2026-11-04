import { useEffect, useRef } from "react";

// Ghost signup form embed. The script injects its form next to itself,
// so we append it into our container once the section nears the viewport.
export const Newsletter = () => {
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
      const attrs: Record<string, string> = {
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
      Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
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

  return (
    <section
      className="w-full bg-brand-night pt-[clamp(120px,15vw,200px)] pb-[clamp(40px,5vw,72px)]"
      aria-label="Newsletter signup"
    >
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <div className="reveal mb-1">
          <p className="caption-text text-brand-red tracking-[0.2em] uppercase mb-3">
            The Newsletter
          </p>
          <p className="body-text text-white/80">
            Sign up to get new issues in your inbox.
          </p>
        </div>
        <div ref={ref} style={{ height: "40vmin", minHeight: 360, maxHeight: 520 }} />
      </div>
    </section>
  );
};
