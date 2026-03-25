import { Hero } from "@/components/Hero";
import { MeetMarc } from "@/components/MeetMarc";

import { FailuresFirsts } from "@/components/FailuresFirsts";
import { Movement } from "@/components/Movement";
import { Speaking } from "@/components/Speaking";
import { Social } from "@/components/Social";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="w-full">
      <Hero />
      <MeetMarc />
      {/* <PeaksValleys /> */}
      <FailuresFirsts />
      <Movement />
      <Speaking />
      <Social />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;