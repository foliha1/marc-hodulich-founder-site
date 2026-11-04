import { useCallback, useEffect, useRef, useState } from "react";

const GhostSignupForm = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  // Ghost's embed vertically centers its content, so a band taller than the
  // form itself shows up as a strip of empty background above its title.
  // Start safe, then fit the band to what the embed actually renders.
  const [formHeight, setFormHeight] = useState(360);

  // Same-origin (srcdoc) frame: read its layout to size the band, and italicize
  // the "with Marc Hodulich" half of the title. Nothing is injected into it.
  const tune = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc || !doc.body) return;

    const h1 = doc.querySelector("h1");
    const form = doc.querySelector("form");
    if (!h1 || !form) return;

    if (!h1.querySelector("em")) {
      const text = h1.textContent || "";
      const at = text.toLowerCase().indexOf("with marc hodulich");
      if (at > -1) {
        h1.textContent = "";
        h1.append(doc.createTextNode(text.slice(0, at)));
        const em = doc.createElement("em");
        em.textContent = text.slice(at);
        h1.append(em);
      }
    }

    // Sum the embed's own blocks. Their intrinsic heights don't depend on how
    // tall the band currently is, so this measurement can't feed back on itself.
    const wrap = doc.querySelector('[data-testid="wrapper"]') || doc.body;
    const win = doc.defaultView;
    let natural = 0;
    Array.from(wrap.children).forEach((node) => {
      const el = node as HTMLElement;
      const cs = win ? win.getComputedStyle(el) : null;
      natural +=
        el.offsetHeight +
        (parseFloat(cs?.marginTop || "0") || 0) +
        (parseFloat(cs?.marginBottom || "0") || 0);
    });
    natural += 8;
    if (natural > 120) setFormHeight(natural);
  }, []);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadedRef.current) {
          loadedRef.current = true;
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/ghost/signup-form@~0.4/umd/signup-form.min.js";
          script.async = true;
          script.setAttribute("data-background-color", "#08090c");
          script.setAttribute("data-text-color", "#FFFFFF");
          script.setAttribute("data-button-color", "#e1251b");
          script.setAttribute("data-button-text-color", "#FFFFFF");
          script.setAttribute("data-title", "UNSETTLED with Marc Hodulich");
          script.setAttribute(
            "data-description",
            "My observations, learnings, and challenges, meant to bring a little authenticity, levity, and direction to a world full of noise."
          );
          script.setAttribute("data-site", "https://marc-hodulich-1.ghost.io/");
          script.setAttribute("data-locale", "en");
          el.appendChild(script);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);

    // The embed creates its own iframe; fit the band once it has rendered, and
    // re-fit on resize because the title wraps differently at other widths.
    const watcher = new MutationObserver(() => {
      const iframe = el.querySelector("iframe");
      if (iframe && iframeRef.current !== iframe) {
        iframeRef.current = iframe;
        iframe.addEventListener("load", () => window.setTimeout(tune, 300));
        if (iframe.contentDocument?.readyState === "complete") window.setTimeout(tune, 300);
      }
    });
    watcher.observe(el, { childList: true, subtree: true });

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(tune, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      watcher.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, [tune]);

  return (
    <section
      aria-label="Newsletter signup"
      className="bg-brand-night pt-[clamp(120px,15vw,200px)] pb-[clamp(40px,5vw,72px)]"
    >
      <div className="container-app">
        <div className="reveal mb-1">
          <p className="text-2xl md:text-3xl font-medium text-brand-red tracking-[0.2em] uppercase">
            The Newsletter
          </p>
        </div>
        <div
          ref={containerRef}
          style={{ height: formHeight }}
          aria-label="Newsletter signup form"
        />
      </div>
    </section>
  );
};

export default GhostSignupForm;
export { GhostSignupForm as Newsletter };
