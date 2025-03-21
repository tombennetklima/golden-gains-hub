
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockAuthService } from "@/lib/mockAuthService";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, FileCheck } from "lucide-react";

interface DocumentUploadProps {
  userId: string;
  documentType: "id" | "card" | "bank";
  title: string;
  description: string;
  existingFiles?: string[];
  isLocked?: boolean;
  onUploadComplete?: () => void;
}

const DocumentUpload = ({
  userId,
  documentType,
  title,
  description,
  existingFiles = [],
  isLocked = false,
  onUploadComplete
}: DocumentUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<string[]>(existingFiles);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const { toast } = useToast();

  // Update files state when existingFiles change (for example, when accordion sections change)
  useEffect(() => {
    setFiles(existingFiles);
  }, [existingFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      setNewFiles(prev => [...prev, ...fileList]);
    }
  };

  const removeFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (newFiles.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // Convert files to base64 strings (in a real app, you would upload to storage)
      const filePromises = newFiles.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });
      
      const base64Files = await Promise.all(filePromises);
      const allFiles = [...files, ...base64Files];
      
      await mockAuthService.uploadDocument(userId, documentType, allFiles);
      
      setFiles(allFiles);
      setNewFiles([]);
      
      toast({
        title: "Dokumente hochgeladen",
        description: "Deine Dokumente wurden erfolgreich hochgeladen."
      });
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast({
        title: "Fehler",
        description: "Dokumente konnten nicht hochgeladen werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      {!isLocked && (
        <div className="mb-4">
          <Label htmlFor={`file-upload-${documentType}`} className="block mb-2">
            Dokumente auswählen
          </Label>
          <input
            id={`file-upload-${documentType}`}
            type="file"
            multiple
            onChange={handleFileChange}
            disabled={isLoading || isLocked}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(`file-upload-${documentType}`)?.click()}
            disabled={isLoading || isLocked}
            className="w-full border-dashed border-2 h-20 flex flex-col items-center justify-center"
          >
            <Upload size={20} className="mb-1" />
            <span>Dateien hochladen</span>
          </Button>
        </div>
      )}
      
      {/* Show existing files */}
      {files.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Hochgeladene Dokumente:</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                <FileCheck size={16} className="mr-2 text-green-600" />
                <span className="text-sm truncate flex-grow">Dokument {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Show newly selected files */}
      {newFiles.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Ausgewählte Dokumente:</h4>
          <div className="space-y-2">
            {newFiles.map((file, index) => (
              <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                <span className="text-sm truncate flex-grow">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  disabled={isLoading}
                  className="h-6 w-6"
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!isLocked && newFiles.length > 0 && (
        <Button
          type="button"
          onClick={uploadFiles}
          disabled={isLoading || newFiles.length === 0}
          className="bg-betclever-gold hover:bg-betclever-gold/90"
        >
          {isLoading ? "Uploading..." : "Hochladen"}
        </Button>
      )}
    </div>
  );
};

export default DocumentUpload;
