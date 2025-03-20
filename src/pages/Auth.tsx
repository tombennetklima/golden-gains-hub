
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

export type AuthMode = "login" | "register" | "forgot-password" | "reset-password";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  
  // URL params handler for reset password token
  const queryParams = new URLSearchParams(window.location.search);
  const resetToken = queryParams.get("token");
  const email = queryParams.get("email");

  // If token is present, show reset password form
  if (resetToken && email && mode !== "reset-password") {
    setMode("reset-password");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-10">
        <div className="container max-w-md mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-md">
            {verificationEmail ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Bestätige deine E-Mail</h2>
                <p className="mb-4">
                  Wir haben einen Bestätigungscode an <strong>{verificationEmail}</strong> gesendet.
                  Bitte überprüfe dein Postfach und klicke auf den Link in der E-Mail.
                </p>
                <button
                  onClick={() => setVerificationEmail(null)}
                  className="text-betclever-gold hover:underline"
                >
                  Zurück zum Login
                </button>
              </div>
            ) : mode === "reset-password" ? (
              <ResetPasswordForm 
                token={resetToken || ""} 
                email={email || ""}
                onSuccess={() => {
                  toast({
                    title: "Passwort zurückgesetzt",
                    description: "Du kannst dich jetzt mit deinem neuen Passwort anmelden.",
                  });
                  setMode("login");
                }} 
              />
            ) : mode === "forgot-password" ? (
              <ForgotPasswordForm
                onSuccess={(email) => {
                  toast({
                    title: "E-Mail gesendet",
                    description: "Wir haben dir eine E-Mail mit einem Link zum Zurücksetzen deines Passworts gesendet.",
                  });
                  setVerificationEmail(email);
                }}
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
                      navigate("/");
                    }}
                  />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm
                    onSuccess={(email) => {
                      toast({
                        title: "Registrierung erfolgreich",
                        description: "Bitte bestätige deine E-Mail-Adresse.",
                      });
                      setVerificationEmail(email);
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
