
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Recipient } from "./EmailComposer";

interface EmailRecipientProps {
  recipient: Recipient;
  onRemove: (id: string) => void;
}

export const EmailRecipient = ({ recipient, onRemove }: EmailRecipientProps) => {
  return (
    <Badge 
      className="px-2 py-1 gap-1 flex items-center bg-email-secondary text-gray-800 hover:bg-email-hover"
    >
      <span>{recipient.email}</span>
      <button 
        className="ml-1 hover:bg-gray-200 rounded-full p-0.5" 
        onClick={() => onRemove(recipient.id)}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
};
