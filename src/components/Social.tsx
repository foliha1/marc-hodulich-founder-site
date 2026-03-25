import { useEffect, useRef, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
export const Social = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lazy load Instagram widget using Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    if (document.querySelector('script[src*="elfsight"]')) return;

    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.defer = true;
    script.onerror = () => console.error('Failed to load Elfsight script');
    document.body.appendChild(script);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="w-full bg-white section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-in mb-16">
          <h1 className="display-title text-brand-ink mb-6">In the Wild</h1>
        </div>
        
        {isVisible && (
          <div className="elfsight-app-7e1de5f0-11d6-4bf3-ae86-6bef6e382f63" data-elfsight-app-lazy></div>
        )}
      </div>
    </section>
  );
};