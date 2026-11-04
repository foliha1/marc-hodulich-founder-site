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
        "data-title": "Marc Hodulich",
        "data-description": "Thoughts, stories and ideas.",
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
    <section className="w-full" aria-label="Newsletter signup">
      <div ref={ref} style={{ height: "40vmin", minHeight: 360 }} />
    </section>
  );
};
