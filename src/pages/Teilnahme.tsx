
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const Teilnahme = () => {
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasBankAccount, setHasBankAccount] = useState(false);

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

  const handleSubmit = () => {
    if (!hasReadTerms || !hasBankAccount) {
      toast.error("Bitte bestätige, dass du die Teilnahmebedingungen gelesen hast und ein Bankkonto eröffnet hast");
      return;
    }
    
    window.open("https://form.jotform.com/250773154185055", "_blank");
  };

  const requirements = [
    "Du bist zwischen 18 und 55 Jahren alt.",
    "Du besitzt einen deutschen Ausweis oder Reisepass.",
    "Du hast eine deutsche Meldeadresse.",
    "Du hast zuvor noch nicht an einem ähnlichen Angebot teilgenommen.",
    "Du bist bereit, für etwa einen Monat ein Bankkonto bei der Deutschen Bank zu eröffnen. Falls dies nicht möglich ist, kontaktiere uns bitte.",
  ];

  const steps = [
    {
      title: "Bankkonto eröffnen",
      description: "Eröffne ein Girokonto bei der Deutschen Bank, das sowohl eine Debitkarte als auch eine Kreditkarte umfasst. Wichtig: Alle anfallenden Kontoführungsgebühren werden am Ende von uns übernommen."
    },
    {
      title: "Bestätigung und Anmeldung",
      description: "Nachdem du dein Konto eröffnet hast, erhältst du die Unterlagen, Karten sowie einen QR-Code für die PushTAN-App. Sobald du alle Dokumente hast, registrierst du dich über unser Anmeldeformular. Deine Daten werden über einen verschlüsselten Anbieter vorübergehend gespeichert."
    },
    {
      title: "WhatsApp-Bestätigung & Warteschlange",
      description: "Nachdem wir deine Anmeldung erhalten haben, bekommst du eine WhatsApp-Benachrichtigung, dass du auf der Warteliste bist. Die Bearbeitung kann bis zu eine Woche dauern."
    },
    {
      title: "Kurzes Telefonat zur Bestätigung",
      description: "Sobald du an der Reihe bist, führen wir ein kurzes Telefonat, um den weiteren Ablauf zu besprechen."
    },
    {
      title: "Durchführung & Auszahlung",
      description: "Wir loggen uns in dein Bankkonto ein und überweisen dort Geld, um es bei den Buchmachern einzusetzen. Mithilfe unserer Strategie erzielen wir garantierte Gewinne. Nach etwa zwei Wochen erfolgt die Auszahlung, und du erhältst deine 250€ Gutschrift. Danach wird das Konto geschlossen, und wir übernehmen alle anfallenden Gebühren."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <Hero
        title="Teilnahme & Affiliate – So funktioniert's"
        subtitle="Einfacher Prozess"
        description="Werde Mitspieler und sichere dir 250€ – Steige danach direkt als Affiliate ein! Wir nutzen Willkommensboni von Sportwettenanbietern, um Gewinne zu erzielen – und dafür brauchen wir dich!"
      />
      
      <section className="py-16 md:py-24 bg-betclever-beige/20">
        <div className="container mx-auto container-padding">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 animate-on-scroll">
              <h2 className="text-2xl md:text-3xl font-bold text-betclever-darkblue mb-6 animate-fade-in">
                Voraussetzungen für die Teilnahme
              </h2>
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3 animate-slide-in" style={{animationDelay: `${index * 100}ms`}}>
                    <CheckCircle className="flex-shrink-0 text-betclever-gold mt-1" size={20} />
                    <span className="text-betclever-darkblue/80">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto container-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold text-betclever-darkblue mb-4 animate-fade-in">
                Schritt für Schritt zum Gewinn
              </h2>
              <p className="text-betclever-darkblue/70 max-w-2xl mx-auto">
                Unser Prozess ist einfach und transparent. Folge diesen Schritten, um deine garantierten Gewinne zu sichern.
              </p>
            </div>
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6 animate-on-scroll animate-slide-in" style={{animationDelay: `${index * 200}ms`}}>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-betclever-gold text-white flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-betclever-darkblue mb-3">
                      {step.title}
                    </h3>
                    <p className="text-betclever-darkblue/80">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-20 text-center animate-on-scroll">
              <h3 className="text-2xl font-bold text-betclever-darkblue mb-6">
                Nach deiner erfolgreichen Teilnahme
              </h3>
              <p className="text-betclever-darkblue/80 mb-8 max-w-2xl mx-auto">
                Kannst du direkt als Affiliate einsteigen und durch das Werben neuer Teilnehmer 250€ Provision pro Anmeldung verdienen.
              </p>
              
              <div className="mt-12 max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-betclever-gold/20 animate-fade-in">
                <h4 className="font-bold text-xl text-betclever-darkblue mb-4">Bevor du teilnehmen kannst</h4>
                <div className="space-y-4 text-left">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="terms" 
                      checked={hasReadTerms}
                      onCheckedChange={(checked) => {
                        setHasReadTerms(checked === true);
                      }}
                      className="mt-1 data-[state=checked]:bg-betclever-gold data-[state=checked]:border-betclever-gold"
                    />
                    <label 
                      htmlFor="terms" 
                      className="text-betclever-darkblue/80 cursor-pointer"
                    >
                      Ich habe die Teilnahmebedingungen gelesen und verstanden
                    </label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="bank" 
                      checked={hasBankAccount}
                      onCheckedChange={(checked) => {
                        setHasBankAccount(checked === true);
                      }}
                      className="mt-1 data-[state=checked]:bg-betclever-gold data-[state=checked]:border-betclever-gold"
                    />
                    <label 
                      htmlFor="bank" 
                      className="text-betclever-darkblue/80 cursor-pointer"
                    >
                      Ich habe bereits ein Bankkonto bei der Deutschen Bank eröffnet
                    </label>
                  </div>
                </div>
                
                <button
                  onClick={handleSubmit}
                  className="mt-6 inline-block bg-betclever-gold hover:bg-betclever-gold/90 text-white px-8 py-4 rounded-md font-medium text-md button-hover-effect w-full transition-all"
                >
                  Jetzt anmelden & mitmachen!
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Teilnahme;
