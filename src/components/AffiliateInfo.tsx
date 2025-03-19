
import { CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";

const steps = [
  {
    title: "Mitspielen & 250€ verdienen",
    description:
      "Nimm zunächst als Mitspieler teil und erhalte dafür eine garantierte Belohnung von 250€.",
  },
  {
    title: "Als Affiliate starten",
    description:
      "Starte direkt als Affiliate und erhalte für jeden geworbenen Teilnehmer weitere 250€ Provision.",
  },
  {
    title: "Regelmäßiges Einkommen",
    description:
      "Mit nur einem geworbenen Mitspieler pro Tag sind 7.500€ monatlich möglich.",
  },
  {
    title: "Netzwerk nutzen",
    description:
      "Unsere erfolgreichsten Affiliates nutzen Netzwerke wie Schulen, Universitäten, Freundeskreis oder Social Media.",
  },
];

const AffiliateInfo = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const steps = entry.target.querySelectorAll(".step-item");
          if (entry.isIntersecting) {
            steps.forEach((step, index) => {
              setTimeout(() => {
                step.classList.add("visible");
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing bg-betclever-beige/30">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 bg-betclever-gold/10 text-betclever-gold rounded-full text-sm font-medium">
            Affiliate-Programm
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-betclever-darkblue mb-4">
            Deine Chance: Werde Affiliate und verdiene 10.000€+ im Monat
          </h2>
          <p className="text-betclever-darkblue/70 max-w-3xl mx-auto">
            Unser System bietet jedem die Möglichkeit, als Affiliate ein
            monatliches Einkommen von über 10.000€ zu erzielen. Der Ablauf ist
            einfach.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="step-item flex gap-4 animate-on-scroll"
            >
              <div className="flex-shrink-0 mt-1">
                <CheckCircle
                  className="text-betclever-gold"
                  size={24}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-betclever-darkblue mb-2">
                  {step.title}
                </h3>
                <p className="text-betclever-darkblue/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="https://form.jotform.com/250773154185055"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-betclever-gold hover:bg-betclever-gold/90 text-white px-8 py-4 rounded-md font-medium text-md button-hover-effect"
          >
            Jetzt als Affiliate starten
          </a>
        </div>
      </div>
    </section>
  );
};

export default AffiliateInfo;
