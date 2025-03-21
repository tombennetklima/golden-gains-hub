
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockAuthService, UserProfile } from "@/lib/mockAuthService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

interface UserProfileFormProps {
  userId: string;
  initialProfile?: UserProfile;
  isLocked?: boolean;
  onProfileUpdate?: () => void;
}

const UserProfileForm = ({
  userId,
  initialProfile,
  isLocked = false,
  onProfileUpdate
}: UserProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    ...initialProfile
  });
  const { toast } = useToast();

  useEffect(() => {
    if (initialProfile) {
      setProfile({
        firstName: "",
        lastName: "",
        phone: "",
        street: "",
        houseNumber: "",
        postalCode: "",
        city: "",
        ...initialProfile
      });
    }
  }, [initialProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await mockAuthService.updateUserProfile(userId, profile);
      toast({
        title: "Profil aktualisiert",
        description: "Deine Daten wurden erfolgreich gespeichert."
      });
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Fehler",
        description: "Deine Daten konnten nicht gespeichert werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Vorname</Label>
          <Input
            id="firstName"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            disabled={isLoading || isLocked}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Nachname</Label>
          <Input
            id="lastName"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            disabled={isLoading || isLocked}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={profile.phone}
          onChange={handleChange}
          disabled={isLoading || isLocked}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="street">Straße</Label>
          <Input
            id="street"
            name="street"
            value={profile.street}
            onChange={handleChange}
            disabled={isLoading || isLocked}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="houseNumber">Hausnummer</Label>
          <Input
            id="houseNumber"
            name="houseNumber"
            value={profile.houseNumber}
            onChange={handleChange}
            disabled={isLoading || isLocked}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postleitzahl</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={profile.postalCode}
            onChange={handleChange}
            disabled={isLoading || isLocked}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">Ort</Label>
          <Input
            id="city"
            name="city"
            value={profile.city}
            onChange={handleChange}
            disabled={isLoading || isLocked}
            required
          />
        </div>
      </div>
      
      {!isLocked && (
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-betclever-gold hover:bg-betclever-gold/90"
        >
          {isLoading ? "Speichern..." : <><Save size={16} /> Speichern</>}
        </Button>
      )}
    </form>
  );
};

export default UserProfileForm;
