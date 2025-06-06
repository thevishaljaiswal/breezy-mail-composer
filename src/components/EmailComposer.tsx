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
  <p style="margin: 0; padding: 0; margin-bottom: 10px;">Connect with us:</p>
  <div style="margin: 0; padding: 0; display: flex; gap: 10px; align-items: center;">
    <a href="https://ind01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.facebook.com%2Fpages%2FGera-Developments-Premium-Residential-and-Commercial-Projects%2F115028218540020%3Fcreated&data=05%7C02%7Cvishal.jaiswal%40gera.in%7C38d15c51da5f4f2396a508dda4fbdfb4%7Cde21737fd6b1425fac2167db0eec5c98%7C0%7C0%7C638848123869184742%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=WaA2XJNLbYmoQmAdbsREhxOzS0cmFYwmbZiXVeElsWA%3D&reserved=0" target="_blank" style="text-decoration: none;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </a>
    <a href="https://ind01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Fgera-developments-pvt.-ltd.&data=05%7C02%7Cvishal.jaiswal%40gera.in%7C38d15c51da5f4f2396a508dda4fbdfb4%7Cde21737fd6b1425fac2167db0eec5c98%7C0%7C0%7C638848123869200842%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=au7EEpVfVNoCMgraL2vTe63Oms7Ceoi1zoXITAcdyDA%3D&reserved=0" target="_blank" style="text-decoration: none;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#0077b5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    </a>
    <a href="https://ind01.safelinks.protection.outlook.com/?url=https%3A%2F%2Ftwitter.com%2Fgeradevelopment&data=05%7C02%7Cvishal.jaiswal%40gera.in%7C38d15c51da5f4f2396a508dda4fbdfb4%7Cde21737fd6b1425fac2167db0eec5c98%7C0%7C0%7C638848123869214920%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=0JGEOL%2FZSjfFA8S1OIkGGxFZ8ygK%2BN2cDgENvo1bA%2Fs%3D&reserved=0" target="_blank" style="text-decoration: none;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </a>
    <a href="https://ind01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.instagram.com%2Fgeradevelopments%2F&data=05%7C02%7Cvishal.jaiswal%40gera.in%7C38d15c51da5f4f2396a508dda4fbdfb4%7Cde21737fd6b1425fac2167db0eec5c98%7C0%7C0%7C638848123869228423%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=%2Fdv%2Fd5Awfpo7CZ0mmIA7c4I1CY8yqHUihSc0vLOreDQ%3D&reserved=0" target="_blank" style="text-decoration: none;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#E4405F">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919 1.266.058 1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.28.073-1.689.073-4.948 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    </a>
  </div>
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
