import { Hero } from "@/components/Hero";
import { MeetMarc } from "@/components/MeetMarc";

import { FailuresFirsts } from "@/components/FailuresFirsts";
import { Movement } from "@/components/Movement";
import { Speaking } from "@/components/Speaking";
import { Social } from "@/components/Social";
import { Newsletter } from "@/components/Newsletter";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="w-full bg-brand-night">
      <Hero />
      <MeetMarc />
      
      <FailuresFirsts />
      <Movement />
      <Speaking />
      <Social />
      <Newsletter />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;