
import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Link, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';

interface ToolbarProps {
  onFormatText: (format: string) => void;
  onInsertList: (type: string) => void;
  onAlignText: (alignment: string) => void;
  onInsertLink: (url: string) => void;
}

export function Toolbar({ onFormatText, onInsertList, onAlignText, onInsertLink }: ToolbarProps) {
  const [linkUrl, setLinkUrl] = React.useState('');

  const handleLinkInsert = () => {
    if (linkUrl) {
      onInsertLink(linkUrl);
      setLinkUrl('');
    }
  };

  return (
    <div className="flex items-center gap-0.5 border-b p-1 bg-email-background">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onFormatText('bold')}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onFormatText('italic')}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onFormatText('underline')}
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onAlignText('Left')}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onAlignText('Center')}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onAlignText('Right')}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onInsertList('insertUnorderedList')}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onInsertList('insertOrderedList')}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Insert Link"
          >
            <Link className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Insert Link</h4>
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="col-span-3 h-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLinkInsert();
                  document.body.click(); // Close popover
                }
              }}
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  handleLinkInsert();
                  document.body.click(); // Close popover
                }}
              >
                Insert
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
