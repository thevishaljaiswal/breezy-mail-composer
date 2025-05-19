
import React, { useState, useEffect, useRef } from 'react';
import { Toolbar } from './Toolbar';

interface EmailEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
}

export function EmailEditor({ initialValue = '', onChange }: EmailEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [editorContent, setEditorContent] = useState(initialValue);

  // Initialize editor content properly
  useEffect(() => {
    if (editorRef.current && initialValue) {
      editorRef.current.innerHTML = initialValue;
      setEditorContent(initialValue);
    }
  }, [initialValue]);

  const handleEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setEditorContent(content);
      onChange(content);
    }
  };

  // Ensure focus stays in editor after commands
  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleEditorChange();
    focusEditor();
  };

  const handleFormatText = (format: string) => {
    execCommand(format);
  };

  const handleInsertList = (type: string) => {
    execCommand(type);
  };

  const handleAlignText = (alignment: string) => {
    execCommand('justify' + alignment);
  };

  const handleInsertLink = (url: string) => {
    if (url) {
      execCommand('createLink', url);
    }
  };

  return (
    <div className="flex flex-col border rounded-md">
      <Toolbar 
        onFormatText={handleFormatText}
        onInsertList={handleInsertList}
        onAlignText={handleAlignText}
        onInsertLink={handleInsertLink}
      />

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
        dangerouslySetInnerHTML={{ __html: initialValue }}
      />
    </div>
  );
}
