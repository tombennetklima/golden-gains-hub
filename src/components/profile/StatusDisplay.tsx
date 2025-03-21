
import { DocumentsStatus } from "@/lib/mockAuthService";
import { Progress } from "@/components/ui/progress";
import { 
  Check, 
  Clock, 
  AlertCircle, 
  FileCheck, 
  Users 
} from "lucide-react";

interface StatusDisplayProps {
  status: DocumentsStatus;
}

const StatusDisplay = ({ status }: StatusDisplayProps) => {
  const getUploadProgress = () => {
    switch (status.uploadStatus) {
      case "approved": return 100;
      case "pending_review": return 66;
      case "rejected": return 33;
      case "not_complete": return 33;
      default: return 0;
    }
  };

  const getCommunityProgress = () => {
    switch (status.communityStatus) {
      case "complete": return 100;
      case "in_progress": return 50;
      case "not_started": return 0;
      default: return 0;
    }
  };

  const getUploadStatusIcon = () => {
    switch (status.uploadStatus) {
      case "approved":
        return <Check className="h-5 w-5 text-green-600" />;
      case "pending_review":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "not_complete":
        return <FileCheck className="h-5 w-5 text-gray-400" />;
      default:
        return <FileCheck className="h-5 w-5 text-gray-400" />;
    }
  };

  const getUploadStatusText = () => {
    switch (status.uploadStatus) {
      case "approved":
        return "Bestätigt";
      case "pending_review":
        return "Wird überprüft";
      case "rejected":
        return "Abgelehnt";
      case "not_complete":
        return "Nicht vollständig";
      default:
        return "Nicht gestartet";
    }
  };

  const getCommunityStatusIcon = () => {
    switch (status.communityStatus) {
      case "complete":
        return <Check className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "not_started":
        return <Users className="h-5 w-5 text-gray-400" />;
      default:
        return <Users className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCommunityStatusText = () => {
    switch (status.communityStatus) {
      case "complete":
        return "Abgeschlossen";
      case "in_progress":
        return "In Bearbeitung";
      case "not_started":
        return "Nicht gestartet";
      default:
        return "Nicht gestartet";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center mb-3">
          {getUploadStatusIcon()}
          <h3 className="text-lg font-medium ml-2">Dokumenten Status</h3>
        </div>
        <Progress value={getUploadProgress()} className="h-2 mb-2" />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Status: {getUploadStatusText()}</span>
          <span>{getUploadProgress()}%</span>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center mb-3">
          {getCommunityStatusIcon()}
          <h3 className="text-lg font-medium ml-2">Tippgemeinschaft Status</h3>
        </div>
        <Progress value={getCommunityProgress()} className="h-2 mb-2" />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Status: {getCommunityStatusText()}</span>
          <span>{getCommunityProgress()}%</span>
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;
