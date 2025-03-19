
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import AffiliateInfo from "../components/AffiliateInfo";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = elementTop < window.innerHeight - 100 && elementBottom > 0;
        
        if (isVisible) {
          element.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <Hero
        title="BETCLEVER – Dein Weg zu garantierten Gewinnen"
        description="Wir haben uns auf Matched Betting spezialisiert und nutzen Willkommensboni von Sportwettenanbietern, um garantierte Gewinne zu erzielen. Seit über drei Jahren sind wir in diesem Bereich erfolgreich und bieten dir die Möglichkeit, von unserem bewährten System zu profitieren."
        showButton={true}
        buttonText="Jetzt anmelden"
      />
      
      <Stats />
      
      <AffiliateInfo />
      
      <section className="section-spacing">
        <div className="container mx-auto container-padding">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-10 md:p-16 shadow-xl border border-gray-100">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-betclever-darkblue mb-6">
                Bereit, mit BETCLEVER zu starten?
              </h2>
              <p className="text-betclever-darkblue/70 max-w-2xl mx-auto mb-8">
                Melde dich jetzt an und sichere dir 250€. Steige danach direkt als 
                Affiliate ein und verdiene für jeden geworbenen Teilnehmer weitere 250€.
              </p>
              <a
                href="https://form.jotform.com/250773154185055"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-betclever-gold hover:bg-betclever-gold/90 text-white px-8 py-4 rounded-md font-medium text-md button-hover-effect"
              >
                Jetzt anmelden & mitmachen
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
