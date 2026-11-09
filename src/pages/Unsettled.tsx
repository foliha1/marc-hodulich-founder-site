import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { Signature } from "@/components/Signature";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

// Coaching-page contact address (kept separate from the homepage contact settings).
const COACHING_EMAIL = "unsettled@marchodulich.com";

const Unsettled = () => {
  useDocumentTitle("Unsettled Coaching");

  return (
    <>
      <section className="theme-night w-full text-brand-ink min-h-screen flex flex-col">
        <Navigation variant="night" />

        {/* Centered Content */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-8">
          <div className="max-w-2xl text-center reveal">
            <h1 className="display-title text-brand-ink mb-6">UNSETTLED</h1>
            <p className="font-editorial text-lg md:text-xl text-brand-ink/80 leading-relaxed text-balance">
              Marc works with a select group of Founders and Executives looking for fulfillment and balance.
              This is not a program designed to help you grow your business or increase profits. It is about
              presence, intentionality and authenticity in all aspects of life.
            </p>
            <p className="font-editorial text-lg md:text-xl text-brand-ink/80 leading-relaxed mt-8 mb-10">
              Shoot Marc a note to learn more.
            </p>
            <p className="text-center text-xs uppercase tracking-[0.25em] text-brand-red">
              <a
                href={`mailto:${COACHING_EMAIL}`}
                className="underline underline-offset-4 decoration-brand-red/40 hover:text-brand-ink hover:decoration-brand-ink smooth-transition"
              >
                {COACHING_EMAIL}
              </a>
            </p>
            <Signature className="mx-auto mt-10 h-12 w-auto" />
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
