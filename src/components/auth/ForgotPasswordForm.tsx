
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ForgotPasswordFormProps {
  onCancel: () => void;
}

const ForgotPasswordForm = ({ onCancel }: ForgotPasswordFormProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Passwort zurücksetzen</h2>
      <p className="text-gray-600 mb-6">
        Bitte sende eine E-Mail an <strong>info@betclever.de</strong> mit deiner registrierten E-Mail-Adresse, 
        damit wir dein Passwort zurücksetzen können.
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Zurück zum Login
        </Button>
        <Link 
          to="mailto:info@betclever.de?subject=Passwort%20zurücksetzen" 
          className="flex-1"
        >
          <Button 
            className="w-full bg-betclever-gold hover:bg-betclever-gold/90"
          >
            E-Mail öffnen
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
