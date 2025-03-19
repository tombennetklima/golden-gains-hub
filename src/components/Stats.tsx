
import { useEffect, useRef } from "react";

const statsData = [
  {
    figure: "1.250.000 €",
    label: "Gesamtgewinn",
    description: "Erzielt durch unser System",
  },
  {
    figure: "950.000 €",
    label: "Ausgezahlte Provisionen",
    description: "Direkt an unsere Affiliates",
  },
  {
    figure: "6 Millionen €",
    label: "Jährliche Wetteinsätze",
    description: "Mit wachsender Tendenz",
  },
];

const Stats = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const statsItems = entry.target.querySelectorAll(".stat-item");
          if (entry.isIntersecting) {
            statsItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add("visible");
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
    <section ref={sectionRef} className="py-20 bg-betclever-darkblue text-white">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Unsere Zahlen sprechen für sich
          </h2>
          <div className="fine-line mx-auto bg-betclever-gold/50"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="stat-item animate-on-scroll bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 transition-all duration-500"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-betclever-gold mb-2">
                {stat.figure}
              </h3>
              <h4 className="text-xl font-medium mb-2">{stat.label}</h4>
              <p className="text-white/70">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
