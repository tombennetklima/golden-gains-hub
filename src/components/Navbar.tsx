
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when location changes
    setIsMobileMenuOpen(false);
    
    // Scroll to top when the route changes
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Datenschutz", path: "/datenschutz" },
    { name: "Teilnahme & Affiliate", path: "/teilnahme" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center container-padding">
        <Link to="/" className="flex items-center">
          <span className="text-betclever-darkblue font-bold text-2xl tracking-tight">
            BET<span className="text-betclever-gold">CLEVER</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-betclever-gold ${
                location.pathname === item.path
                  ? "text-betclever-gold"
                  : "text-betclever-darkblue"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/auth"
            className={`text-sm font-medium transition-colors hover:text-betclever-gold ${
              location.pathname === "/auth"
                ? "text-betclever-gold"
                : "text-betclever-darkblue"
            }`}
          >
            Anmelden
          </Link>
          <Link
            to="/teilnahme"
            className="ml-4 bg-betclever-gold text-white px-5 py-2 rounded-md font-medium text-sm button-hover-effect"
          >
            Mehr erfahren
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-betclever-darkblue"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-md animate-fade-in">
          <div className="container mx-auto py-4 flex flex-col gap-4 container-padding">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium py-2 transition-colors hover:text-betclever-gold ${
                  location.pathname === item.path
                    ? "text-betclever-gold"
                    : "text-betclever-darkblue"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/auth"
              className={`text-sm font-medium py-2 transition-colors hover:text-betclever-gold ${
                location.pathname === "/auth"
                  ? "text-betclever-gold"
                  : "text-betclever-darkblue"
              }`}
            >
              Anmelden
            </Link>
            <Link
              to="/teilnahme"
              className="bg-betclever-gold text-white w-full text-center px-5 py-3 rounded-md font-medium text-sm"
            >
              Mehr erfahren
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
