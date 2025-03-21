
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockAuthService, User, UserProfile, DocumentUpload as DocumentUploadType } from "@/lib/mockAuthService";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import UserProfileForm from "./UserProfileForm";
import DocumentUploadComp from "./DocumentUpload";
import UserSubmitConfirmation from "./UserSubmitConfirmation";
import { FileCheck, UserCheck, CreditCard, Landmark } from "lucide-react";

interface CommunityStarterProps {
  user: User;
  onUpdate: () => void;
}

const CommunityStarter = ({ user, onUpdate }: CommunityStarterProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<DocumentUploadType[]>([]);
  const [isProfileLocked, setIsProfileLocked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const userDocs = await mockAuthService.getUserDocuments(user.id);
        setDocuments(userDocs);
        setIsProfileLocked(user.profile?.isLocked || false);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Fehler",
          description: "Daten konnten nicht geladen werden.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user, toast]);

  const getDocumentsByType = (type: "id" | "card" | "bank") => {
    const doc = documents.find(d => d.type === type);
    return doc ? doc.files : [];
  };

  const isDocumentLocked = (type: "id" | "card" | "bank") => {
    const doc = documents.find(d => d.type === type);
    return doc?.isLocked || false;
  };

  const isSubmittedForReview = user.documentsStatus?.uploadStatus === "pending_review" || 
                             user.documentsStatus?.uploadStatus === "approved";

  const handleDocumentUpload = () => {
    onUpdate();
  };

  const handleProfileUpdate = () => {
    onUpdate();
  };

  const handleSubmitComplete = () => {
    onUpdate();
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <p className="text-center">Daten werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Tippgemeinschaft starten</h2>
        <p className="text-gray-600 mb-6">
          Um an der Tippgemeinschaft teilzunehmen, benötigen wir einige persönliche Daten
          und Dokumente von dir. Bitte fülle das untenstehende Formular aus und lade die
          erforderlichen Dokumente hoch.
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="profile">
            <AccordionTrigger className="flex items-center">
              <div className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-betclever-gold" />
                <span>Persönliche Daten</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <UserProfileForm 
                  userId={user.id} 
                  initialProfile={user.profile}
                  isLocked={isProfileLocked || isSubmittedForReview}
                  onProfileUpdate={handleProfileUpdate}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="idDocuments">
            <AccordionTrigger className="flex items-center">
              <div className="flex items-center">
                <FileCheck className="h-5 w-5 mr-2 text-betclever-gold" />
                <span>Ausweisdokumente</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <DocumentUploadComp
                  userId={user.id}
                  documentType="id"
                  title="Ausweisdokumente"
                  description="Bitte lade die Vorder- und Rückseite deines Ausweises sowie ein Foto von dir mit dem Ausweis neben deinem Gesicht hoch."
                  existingFiles={getDocumentsByType("id")}
                  isLocked={isDocumentLocked("id") || isSubmittedForReview}
                  onUploadComplete={handleDocumentUpload}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cardDocuments">
            <AccordionTrigger className="flex items-center">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-betclever-gold" />
                <span>Girokarte & Kreditkarte</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <DocumentUploadComp
                  userId={user.id}
                  documentType="card"
                  title="Karten"
                  description="Bitte lade die Vorder- und Rückseite deiner Girokarte sowie deiner Debit- oder Kreditkarte hoch."
                  existingFiles={getDocumentsByType("card")}
                  isLocked={isDocumentLocked("card") || isSubmittedForReview}
                  onUploadComplete={handleDocumentUpload}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="bankDocuments">
            <AccordionTrigger className="flex items-center">
              <div className="flex items-center">
                <Landmark className="h-5 w-5 mr-2 text-betclever-gold" />
                <span>Bankdokumente</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <DocumentUploadComp
                  userId={user.id}
                  documentType="bank"
                  title="Bankdokumente"
                  description="Bitte lade alle weiteren Bankdokumente hoch, die du für dein Konto erhalten hast, einschließlich aller PINs."
                  existingFiles={getDocumentsByType("bank")}
                  isLocked={isDocumentLocked("bank") || isSubmittedForReview}
                  onUploadComplete={handleDocumentUpload}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      {!isSubmittedForReview && (
        <UserSubmitConfirmation 
          userId={user.id}
          onSubmitComplete={handleSubmitComplete}
          disabled={
            !user.profile || 
            !getDocumentsByType("id").length || 
            !getDocumentsByType("card").length || 
            !getDocumentsByType("bank").length
          }
        />
      )}
    </div>
  );
};

export default CommunityStarter;
