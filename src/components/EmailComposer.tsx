
import { useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useEmailComposer } from '@/hooks/useEmailComposer';
import { RecipientField } from '@/components/email/RecipientField';
import { EmailSubject } from '@/components/email/EmailSubject';
import { EmailToolbar } from '@/components/email/EmailToolbar';
import { EmailFooter } from '@/components/email/EmailFooter';
import { EmailEditor } from '@/components/EmailEditor';
import { AttachmentList } from '@/components/AttachmentList';
import { Button } from "@/components/ui/button";
import { EmailTemplate } from '@/components/EmailTemplates';

const EmailComposer = () => {
  const { toast } = useToast();
  const {
    showCc,
    showBcc,
    subject,
    body,
    recipients,
    attachments,
    setShowCc,
    setShowBcc,
    setSubject,
    setBody,
    handleAddRecipient,
    handleRemoveRecipient,
    handleAddAttachments,
    handleRemoveAttachment,
    handleApplySignature,
    handleSaveDraft,
    handleSendEmail,
    getFilteredRecipients
  } = useEmailComposer();

  const handleApplyTemplate = (template: EmailTemplate) => {
    setSubject(template.subject);
    
    // Don't directly set body state - we need to update the editor content too
    // which will trigger onChange and update the body state
    const editorElement = document.querySelector('[contenteditable=true]');
    if (editorElement) {
      editorElement.innerHTML = template.content;
      // Trigger the onChange event to update the state
      const event = new Event('input', { bubbles: true });
      editorElement.dispatchEvent(event);
    } else {
      // Fallback if direct DOM manipulation fails
      setBody(template.content);
    }
    
    toast({
      title: "Template Applied",
      description: `The "${template.name}" template has been applied.`,
    });
  };

  const handleSaveTemplate = (template: Partial<EmailTemplate>) => {
    toast({
      title: "Template Saved",
      description: `"${template.name}" has been saved as a template.`,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-email-background border-b border-email-border">
        {/* Title removed from here */}
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Recipients */}
          <div className="space-y-2">
            <div className="flex items-center">
              <RecipientField 
                label="To"
                recipients={getFilteredRecipients('to')}
                onAddRecipient={handleAddRecipient}
                onRemoveRecipient={handleRemoveRecipient}
                type="to"
              />
              <div className="flex gap-1 ml-2">
                <Button 
                  variant="ghost" 
                  className="h-8 text-xs" 
                  onClick={() => setShowCc(!showCc)}
                >
                  Cc
                </Button>
                <Button 
                  variant="ghost" 
                  className="h-8 text-xs" 
                  onClick={() => setShowBcc(!showBcc)}
                >
                  Bcc
                </Button>
              </div>
            </div>

            {/* CC Field */}
            {showCc && (
              <RecipientField 
                label="Cc"
                recipients={getFilteredRecipients('cc')}
                onAddRecipient={handleAddRecipient}
                onRemoveRecipient={handleRemoveRecipient}
                type="cc"
              />
            )}

            {/* BCC Field */}
            {showBcc && (
              <RecipientField 
                label="Bcc"
                recipients={getFilteredRecipients('bcc')}
                onAddRecipient={handleAddRecipient}
                onRemoveRecipient={handleRemoveRecipient}
                type="bcc"
              />
            )}
          </div>

          <Separator />

          {/* Subject */}
          <EmailSubject 
            subject={subject}
            onChange={setSubject}
          />

          {/* Templates and Signatures */}
          <EmailToolbar 
            onSelectTemplate={handleApplyTemplate}
            onSaveTemplate={handleSaveTemplate}
            onSelectSignature={handleApplySignature}
            currentSubject={subject}
            currentContent={body}
          />

          {/* Rich Text Editor */}
          <EmailEditor 
            initialValue={body}
            onChange={setBody}
          />

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Attachments ({attachments.length})</div>
              <AttachmentList 
                attachments={attachments} 
                onRemove={handleRemoveAttachment} 
              />
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-0">
        <EmailFooter 
          onSend={handleSendEmail}
          onSaveDraft={handleSaveDraft}
          onAttach={handleAddAttachments}
        />
      </CardFooter>
    </Card>
  );
};

export default EmailComposer;
