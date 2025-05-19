
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  Send,
  Paperclip,
  Save,
  Calendar,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  Link
} from 'lucide-react';
import { validateEmail } from '@/lib/utils';
import { EmailRecipient } from '@/components/EmailRecipient';
import { Toolbar } from '@/components/Toolbar';
import { AttachmentList } from '@/components/AttachmentList';

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

const EmailComposer = () => {
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
        <CardTitle className="text-xl text-email-primary font-medium">New Message</CardTitle>
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

          {/* Toolbar */}
          <Toolbar />

          {/* Body */}
          <Textarea 
            className="min-h-[300px] resize-y"
            placeholder="Compose your email..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
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
