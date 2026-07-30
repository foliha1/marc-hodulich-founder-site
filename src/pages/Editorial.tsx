import { Navigation } from "@/components/Navigation";

const Editorial = () => {
  return (
    <section className="w-full bg-brand-warm text-brand-ink min-h-screen flex flex-col">
      <Navigation variant="dark" />

      <div className="flex-1 flex items-center justify-center px-6 lg:px-8">
        <div className="max-w-2xl text-center animate-in">
          <h1 className="hero-title mb-6">EDITORIAL</h1>
        </div>
      </div>
    </section>
  );
};

export default Editorial;
