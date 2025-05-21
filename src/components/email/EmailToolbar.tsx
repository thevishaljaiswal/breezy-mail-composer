
import { EmailTemplates, EmailTemplate } from '@/components/EmailTemplates';
import { EmailSignature, EmailSignatureItem } from '@/components/EmailSignature';

interface EmailToolbarProps {
  onSelectTemplate: (template: EmailTemplate) => void;
  onSaveTemplate: (template: Partial<EmailTemplate>) => void;
  onSelectSignature: (signature: EmailSignatureItem) => void;
  currentSubject: string;
  currentContent: string;
}

export const EmailToolbar = ({
  onSelectTemplate,
  onSaveTemplate,
  onSelectSignature,
  currentSubject,
  currentContent
}: EmailToolbarProps) => {
  return (
    <div className="flex items-center gap-2">
      <EmailTemplates 
        onSelectTemplate={onSelectTemplate}
        onSaveTemplate={onSaveTemplate}
        currentSubject={currentSubject}
        currentContent={currentContent}
      />
      <EmailSignature 
        onSelectSignature={onSelectSignature}
      />
    </div>
  );
};
