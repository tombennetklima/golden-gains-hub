
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-betclever-darkblue text-white py-16">
      <div className="container mx-auto container-padding">
        <div className="grid md:grid-cols-2 gap-10 mb-10">
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-white font-bold text-xl tracking-tight">
                BET<span className="text-betclever-gold">CLEVER</span>
              </span>
            </Link>
            <p className="text-white/70 max-w-md">
              Wir haben uns auf Matched Betting spezialisiert und nutzen
              Willkommensboni von Sportwettenanbietern, um garantierte Gewinne
              zu erzielen.
            </p>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-white/70 hover:text-betclever-gold transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/datenschutz"
                    className="text-white/70 hover:text-betclever-gold transition-colors"
                  >
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link
                    to="/teilnahme"
                    className="text-white/70 hover:text-betclever-gold transition-colors"
                  >
                    Teilnahme & Affiliate
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Mehr</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://form.jotform.com/250773154185055"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-betclever-gold transition-colors"
                  >
                    Anmeldung
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © {currentYear} BETCLEVER. Alle Rechte vorbehalten.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/datenschutz"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
