import { Button } from "@/components/ui/button";
import { useContactContent } from "@/hooks/useContactContent";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const Contact = () => {
  const { data: content } = useContactContent();
  const sectionAnimation = useScrollAnimation({ threshold: 0.08, rootMargin: "0px 0px 80px 0px", triggerOnce: true, fallbackTimeout: 1500 });

  if (!content) return null;

  return (
    <section className="w-full bg-white section-spacing">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div ref={sectionAnimation.ref} className={`transition-all duration-700 ease-out ${sectionAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h1 className="hero-title text-brand-ink mb-8">{content.title}</h1>
          <p className="body-text text-brand-ink-sub mb-12 max-w-xl mx-auto">
            {content.description}
          </p>
          
          <Button 
            asChild
            size="lg"
            className="bg-brand-ink hover:bg-brand-red text-white px-8 py-4 text-lg font-semibold smooth-transition"
          >
            <a href={`mailto:${content.email}`}>
              {content.button_text}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};