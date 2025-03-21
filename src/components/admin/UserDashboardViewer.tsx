
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockAuthService, User, DocumentUpload } from "@/lib/mockAuthService";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  X, 
  Download, 
  FileCheck, 
  UserCheck, 
  CreditCard, 
  Landmark, 
  Edit,
  ArrowLeft,
  Contact,
  FileText,
  UserPlus,
  CheckCheck,
  Ticket,
  Wallet
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserDashboardViewerProps {
  userId: string;
  onBack: () => void;
  onUserUpdated: () => void;
}

const UserDashboardViewer = ({ userId, onBack, onUserUpdated }: UserDashboardViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch the specific user and their documents
        const allUsers = await mockAuthService.getAllUsers();
        const foundUser = allUsers.find(u => u.id === userId);
        
        if (foundUser) {
          setUser(foundUser);
          const userDocs = await mockAuthService.getUserDocuments(userId);
          setDocuments(userDocs);
        }
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
  }, [userId, toast]);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600">Bestätigt</Badge>;
      case "pending_review":
        return <Badge className="bg-amber-500">Wird überprüft</Badge>;
      case "rejected":
        return <Badge className="bg-red-600">Abgelehnt</Badge>;
      case "not_complete":
        return <Badge className="bg-gray-400">Nicht vollständig</Badge>;
      default:
        return <Badge className="bg-gray-400">Nicht gestartet</Badge>;
    }
  };

  const getCommunityStatusBadge = (status?: string) => {
    switch (status) {
      case "abgeschlossen":
        return <Badge className="bg-green-600">Abgeschlossen</Badge>;
      case "auszahlung":
        return <Badge className="bg-green-500">Auszahlung</Badge>;
      case "wetten":
        return <Badge className="bg-blue-500">Wetten</Badge>;
      case "verifizierung":
        return <Badge className="bg-amber-500">Verifizierung</Badge>;
      case "registrierung":
        return <Badge className="bg-purple-500">Registrierung</Badge>;
      case "vorbereitung":
        return <Badge className="bg-gray-600">Vorbereitung</Badge>;
      case "kontaktaufnahme":
        return <Badge className="bg-blue-600">Kontaktaufnahme</Badge>;
      case "not_started":
        return <Badge className="bg-gray-400">Nicht gestartet</Badge>;
      default:
        return <Badge className="bg-gray-400">Nicht gestartet</Badge>;
    }
  };

  const handleApproveDocuments = async () => {
    try {
      await mockAuthService.updateUserDocumentStatus(userId, "approved");
      toast({
        title: "Status aktualisiert",
        description: "Dokumente wurden bestätigt."
      });
      onUserUpdated();
    } catch (error) {
      console.error("Error updating document status:", error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
    }
  };

  const handleRejectDocuments = async () => {
    try {
      await mockAuthService.updateUserDocumentStatus(userId, "rejected");
      toast({
        title: "Status aktualisiert",
        description: "Dokumente wurden abgelehnt."
      });
      onUserUpdated();
    } catch (error) {
      console.error("Error updating document status:", error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
    }
  };

  const handleCommunityStatusChange = async (value: string) => {
    if (!user) return;
    
    try {
      await mockAuthService.updateUserCommunityStatus(
        userId, 
        value as "not_started" | "kontaktaufnahme" | "vorbereitung" | 
              "registrierung" | "verifizierung" | "wetten" | "auszahlung" | "abgeschlossen"
      );
      
      toast({
        title: "Status aktualisiert",
        description: "Tippgemeinschaft Status wurde aktualisiert."
      });
      
      onUserUpdated();
    } catch (error) {
      console.error("Error updating community status:", error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
    }
  };

  const unlockField = async (field: string) => {
    try {
      await mockAuthService.unlockFieldForEditing(userId, field);
      toast({
        title: "Feld entsperrt",
        description: `Das Feld "${field}" wurde zur Bearbeitung freigegeben.`
      });
      onUserUpdated();
    } catch (error) {
      console.error("Error unlocking field:", error);
      toast({
        title: "Fehler",
        description: "Feld konnte nicht entsperrt werden.",
        variant: "destructive"
      });
    }
  };

  const downloadDocument = (documentUrl: string) => {
    // In a real app, you would download the document
    // For the mock, we'll just simulate it
    console.log("Downloading document:", documentUrl);
    toast({
      title: "Download gestartet",
      description: "Das Dokument wird heruntergeladen."
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <p className="text-center">Daten werden geladen...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <p className="text-center">Benutzer nicht gefunden</p>
        <Button onClick={onBack} className="mt-4">
          Zurück
        </Button>
      </div>
    );
  }

  const profileData = user.profile || {};
  const idDocuments = documents.find(d => d.type === "id")?.files || [];
  const cardDocuments = documents.find(d => d.type === "card")?.files || [];
  const bankDocuments = documents.find(d => d.type === "bank")?.files || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Zurück
        </Button>
        
        <div className="flex items-center gap-2">
          {user.documentsStatus?.uploadStatus === "pending_review" && (
            <>
              <Button 
                onClick={handleApproveDocuments}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" /> Bestätigen
              </Button>
              
              <Button 
                onClick={handleRejectDocuments}
                variant="destructive"
              >
                <X className="h-4 w-4 mr-2" /> Ablehnen
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Benutzerdetails</h2>
          <div className="flex gap-2">
            {getStatusBadge(user.documentsStatus?.uploadStatus)}
            {getCommunityStatusBadge(user.documentsStatus?.communityStatus)}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Tippgemeinschaft Status ändern</h3>
          <div className="flex gap-4 items-center">
            <Select 
              onValueChange={handleCommunityStatusChange}
              defaultValue={user.documentsStatus?.communityStatus || "not_started"}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Status auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Nicht gestartet</SelectItem>
                <SelectItem value="kontaktaufnahme">Kontaktaufnahme</SelectItem>
                <SelectItem value="vorbereitung">Vorbereitung</SelectItem>
                <SelectItem value="registrierung">Registrierung</SelectItem>
                <SelectItem value="verifizierung">Verifizierung</SelectItem>
                <SelectItem value="wetten">Wetten</SelectItem>
                <SelectItem value="auszahlung">Auszahlung</SelectItem>
                <SelectItem value="abgeschlossen">Abgeschlossen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <UserCheck className="h-5 w-5 mr-2 text-betclever-gold" />
              Persönliche Daten
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2 h-6 w-6"
                onClick={() => unlockField("firstName")}
                title="Zur Bearbeitung freigeben"
              >
                <Edit size={14} />
              </Button>
            </h3>
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Vorname</p>
                  <p>{profileData.firstName || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nachname</p>
                  <p>{profileData.lastName || "-"}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <p>{profileData.phone || "-"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{user.email}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Straße</p>
                  <p>{profileData.street || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hausnummer</p>
                  <p>{profileData.houseNumber || "-"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Postleitzahl</p>
                  <p>{profileData.postalCode || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ort</p>
                  <p>{profileData.city || "-"}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-betclever-gold" />
              Ausweisdokumente
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2 h-6 w-6"
                onClick={() => unlockField("id")}
                title="Zur Bearbeitung freigeben"
              >
                <Edit size={14} />
              </Button>
            </h3>
            
            {idDocuments.length > 0 ? (
              <div className="space-y-2">
                {idDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Dokument {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadDocument(doc)}
                      title="Herunterladen"
                    >
                      <Download size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Keine Dokumente hochgeladen</p>
            )}
            
            <h3 className="text-lg font-medium mt-6 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-betclever-gold" />
              Girokarte & Kreditkarte
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2 h-6 w-6"
                onClick={() => unlockField("card")}
                title="Zur Bearbeitung freigeben"
              >
                <Edit size={14} />
              </Button>
            </h3>
            
            {cardDocuments.length > 0 ? (
              <div className="space-y-2">
                {cardDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Dokument {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadDocument(doc)}
                      title="Herunterladen"
                    >
                      <Download size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Keine Dokumente hochgeladen</p>
            )}
            
            <h3 className="text-lg font-medium mt-6 mb-4 flex items-center">
              <Landmark className="h-5 w-5 mr-2 text-betclever-gold" />
              Bankdokumente
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2 h-6 w-6"
                onClick={() => unlockField("bank")}
                title="Zur Bearbeitung freigeben"
              >
                <Edit size={14} />
              </Button>
            </h3>
            
            {bankDocuments.length > 0 ? (
              <div className="space-y-2">
                {bankDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Dokument {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadDocument(doc)}
                      title="Herunterladen"
                    >
                      <Download size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Keine Dokumente hochgeladen</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardViewer;
