
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Send, Save, Calendar } from 'lucide-react';
import { AttachmentButton } from "./AttachmentButton";

interface EmailFooterProps {
  onSend: () => void;
  onSaveDraft: () => void;
  onAttach: (files: FileList) => void;
}

export const EmailFooter = ({
  onSend,
  onSaveDraft,
  onAttach
}: EmailFooterProps) => {
  return (
    <div className="flex justify-between p-4 bg-email-background border-t border-email-border">
      <div className="flex gap-2">
        <Button onClick={onSend}>
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>

        <AttachmentButton onAttach={onAttach} />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onSaveDraft}>
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
    </div>
  );
};
