
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Paperclip } from 'lucide-react';

interface AttachmentButtonProps {
  onAttach: (files: FileList) => void;
}

export const AttachmentButton = ({ onAttach }: AttachmentButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAttach(files);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  return (
    <>
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
        onChange={handleFileChange}
      />
    </>
  );
};
