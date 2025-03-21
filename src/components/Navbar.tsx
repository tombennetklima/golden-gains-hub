
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { supabaseService } from "@/lib/supabaseService";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<null | { username: string }>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication status on mount and when location changes
  useEffect(() => {
    const checkAuth = async () => {
      const user = await supabaseService.getCurrentUser();
      setIsLoggedIn(!!user);
      setCurrentUser(user);
    };
    
    checkAuth();
  }, [location.pathname]);

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

  const handleLogout = async () => {
    await supabaseService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    toast({
      title: "Erfolgreich abgemeldet",
      description: "Du wurdest erfolgreich abgemeldet."
    });
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Datenschutz", path: "/datenschutz" },
    { name: "Teilnahme & Affiliate", path: "/teilnahme" },
  ];

  // Add Dashboard conditionally if logged in
  const allNavItems = isLoggedIn 
    ? [...navItems, { name: "Dashboard", path: "/dashboard" }] 
    : navItems;

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
          {allNavItems.map((item) => (
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
          
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-8 w-8 ml-4">
                  <AvatarFallback className="bg-betclever-gold text-white">
                    {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Abmelden</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
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
          )}
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
            {allNavItems.map((item) => (
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
            
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="flex items-center text-sm font-medium py-2 text-betclever-darkblue hover:text-betclever-gold"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Abmelden
              </button>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
