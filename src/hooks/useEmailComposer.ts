
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { validateEmail } from '@/lib/utils';

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

export interface EmailData {
  recipients: Recipient[];
  subject: string;
  body: string;
  attachments: Attachment[];
}

export const useEmailComposer = () => {
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [selectedSignature, setSelectedSignature] = useState<any | null>(null);
  const { toast } = useToast();

  // Check for saved draft on hook initialization
  useEffect(() => {
    loadSavedDraft();
  }, []);

  const loadSavedDraft = () => {
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
    }
  };

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

  const handleAddAttachments = (files: FileList) => {
    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file
    }));

    setAttachments([...attachments, ...newAttachments]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const handleApplySignature = (signature: any) => {
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

  const handleSendEmail = () => {
    // Validation
    const toRecipients = recipients.filter(r => r.type === 'to');
    if (toRecipients.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please add at least one recipient in the To field.",
        variant: "destructive",
      });
      return false;
    }

    if (!subject.trim()) {
      toast({
        title: "No Subject",
        description: "Please add a subject to your email.",
        variant: "destructive",
      });
      return false;
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
    
    return true;
  };

  const getFilteredRecipients = (type: 'to' | 'cc' | 'bcc') => {
    return recipients.filter(r => r.type === type);
  };

  return {
    // State
    showCc,
    showBcc,
    subject,
    body,
    recipients,
    attachments,
    selectedSignature,
    
    // State updaters
    setShowCc,
    setShowBcc,
    setSubject,
    setBody,
    
    // Actions
    handleAddRecipient,
    handleRemoveRecipient,
    handleAddAttachments,
    handleRemoveAttachment,
    handleApplySignature,
    handleSaveDraft,
    handleSendEmail,
    getFilteredRecipients
  };
};
