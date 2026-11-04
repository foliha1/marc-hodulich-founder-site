import { Hero } from "@/components/Hero";
import { MeetMarc } from "@/components/MeetMarc";

import { FailuresFirsts } from "@/components/FailuresFirsts";
import { Movement } from "@/components/Movement";
import { Speaking } from "@/components/Speaking";
// import { Social } from "@/components/Social"; // hidden for now
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="w-full">
      <Hero />
      <MeetMarc />
      
      <FailuresFirsts />
      <Movement />
      <Speaking />
      {/* <Social /> — hidden for now */}
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;