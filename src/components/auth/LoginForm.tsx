
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabaseService } from "@/lib/supabaseService";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(6, "Passwort muss mindestens 6 Zeichen lang sein"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
}

const LoginForm = ({ onSuccess, onForgotPassword }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await supabaseService.login(values.email, values.password);
      console.log("Login successful");
      // Redirect to dashboard after successful login
      navigate("/dashboard");
      onSuccess();
    } catch (err) {
      console.error("Login error:", err);
      setError("Falsche E-Mail oder Passwort. Bitte versuche es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Anmelden</h2>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-Mail</FormLabel>
                <FormControl>
                  <Input placeholder="deine@email.de" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passwort</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="link"
            className="p-0 text-betclever-gold"
            onClick={onForgotPassword}
          >
            Passwort vergessen?
          </Button>
          <Button
            type="submit"
            className="w-full bg-betclever-gold hover:bg-betclever-gold/90"
            disabled={isLoading}
          >
            {isLoading ? "Anmelden..." : "Anmelden"}
          </Button>
          
          {/* Admin login hint */}
          <div className="text-xs text-gray-500 text-center mt-4">
            Admin Login: admin@betclever.de / Ver4Wittert!
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
