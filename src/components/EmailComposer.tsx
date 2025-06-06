import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  Send,
  Paperclip,
  Save,
  Calendar,
} from 'lucide-react';
import { validateEmail } from '@/lib/utils';
import { EmailRecipient } from '@/components/EmailRecipient';
import { AttachmentList } from '@/components/AttachmentList';
import { EmailEditor } from '@/components/EmailEditor';
import { EmailTemplates, EmailTemplate } from '@/components/EmailTemplates';
import { EmailSignature, EmailSignatureItem } from '@/components/EmailSignature';

export type Recipient = {
  id: string;
  email: string;
  type: 'to' | 'cc' | 'bcc';
}

export type Attachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

const PROFESSIONAL_SIGNATURE_CONTENT = `<div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
  <p style="margin: 0; padding: 0;"><strong>Customer Support Manager</strong></p>
  <p style="margin: 0; padding: 0; color: #666;">Gera Developments Private Limited</p>
  <br>
  <p style="margin: 0; padding: 0;">📧 Email: <a href="mailto:customersupport@gera.in" style="color: #0066cc; text-decoration: none;">customersupport@gera.in</a></p>
  <p style="margin: 0; padding: 0;">📞 Phone: <a href="tel:+912048555656" style="color: #0066cc; text-decoration: none;">+91 20 4855 5656</a></p>
  <p style="margin: 0; padding: 0; font-size: 12px; color: #888;">(Mon-Fri, 11:00 AM - 7:00 PM IST)</p>
  <br>
  <p style="margin: 0; padding: 0;">📱 App: <a href="#" style="color: #0066cc; text-decoration: none;">Gera World App for Android Users</a> | <a href="#" style="color: #0066cc; text-decoration: none;">Gera World App for Apple Users</a></p>
  <br>
  <p style="margin: 0; padding: 0;"><a href="https://www.gera.in" style="color: #0066cc; text-decoration: none;">www.gera.in</a></p>
  <p style="margin: 0; padding: 0;">Connect with us: <a href="#" style="color: #0066cc; text-decoration: none;">/ GeraDevelopments</a></p>
  <br>
  <p style="margin: 0; padding: 0; font-size: 11px; color: #666; line-height: 1.4;">
    <strong>Disclaimer:</strong> This email is intended to be delivered only to the named addressee(s) and may contain information that is confidential, proprietary, or attorney-client privileged. If this information is received by anyone other than the named addressees the recipient should immediately notify the sender by email. In no event shall this material be read, used, reproduced, stored or retained by anyone other than the named addressees, except with the express written consent of the sender or the named addressees. Please consider the environment before printing this e-mail.
  </p>
</div>`;

