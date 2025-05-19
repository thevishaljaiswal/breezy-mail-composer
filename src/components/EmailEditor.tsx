
import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Text, TextQuote, List, ListOrdered, Link, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';

interface EmailEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
}

export function EmailEditor({ initialValue = '', onChange }: EmailEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  const handleEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleEditorChange();
    editorRef.current?.focus();
  };

  const formatText = (format: string) => {
    execCommand(format);
  };

  const createLink = (url: string) => {
    if (url) {
      execCommand('createLink', url);
    }
  };

  return (
    <div className="flex flex-col border rounded-md">
      <div className="flex items-center gap-0.5 border-b p-1 bg-email-background">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => formatText('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => formatText('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => formatText('underline')}
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand('insertUnorderedList')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand('insertOrderedList')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand('formatBlock', '<blockquote>')}
        >
          <TextQuote className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Link className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Insert Link</h4>
              <Input
                id="link-url"
                placeholder="https://example.com"
                className="col-span-3 h-8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    createLink((e.target as HTMLInputElement).value);
                    document.body.click(); // Close popover
                  }
                }}
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => {
                    const url = document.getElementById('link-url') as HTMLInputElement;
                    createLink(url.value);
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

      <div
        ref={editorRef}
        contentEditable
        className={`min-h-[300px] p-3 focus:outline-none ${
          isFocused ? 'ring-2 ring-email-primary ring-opacity-50' : ''
        }`}
        onInput={handleEditorChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        suppressContentEditableWarning
      />
    </div>
  );
}
