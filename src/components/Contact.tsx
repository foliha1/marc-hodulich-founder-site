import { Button } from "@/components/ui/button";

export const Contact = () => {
  return (
    <section className="w-full bg-white py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          <h2 className="hero-title text-brand-ink mb-8">Say Hello</h2>
          <p className="body-text text-brand-ink-sub mb-12 max-w-xl mx-auto">
            Reach out about speaking, collaborating, or to share your peak & valley story.
          </p>
          
          <Button 
            asChild
            size="lg"
            className="bg-brand-ink hover:bg-brand-ink/90 text-white px-8 py-4 text-lg font-semibold smooth-transition hero-shadow hover:elegant-shadow"
          >
            <a href="mailto:hello@marchodulich.com">
              Contact Marc
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};