import { useEffect, useRef, useState } from "react";
import { useSectionContent } from "@/hooks/useSectionContent";
export const Social = () => {
  const { data: section } = useSectionContent("social");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section ref={sectionRef} className="w-full bg-white section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10 lg:mb-16 reveal">
          <h2 className="display-title text-brand-ink mb-6">{section?.title || "In the Wild"}</h2>
        </div>
        
        {isVisible && (
          <div className="elfsight-app-7e1de5f0-11d6-4bf3-ae86-6bef6e382f63" data-elfsight-app-lazy></div>
        )}
      </div>
    </section>
  );
};