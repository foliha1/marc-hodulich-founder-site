import { useEffect, useRef, useState } from "react";
import { useSectionContent } from "@/hooks/useSectionContent";
export const Social = () => {
  const { data: section } = useSectionContent("social");
  const [isVisible, setIsVisible] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [placeholderGone, setPlaceholderGone] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lazy load Instagram widget using Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '300px', // Start loading shortly before section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    if (document.querySelector('script[src*="elfsight"]')) return;

    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.defer = true;
    script.onerror = () => console.error('Failed to load Elfsight script');
    document.body.appendChild(script);
  }, [isVisible]);

  // Hold the placeholder until the widget has actually rendered something
  useEffect(() => {
    if (!isVisible) return;

    const el = widgetRef.current;
    const hasContent = () => !!el && el.childElementCount > 0;

    if (hasContent()) {
      setWidgetReady(true);
      return;
    }

    let observer: MutationObserver | undefined;
    if (el) {
      observer = new MutationObserver(() => {
        if (hasContent()) {
          setWidgetReady(true);
          observer?.disconnect();
        }
      });
      observer.observe(el, { childList: true, subtree: true });
    }

    // Don't leave a shimmering box on screen if the widget never arrives
    const safety = window.setTimeout(() => setWidgetReady(true), 12000);

    return () => {
      observer?.disconnect();
      window.clearTimeout(safety);
    };
  }, [isVisible]);

  // Unmount the placeholder once its fade-out has finished
  useEffect(() => {
    if (!widgetReady) return;
    const t = window.setTimeout(() => setPlaceholderGone(true), 500);
    return () => window.clearTimeout(t);
  }, [widgetReady]);

  return (
    <section ref={sectionRef} className="w-full bg-brand-night text-brand-warm section-spacing border-t border-brand-warm/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10 lg:mb-16 reveal">
          <p className="eyebrow mb-6">Proof of Life</p>
          <h2 className="font-display text-brand-warm text-[clamp(2.6rem,6vw,5.5rem)]">{section?.title || "In the Wild"}.</h2>
        </div>
        
        <div className="grid">
          {isVisible && (
            <div
              ref={widgetRef}
              className="col-start-1 row-start-1 elfsight-app-7e1de5f0-11d6-4bf3-ae86-6bef6e382f63"
              data-elfsight-app-lazy
            ></div>
          )}

          {!placeholderGone && (
            <div
              aria-hidden="true"
              className={`col-start-1 row-start-1 pointer-events-none grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 transition-opacity duration-500 ${
                widgetReady ? "opacity-0" : "opacity-100"
              }`}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`skeleton aspect-square rounded-[4px] ${i > 3 ? "hidden sm:block" : ""}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};