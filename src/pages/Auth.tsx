
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabaseService } from "@/lib/supabaseService";
import { supabase } from "@/lib/supabase";

export type AuthMode = "login" | "register" | "forgot-password";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Check for an active session
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // If we have a session, redirect to dashboard
          navigate('/dashboard');
          return;
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
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
        <div className="container max-w-md mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-md">
            {mode === "forgot-password" ? (
              <ForgotPasswordForm
                onCancel={() => setMode("login")}
              />
            ) : (
              <Tabs defaultValue={mode} onValueChange={(value) => setMode(value as AuthMode)}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Registrieren</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm
                    onForgotPassword={() => setMode("forgot-password")}
                    onSuccess={() => {
                      toast({
                        title: "Erfolgreich angemeldet",
                        description: "Willkommen zurück!",
                      });
                    }}
                  />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm
                    onSuccess={() => {
                      toast({
                        title: "Registrierung erfolgreich",
                        description: "Du kannst dich jetzt einloggen.",
                      });
                      setMode("login");
                    }}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
