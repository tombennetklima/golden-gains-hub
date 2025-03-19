
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import AffiliateInfo from "../components/AffiliateInfo";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { Circle, CircleDashed, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="decorative-circle w-64 h-64 bg-betclever-gold/5 top-1/4 -left-20 animate-pulse-slow"></div>
      <div className="decorative-circle w-96 h-96 bg-betclever-darkblue/5 bottom-1/4 -right-32 animate-pulse-slow"></div>
      <div className="decorative-line w-1/3 top-1/3 left-0 animate-pulse-slow"></div>
      <div className="decorative-line w-1/4 bottom-1/4 right-0 animate-pulse-slow"></div>
      
      <Navbar />
      
      <Hero
        title="BETCLEVER – Dein Weg zu garantierten Gewinnen"
        description="Wir haben uns auf Matched Betting spezialisiert und nutzen Willkommensboni von Sportwettenanbietern, um garantierte Gewinne zu erzielen. Seit über drei Jahren sind wir in diesem Bereich erfolgreich und bieten dir die Möglichkeit, von unserem bewährten System zu profitieren."
        showButton={true}
        buttonText="Mehr erfahren"
        buttonLink="/teilnahme"
        useButtonAsLink={true}
      />
      
      <Stats />
      
      <AffiliateInfo />
      
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 opacity-10">
          <Sparkles size={40} className="text-betclever-gold animate-float" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 opacity-10">
          <Circle size={80} className="text-betclever-darkblue animate-pulse-slow" />
        </div>
        <div className="absolute top-1/2 left-1/5 w-40 h-40 border border-betclever-gold/10 rounded-full animate-spin-slow"></div>
        
        <div className="container mx-auto container-padding">
          <div className="max-w-4xl mx-auto elegant-card hover-lift animate-on-scroll">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-betclever-darkblue mb-6">
                Bereit, mit BETCLEVER zu starten?
              </h2>
              <p className="text-betclever-darkblue/70 max-w-2xl mx-auto mb-8">
                Melde dich jetzt an und sichere dir 250€. Steige danach direkt als 
                Affiliate ein und verdiene für jeden geworbenen Teilnehmer weitere 250€.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
