import { HelpCircle } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AVAILABLE_PLACEHOLDERS } from '@/lib/placeholders';

export function PlaceholderHelper() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2">
          <HelpCircle className="h-4 w-4" />
          Variables
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Available Variables</h4>
          <p className="text-xs text-muted-foreground">
            Use these variables in your subject or content. They will be automatically replaced with customer data.
          </p>
          <div className="space-y-1 mt-3">
            {AVAILABLE_PLACEHOLDERS.map((placeholder) => (
              <div key={placeholder.key} className="flex items-start gap-2 text-xs">
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono whitespace-nowrap">
                  {placeholder.key}
                </code>
                <span className="text-muted-foreground">{placeholder.description}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              <strong>Example:</strong> "Hello {'{{firstName}}'}, welcome to {'{{project}}'}"
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
