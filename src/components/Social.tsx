import { useEffect } from "react";

export const Social = () => {
  useEffect(() => {
    // Defer Elfsight script loading for better performance
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.defer = true;
      script.onerror = () => console.error('Failed to load Elfsight script');
      document.body.appendChild(script);
      return script;
    };

    const script = loadScript();

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="w-full bg-white section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="animate-slide-up mb-16">
          <h1 className="display-title text-brand-ink mb-6">In the Wild</h1>
        </div>
        
        <div className="elfsight-app-7e1de5f0-11d6-4bf3-ae86-6bef6e382f63" data-elfsight-app-lazy></div>
      </div>
    </section>
  );
};