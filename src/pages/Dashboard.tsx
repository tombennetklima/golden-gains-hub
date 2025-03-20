
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockAuthService } from "@/lib/mockAuthService";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const user = await mockAuthService.getCurrentUser();
      
      if (!user) {
        navigate("/auth");
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 pb-10">
          <div className="container mx-auto px-4">
            <div className="text-center">Laden...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <p className="text-gray-600">
            Willkommen in deinem persönlichen Dashboard. Hier findest du deine Informationen und Einstellungen.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
