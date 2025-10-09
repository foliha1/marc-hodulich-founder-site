import { useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const Social = () => {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { elementRef: feedRef, isVisible: feedVisible } = useScrollAnimation();
  
  useEffect(() => {
    // Load Elfsight script
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="w-full bg-white section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={headerRef} className={`scroll-fade-in ${headerVisible ? 'visible' : ''} mb-16`}>
          <h1 className="display-title text-brand-ink mb-6">In the Wild</h1>
        </div>
        
        <div ref={feedRef} className={`scroll-fade-in ${feedVisible ? 'visible' : ''}`}>
          <div className="elfsight-app-7e1de5f0-11d6-4bf3-ae86-6bef6e382f63" data-elfsight-app-lazy></div>
        </div>
      </div>
    </section>
  );
};