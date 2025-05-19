
import { Attachment } from "./EmailComposer";
import { X, FileText } from "lucide-react";

interface AttachmentListProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

export const AttachmentList = ({ attachments, onRemove }: AttachmentListProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map(attachment => (
        <div 
          key={attachment.id}
          className="flex items-center gap-2 border rounded-md p-2 bg-gray-50"
        >
          <FileText className="h-4 w-4 text-email-primary" />
          <div>
            <div className="text-sm font-medium">{attachment.name}</div>
            <div className="text-xs text-gray-500">{formatFileSize(attachment.size)}</div>
          </div>
          <button 
            className="ml-2 hover:bg-gray-200 rounded-full p-1"
            onClick={() => onRemove(attachment.id)}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
