
import React, { useState, useEffect, useRef } from 'react';
import { Toolbar } from './Toolbar';

interface EmailEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
}

export function EmailEditor({ initialValue = '', onChange }: EmailEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Initialize editor content on mount and when initialValue changes
  useEffect(() => {
    if (editorRef.current) {
      // Only set content if it's different, to avoid cursor position issues
      if (editorRef.current.innerHTML !== initialValue) {
        editorRef.current.innerHTML = initialValue;
        // Trigger onChange to ensure state is in sync
        onChange(initialValue);
        
        // Position cursor at the beginning of the editor
        if (initialValue && editorRef.current) {
          const range = document.createRange();
          const selection = window.getSelection();
          
          // Find the first text node or create one if none exists
          let firstNode = editorRef.current.firstChild;
          if (!firstNode || firstNode.nodeType !== Node.TEXT_NODE) {
            // Insert a line break at the beginning to position cursor above signature
            const br = document.createElement('br');
            editorRef.current.insertBefore(br, editorRef.current.firstChild);
            range.setStartBefore(br);
            range.setEndBefore(br);
          } else {
            range.setStart(firstNode, 0);
            range.setEnd(firstNode, 0);
          }
          
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
    }
  }, [initialValue, onChange]);

  const handleEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
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

  const handleFontChange = (fontFamily: string) => {
    execCommand('fontName', fontFamily);
  };

  const handleFontSizeChange = (fontSize: string) => {
    execCommand('fontSize', fontSize);
  };

  return (
    <div className="flex flex-col border rounded-md">
      <Toolbar 
        onFormatText={handleFormatText}
        onInsertList={handleInsertList}
        onAlignText={handleAlignText}
        onInsertLink={handleInsertLink}
        onFontChange={handleFontChange}
        onFontSizeChange={handleFontSizeChange}
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
      />
    </div>
  );
}
