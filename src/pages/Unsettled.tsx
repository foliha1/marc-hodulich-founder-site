import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

const Unsettled = () => {
  return (
    <>
      <section className="w-full bg-brand-red text-white min-h-screen flex flex-col">
        <Navigation variant="light" />

        {/* Centered Content */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-8">
          <div className="max-w-2xl text-center animate-in">
            <h1 className="hero-title text-white mb-6">UNSETTLED</h1>
            <p className="body-text text-white/80 mb-12">
              Unsettled is Marc Hodulich's executive coaching business and provides executive coaching services. Please follow the prompts below to make a payment.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-white/90 text-brand-red px-8 py-4 text-lg font-semibold smooth-transition"
            >
              <a href="https://buy.stripe.com/PLACEHOLDER" target="_blank" rel="noopener noreferrer">
                Make a Payment
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Unsettled;
