
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmailRecipient } from "@/components/EmailRecipient";
import { Recipient } from "@/hooks/useEmailComposer";

interface RecipientFieldProps {
  label: string;
  recipients: Recipient[];
  onAddRecipient: (email: string, type: 'to' | 'cc' | 'bcc') => void;
  onRemoveRecipient: (id: string) => void;
  type: 'to' | 'cc' | 'bcc';
}

export const RecipientField = ({
  label,
  recipients,
  onAddRecipient,
  onRemoveRecipient,
  type
}: RecipientFieldProps) => {
  return (
    <div className="flex items-center">
      <div className="w-[60px] text-sm font-medium">{label}:</div>
      <div className="flex-1 flex flex-wrap gap-2 min-h-10 items-center border rounded-md px-2">
        {recipients.map(recipient => (
          <EmailRecipient 
            key={recipient.id} 
            recipient={recipient} 
            onRemove={onRemoveRecipient} 
          />
        ))}
        <Input 
          className="flex-1 border-none shadow-none focus-visible:ring-0 h-8 min-w-[180px]" 
          placeholder="Enter email address"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              const target = e.target as HTMLInputElement;
              onAddRecipient(target.value.trim(), type);
              target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
};