const EmailComposer = () => {
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [selectedSignature, setSelectedSignature] = useState<EmailSignatureItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Check for saved draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('emailDraft');
    if (savedDraft) {
      try {
        const { recipients, subject, body } = JSON.parse(savedDraft);
        setRecipients(recipients || []);
        setSubject(subject || '');
        setBody(body || '');
        
        if (recipients?.some((r: Recipient) => r.type === 'cc')) {
          setShowCc(true);
        }
        if (recipients?.some((r: Recipient) => r.type === 'bcc')) {
          setShowBcc(true);
        }
      } catch (e) {
        console.error('Error loading draft', e);
      }
    } else {
      // If no saved draft, automatically apply professional signature at the bottom
      setBody(`<br><br><br>${PROFESSIONAL_SIGNATURE_CONTENT}`);
    }
  }, []);

  const handleAddRecipient = (email: string, type: 'to' | 'cc' | 'bcc') => {
    if (!email) return;

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: `${email} is not a valid email address.`,
        variant: "destructive",
      });
      return;
    }

    const newRecipient: Recipient = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      type
    };

    setRecipients([...recipients, newRecipient]);
  };

  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file
    }));

    setAttachments([...attachments, ...newAttachments]);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

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

  const handleApplySignature = (signature: EmailSignatureItem) => {
    // If body already has content, append signature, otherwise just set it
    if (body && !body.includes(signature.content)) {
      setBody(`${body}<div><br></div>${signature.content}`);
    } else if (!body) {
      setBody(signature.content);
    }
    
    setSelectedSignature(signature);
    
    toast({
      title: "Signature Applied",
      description: `The "${signature.name}" signature has been applied.`,
    });
  };

  const handleSendEmail = () => {
    // Validation
    const toRecipients = recipients.filter(r => r.type === 'to');
    if (toRecipients.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please add at least one recipient in the To field.",
        variant: "destructive",
      });
      return;
    }

    if (!subject.trim()) {
      toast({
        title: "No Subject",
        description: "Please add a subject to your email.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would send the email here
    // For now, we'll just show a success toast
    toast({
      title: "Email Sent",
      description: `Your email was sent to ${toRecipients.map(r => r.email).join(', ')}`,
    });
    
    // Clear the form and localStorage after sending
    setRecipients([]);
    setSubject('');
    setBody('');
    setAttachments([]);
    localStorage.removeItem('emailDraft');
  };

  const handleSaveDraft = () => {
    localStorage.setItem('emailDraft', JSON.stringify({
      recipients,
      subject,
      body,
      timestamp: new Date().toISOString()
    }));

    toast({
      title: "Draft Saved",
      description: "Your email draft has been saved.",
    });
  };

  const getFilteredRecipients = (type: 'to' | 'cc' | 'bcc') => {
    return recipients.filter(r => r.type === type);
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
              <div className="w-[60px] text-sm font-medium">To:</div>
              <div className="flex-1 flex flex-wrap gap-2 min-h-10 items-center border rounded-md px-2">
                {getFilteredRecipients('to').map(recipient => (
                  <EmailRecipient 
                    key={recipient.id} 
                    recipient={recipient} 
                    onRemove={handleRemoveRecipient} 
                  />
                ))}
                <Input 
                  className="flex-1 border-none shadow-none focus-visible:ring-0 h-8 min-w-[180px]" 
                  placeholder="Enter email address"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const target = e.target as HTMLInputElement;
                      handleAddRecipient(target.value.trim(), 'to');
                      target.value = '';
                    }
                  }}
                />
              </div>
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
              <div className="flex items-center">
                <div className="w-[60px] text-sm font-medium">Cc:</div>
                <div className="flex-1 flex flex-wrap gap-2 min-h-10 items-center border rounded-md px-2">
                  {getFilteredRecipients('cc').map(recipient => (
                    <EmailRecipient 
                      key={recipient.id} 
                      recipient={recipient} 
                      onRemove={handleRemoveRecipient} 
                    />
                  ))}
                  <Input 
                    className="flex-1 border-none shadow-none focus-visible:ring-0 h-8 min-w-[180px]" 
                    placeholder="Enter email address"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const target = e.target as HTMLInputElement;
                        handleAddRecipient(target.value.trim(), 'cc');
                        target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* BCC Field */}
            {showBcc && (
              <div className="flex items-center">
                <div className="w-[60px] text-sm font-medium">Bcc:</div>
                <div className="flex-1 flex flex-wrap gap-2 min-h-10 items-center border rounded-md px-2">
                  {getFilteredRecipients('bcc').map(recipient => (
                    <EmailRecipient 
                      key={recipient.id} 
                      recipient={recipient} 
                      onRemove={handleRemoveRecipient} 
                    />
                  ))}
                  <Input 
                    className="flex-1 border-none shadow-none focus-visible:ring-0 h-8 min-w-[180px]" 
                    placeholder="Enter email address"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const target = e.target as HTMLInputElement;
                        handleAddRecipient(target.value.trim(), 'bcc');
                        target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Subject */}
          <div className="flex items-center">
            <div className="w-[60px] text-sm font-medium">Subject:</div>
            <Input 
              className="flex-1"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </div>

          {/* Templates and Signatures */}
          <div className="flex items-center gap-2">
            <EmailTemplates 
              onSelectTemplate={handleApplyTemplate}
              onSaveTemplate={handleSaveTemplate}
              currentSubject={subject}
              currentContent={body}
            />
            <EmailSignature 
              onSelectSignature={handleApplySignature}
            />
          </div>

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

      <CardFooter className="bg-email-background border-t border-email-border flex justify-between p-4">
        <div className="flex gap-2">
          <Button onClick={handleSendEmail}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach files to your email</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <input 
            ref={fileInputRef}
            type="file" 
            multiple 
            className="hidden" 
            onChange={handleFileUpload}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Calendar className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Schedule send (coming soon)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmailComposer;
