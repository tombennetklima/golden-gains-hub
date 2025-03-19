
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { useEffect } from "react";

const Datenschutz = () => {
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
        title="Datenschutz & Rechtliche Grundlagen"
        subtitle="Ihre Daten in sicheren Händen"
        description="Der Schutz deiner persönlichen Daten hat für uns höchste Priorität. Wir halten uns strikt an die geltenden Datenschutzbestimmungen der Europäischen Union und Deutschlands."
      />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto container-padding">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 animate-on-scroll">
              <h2 className="text-2xl md:text-3xl font-bold text-betclever-darkblue mb-6">
                Gesetzliche Grundlagen
              </h2>
              <p className="text-betclever-darkblue/80 mb-6">
                BETCLEVER betreibt Matched Betting unter Einhaltung folgender Datenschutzvorschriften:
              </p>
              <ul className="space-y-3 text-betclever-darkblue/80 list-disc pl-6">
                <li>DSGVO (EU-Verordnung 2016/679) – Regelt den Schutz personenbezogener Daten innerhalb der EU</li>
                <li>BDSG (Bundesdatenschutzgesetz) – Nationale Datenschutzrichtlinien für Deutschland</li>
                <li>TTDSG (Telekommunikation-Telemedien-Datenschutz-Gesetz) – Vorschriften für Online-Dienste und digitale Plattformen</li>
              </ul>
            </div>
            
            <div className="subtle-line"></div>
            
            <div className="mb-16 animate-on-scroll">
              <h2 className="text-2xl md:text-3xl font-bold text-betclever-darkblue mb-6">
                Welche Daten erfassen wir?
              </h2>
              <p className="text-betclever-darkblue/80 mb-6">
                Um eine sichere und effiziente Teilnahme an unserem Programm zu ermöglichen, erfassen wir folgende personenbezogene Daten:
              </p>
              <ul className="space-y-3 text-betclever-darkblue/80 list-disc pl-6">
                <li><span className="font-medium">Persönliche Angaben:</span> Name, Geburtsdatum, Adresse, Staatsangehörigkeit</li>
                <li><span className="font-medium">Kontaktinformationen:</span> E-Mail-Adresse, Telefonnummer</li>
                <li><span className="font-medium">Zahlungsdetails:</span> Bankverbindung zur Auszahlung deiner Gewinne</li>
                <li><span className="font-medium">Technische Daten:</span> IP-Adresse, verwendeter Browser, besuchte Seiten auf unserer Plattform</li>
              </ul>
            </div>
            
            <div className="subtle-line"></div>
            
            <div className="mb-16 animate-on-scroll">
              <h2 className="text-2xl md:text-3xl font-bold text-betclever-darkblue mb-6">
                Warum erfassen wir diese Daten?
              </h2>
              <p className="text-betclever-darkblue/80 mb-6">
                Die Verarbeitung deiner Daten erfolgt ausschließlich zu folgenden Zwecken:
              </p>
              <ul className="space-y-3 text-betclever-darkblue/80 list-disc pl-6">
                <li>Sicherstellung eines reibungslosen Ablaufs beim Matched Betting</li>
                <li>Verwaltung und Auszahlung von Gewinnen sowie Affiliate-Provisionen</li>
                <li>Einhaltung gesetzlicher Vorschriften und steuerrechtlicher Verpflichtungen</li>
                <li>Verbesserung unserer Plattform für eine optimale Nutzererfahrung</li>
              </ul>
            </div>
            
            <div className="subtle-line"></div>
            
            <div className="mb-16 animate-on-scroll">
              <h2 className="text-2xl md:text-3xl font-bold text-betclever-darkblue mb-6">
                Sicherheit & Speicherung deiner Daten
              </h2>
              <p className="text-betclever-darkblue/80 mb-6">
                Wir setzen auf modernste Sicherheitsstandards, um deine Daten bestmöglich zu schützen:
              </p>
              <ul className="space-y-3 text-betclever-darkblue/80 list-disc pl-6">
                <li><span className="font-medium">Ende-zu-Ende-Verschlüsselung</span> – Höchster Schutz bei der Datenübertragung</li>
                <li><span className="font-medium">Server in Deutschland</span> – Strenge Datenschutzvorgaben garantiert</li>
                <li><span className="font-medium">Strenge Zugriffsbeschränkungen</span> – Nur autorisierte Mitarbeiter haben Zugang zu sensiblen Daten</li>
              </ul>
            </div>
            
            <div className="subtle-line"></div>
            
            <div className="animate-on-scroll">
              <h2 className="text-2xl md:text-3xl font-bold text-betclever-darkblue mb-6">
                Deine Rechte
              </h2>
              <p className="text-betclever-darkblue/80 mb-6">
                Gemäß den Datenschutzgesetzen hast du das Recht auf:
              </p>
              <ul className="space-y-3 text-betclever-darkblue/80 list-disc pl-6">
                <li><span className="font-medium">Auskunft:</span> Du kannst eine Kopie deiner gespeicherten Daten anfordern.</li>
                <li><span className="font-medium">Berichtigung:</span> Falls Daten fehlerhaft sind, kannst du deren Korrektur verlangen.</li>
                <li><span className="font-medium">Löschung:</span> In bestimmten Fällen kannst du die Löschung deiner Daten beantragen.</li>
                <li><span className="font-medium">Einschränkung der Verarbeitung:</span> Falls eine Löschung nicht möglich ist, kannst du die Verarbeitung einschränken.</li>
                <li><span className="font-medium">Widerspruch:</span> Du kannst der Verarbeitung deiner Daten jederzeit widersprechen.</li>
              </ul>
              <p className="text-betclever-darkblue/80 mt-6">
                Falls du Fragen hast oder deine Rechte geltend machen möchtest, kontaktiere uns jederzeit.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Datenschutz;
