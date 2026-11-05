import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useContactContent } from "@/hooks/useContactContent";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Unsettled = () => {
  useDocumentTitle("Unsettled Coaching");
  const { data: contact } = useContactContent();

  return (
    <>
      <section className="w-full bg-brand-red text-white min-h-screen flex flex-col">
        <Navigation variant="light" />

        {/* Centered Content */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-8">
          <div className="max-w-2xl text-center reveal">
            <h1 className="hero-title text-white mb-6">UNSETTLED</h1>
            <p className="body-text text-white/80 mb-10">
              Unsettled is Marc Hodulich's executive coaching business and provides executive coaching services.
            </p>
            {contact?.email && (
              <p className="text-center text-xs uppercase tracking-[0.25em] text-white/70">
                <a
                  href={`mailto:${contact.email}`}
                  className="underline underline-offset-4 decoration-white/40 hover:text-white hover:decoration-white smooth-transition"
                >
                  {contact.email}
                </a>
              </p>
            )}
            {/* Payment button hidden for now
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-brand-ink text-brand-red hover:text-white px-8 py-4 text-lg font-semibold uppercase tracking-wider smooth-transition"
            >
              <a href="https://buy.stripe.com/PLACEHOLDER" target="_blank" rel="noopener noreferrer">
                MAKE A PAYMENT
              </a>
            </Button>
            */}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Unsettled;
