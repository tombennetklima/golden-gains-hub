
import { ArrowRight } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  className?: string;
}

const Hero = ({
  title,
  subtitle,
  description,
  showButton = false,
  buttonText = "Jetzt anmelden",
  buttonLink = "https://form.jotform.com/250773154185055",
  className = "",
}: HeroProps) => {
  return (
    <section className={`pt-32 pb-20 md:pt-40 md:pb-28 ${className}`}>
      <div className="container mx-auto container-padding">
        <div className="max-w-3xl mx-auto text-center">
          {subtitle && (
            <div className="inline-block px-3 py-1 mb-6 bg-betclever-darkblue/5 text-betclever-darkblue rounded-full text-sm font-medium tracking-wide animate-fade-in">
              {subtitle}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-betclever-darkblue mb-6 tracking-tight leading-tight animate-slide-in text-balance">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-betclever-darkblue/80 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-in delay-100 text-balance">
              {description}
            </p>
          )}
          {showButton && (
            <a
              href={buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-betclever-gold hover:bg-betclever-gold/90 text-white px-8 py-4 rounded-md font-medium text-md tracking-wide button-hover-effect animate-slide-in delay-200"
            >
              {buttonText}
              <ArrowRight size={18} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
