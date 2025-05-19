
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { FileText, Save } from 'lucide-react';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

interface EmailTemplatesProps {
  onSelectTemplate: (template: EmailTemplate) => void;
  onSaveTemplate: (template: Partial<EmailTemplate>) => void;
  currentSubject: string;
  currentContent: string;
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    name: 'Meeting Request',
    subject: 'Request for Meeting: [Topic]',
    content: '<p>Hello,</p><p>I hope this email finds you well. I would like to request a meeting to discuss [Topic].</p><p>Could we schedule some time on [Date] at [Time]?</p><p>Best regards,</p>'
  },
  {
    id: '2',
    name: 'Thank You',
    subject: 'Thank You for Your Time',
    content: '<p>Dear [Name],</p><p>I wanted to express my sincere thanks for your time and consideration during our recent discussion.</p><p>I appreciate the insights you shared, and I look forward to our continued collaboration.</p><p>Best wishes,</p>'
  },
  {
    id: '3',
    name: 'Project Update',
    subject: 'Project Update: [Project Name]',
    content: '<p>Hi Team,</p><p>Here is an update on the current status of [Project Name]:</p><ul><li>Task 1: [Status]</li><li>Task 2: [Status]</li><li>Task 3: [Status]</li></ul><p>If you have any questions or concerns, please let me know.</p><p>Regards,</p>'
  }
];

export function EmailTemplates({ onSelectTemplate, onSaveTemplate, currentSubject, currentContent }: EmailTemplatesProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES);
  const [templateName, setTemplateName] = useState('');

  // Try to load templates from localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem('emailTemplates');
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        setTemplates([...DEFAULT_TEMPLATES, ...parsed]);
      } catch (e) {
        console.error('Error parsing saved templates', e);
      }
    }
  }, []);

  const saveCurrentAsTemplate = () => {
    if (!templateName.trim()) return;
    
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: templateName,
      subject: currentSubject,
      content: currentContent
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    
    // Save to localStorage
    const existingTemplates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
    localStorage.setItem('emailTemplates', JSON.stringify([...existingTemplates, newTemplate]));
    
    onSaveTemplate(newTemplate);
    setTemplateName('');
  };

  return (
    <div className="flex">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" type="button">
            <FileText className="mr-2 h-4 w-4" />
            Templates
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Select Template</h4>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {templates.map((template) => (
                <Button 
                  key={template.id}
                  variant="ghost"
                  className="w-full justify-start text-left text-sm"
                  onClick={() => onSelectTemplate(template)}
                >
                  {template.name}
                </Button>
              ))}
              {templates.length === 0 && (
                <p className="text-sm text-muted-foreground">No templates saved</p>
              )}
            </div>
            
            <div className="pt-2 border-t">
              <h4 className="font-medium text-sm mb-2">Save as Template</h4>
              <div className="flex gap-2">
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template name"
                  className="h-8"
                />
                <Button size="sm" onClick={saveCurrentAsTemplate}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
