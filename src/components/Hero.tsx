
import { ArrowRight, Circle, CircleDashed } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  useButtonAsLink?: boolean;
  className?: string;
}

const Hero = ({
  title,
  subtitle,
  description,
  showButton = false,
  buttonText = "Mehr erfahren",
  buttonLink = "/teilnahme",
  useButtonAsLink = true,
  className = "",
}: HeroProps) => {
  return (
    <section className={`pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden ${className}`}>
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 opacity-10 animate-spin-slow">
        <Circle size={180} className="text-betclever-gold" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10 animate-pulse-slow">
        <CircleDashed size={120} className="text-betclever-darkblue" />
      </div>
      <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full border border-betclever-gold/10 animate-pulse-slow"></div>
      <div className="absolute top-2/3 right-1/4 w-48 h-48 rounded-full border border-betclever-darkblue/10 animate-pulse-slow"></div>
      
      <div className="container mx-auto container-padding relative z-10">
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
            useButtonAsLink ? (
              <Link
                to={buttonLink}
                className="inline-flex items-center gap-2 bg-betclever-gold hover:bg-betclever-gold/90 text-white px-8 py-4 rounded-md font-medium text-md tracking-wide button-hover-effect animate-slide-in delay-200"
              >
                {buttonText}
                <ArrowRight size={18} />
              </Link>
            ) : (
              <a
                href={buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-betclever-gold hover:bg-betclever-gold/90 text-white px-8 py-4 rounded-md font-medium text-md tracking-wide button-hover-effect animate-slide-in delay-200"
              >
                {buttonText}
                <ArrowRight size={18} />
              </a>
            )
          )}
        </div>
      </div>
      
      {/* Diagonal line decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
        <div className="w-full h-40 transform rotate-2 translate-y-10 bg-betclever-beige/20"></div>
      </div>
    </section>
  );
};

export default Hero;
