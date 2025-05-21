
import { Input } from "@/components/ui/input";

interface EmailSubjectProps {
  subject: string;
  onChange: (value: string) => void;
}

export const EmailSubject = ({ subject, onChange }: EmailSubjectProps) => {
  return (
    <div className="flex items-center">
      <div className="w-[60px] text-sm font-medium">Subject:</div>
      <Input 
        className="flex-1"
        value={subject}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter email subject"
      />
    </div>
  );
};
