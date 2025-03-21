
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabaseService } from "@/lib/supabaseService";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle } from "lucide-react";

interface UserSubmitConfirmationProps {
  userId: string;
  onSubmitComplete?: () => void;
  disabled?: boolean;
}

const UserSubmitConfirmation = ({ 
  userId, 
  onSubmitComplete,
  disabled = false
}: UserSubmitConfirmationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!confirmed) {
      toast({
        title: "Bitte bestätigen",
        description: "Bitte bestätige, dass alle Angaben korrekt sind.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await supabaseService.submitDocumentsForReview(userId);
      
      toast({
        title: "Erfolgreich eingereicht",
        description: "Deine Daten wurden erfolgreich zur Überprüfung eingereicht."
      });
      
      if (onSubmitComplete) {
        onSubmitComplete();
      }
    } catch (error) {
      console.error("Error submitting documents:", error);
      toast({
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Bestätigung</h3>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="confirm" 
            checked={confirmed} 
            onCheckedChange={(checked) => setConfirmed(checked === true)}
            disabled={isLoading || disabled}
          />
          <label 
            htmlFor="confirm" 
            className="text-sm leading-tight cursor-pointer"
          >
            Ich bestätige, dass alle meine Angaben und hochgeladenen Dokumente
            korrekt und vollständig sind. Mir ist bewusst, dass nach dieser
            Bestätigung keine Änderungen mehr möglich sind.
          </label>
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={!confirmed || isLoading || disabled}
          className="bg-betclever-gold hover:bg-betclever-gold/90 w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird eingereicht...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Zur Prüfung einreichen
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UserSubmitConfirmation;
