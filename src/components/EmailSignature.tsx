
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Signature, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmailEditor } from './EmailEditor';
import { Input } from "@/components/ui/input";

export interface EmailSignatureItem {
  id: string;
  name: string;
  content: string;
}

interface EmailSignatureProps {
  onSelectSignature: (signature: EmailSignatureItem) => void;
}

const DEFAULT_SIGNATURE: EmailSignatureItem = {
  id: 'default',
  name: 'Default',
  content: '<p>Best regards,</p><p><strong>Your Name</strong></p><p>Position | Company</p><p>Phone: (123) 456-7890</p>'
};

export function EmailSignature({ onSelectSignature }: EmailSignatureProps) {
  const [signatures, setSignatures] = useState<EmailSignatureItem[]>([DEFAULT_SIGNATURE]);
  const [editingSignature, setEditingSignature] = useState<EmailSignatureItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [signatureContent, setSignatureContent] = useState('');

  // Load signatures from localStorage
  useEffect(() => {
    const savedSignatures = localStorage.getItem('emailSignatures');
    if (savedSignatures) {
      try {
        const parsed = JSON.parse(savedSignatures);
        setSignatures([DEFAULT_SIGNATURE, ...parsed]);
      } catch (e) {
        console.error('Error parsing saved signatures', e);
      }
    }
  }, []);

  const handleSaveSignature = () => {
    if (!signatureName.trim() || !signatureContent.trim()) return;

    const newSignature: EmailSignatureItem = {
      id: editingSignature?.id || Date.now().toString(),
      name: signatureName,
      content: signatureContent
    };

    let updatedSignatures: EmailSignatureItem[];
    if (editingSignature) {
      updatedSignatures = signatures.map(sig => 
        sig.id === editingSignature.id ? newSignature : sig
      );
    } else {
      updatedSignatures = [...signatures, newSignature];
    }

    setSignatures(updatedSignatures);
    
    // Save to localStorage (excluding default signature)
    const toSave = updatedSignatures.filter(sig => sig.id !== 'default');
    localStorage.setItem('emailSignatures', JSON.stringify(toSave));
    
    setIsDialogOpen(false);
    setEditingSignature(null);
    setSignatureName('');
    setSignatureContent('');
  };

  const startEditSignature = (signature: EmailSignatureItem) => {
    setEditingSignature(signature);
    setSignatureName(signature.name);
    setSignatureContent(signature.content);
    setIsDialogOpen(true);
  };

  const startNewSignature = () => {
    setEditingSignature(null);
    setSignatureName('');
    setSignatureContent('');
    setIsDialogOpen(true);
  };

  return (
    <div className="flex">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" type="button">
            <Signature className="mr-2 h-4 w-4" />
            Signature
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Select Signature</h4>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {signatures.map((sig) => (
                <div key={sig.id} className="flex items-center justify-between">
                  <Button 
                    variant="ghost"
                    className="flex-1 justify-start text-left text-sm"
                    onClick={() => onSelectSignature(sig)}
                  >
                    {sig.name}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => startEditSignature(sig)}
                    className="h-8 w-8 p-0"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between pt-2 border-t">
              <Button variant="outline" size="sm" onClick={startNewSignature}>
                Create New Signature
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingSignature ? 'Edit Signature' : 'Create New Signature'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="sig-name">
                Signature Name
              </label>
              <Input
                id="sig-name"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="e.g., Work Signature"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Signature Content</label>
              <EmailEditor
                initialValue={signatureContent}
                onChange={setSignatureContent}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSignature}>
                Save Signature
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
