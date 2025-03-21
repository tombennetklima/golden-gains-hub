
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onCancel: () => void;
}

const ForgotPasswordForm = ({ onCancel }: ForgotPasswordFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    // Simply display instructions - no actual password reset
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Passwort zurücksetzen</h2>
        <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
          Bitte sende eine E-Mail an <strong>support@betclever.de</strong>, damit wir dein Passwort zurücksetzen können.
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onCancel}
        >
          Zurück zum Login
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Passwort zurücksetzen</h2>
      <p className="text-gray-600 mb-4">
        Gib deine E-Mail-Adresse ein, um fortzufahren.
      </p>
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
          <div className="flex flex-col space-y-2">
            <Button
              type="submit"
              className="w-full bg-betclever-gold hover:bg-betclever-gold/90"
            >
              Fortfahren
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onCancel}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zum Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
