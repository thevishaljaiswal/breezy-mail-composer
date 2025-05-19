
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Save, Search } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
}

interface EmailTemplatesProps {
  onSelectTemplate: (template: EmailTemplate) => void;
  onSaveTemplate: (template: Partial<EmailTemplate>) => void;
  currentSubject: string;
  currentContent: string;
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  // Business Category
  {
    id: '1',
    name: 'Meeting Request',
    subject: 'Request for Meeting: [Topic]',
    content: '<p>Hello,</p><p>I hope this email finds you well. I would like to request a meeting to discuss [Topic].</p><p>Could we schedule some time on [Date] at [Time]?</p><p>Best regards,</p>',
    category: 'Business'
  },
  {
    id: '2',
    name: 'Thank You',
    subject: 'Thank You for Your Time',
    content: '<p>Dear [Name],</p><p>I wanted to express my sincere thanks for your time and consideration during our recent discussion.</p><p>I appreciate the insights you shared, and I look forward to our continued collaboration.</p><p>Best wishes,</p>',
    category: 'Business'
  },
  {
    id: '3',
    name: 'Project Update',
    subject: 'Project Update: [Project Name]',
    content: '<p>Hi Team,</p><p>Here is an update on the current status of [Project Name]:</p><ul><li>Task 1: [Status]</li><li>Task 2: [Status]</li><li>Task 3: [Status]</li></ul><p>If you have any questions or concerns, please let me know.</p><p>Regards,</p>',
    category: 'Business'
  },
  {
    id: '4',
    name: 'Weekly Status Report',
    subject: 'Weekly Status Report - [Week]',
    content: '<p>Dear Team,</p><p>Here is the weekly status report for [Week]:</p><h3>Accomplishments:</h3><ul><li>[Accomplishment 1]</li><li>[Accomplishment 2]</li></ul><h3>Upcoming Tasks:</h3><ul><li>[Task 1]</li><li>[Task 2]</li></ul><h3>Blockers:</h3><ul><li>[Blocker 1]</li></ul><p>Please let me know if you have any questions.</p><p>Regards,</p>',
    category: 'Business'
  },
  {
    id: '5',
    name: 'Request for Information',
    subject: 'Request for Information: [Topic]',
    content: '<p>Hello [Name],</p><p>I hope this email finds you well. I am writing to request information regarding [Topic/Subject].</p><p>Specifically, I would like to know:</p><ol><li>[Question 1]</li><li>[Question 2]</li><li>[Question 3]</li></ol><p>Thank you for your assistance with this matter.</p><p>Best regards,</p>',
    category: 'Business'
  },
  {
    id: '6',
    name: 'Business Proposal',
    subject: 'Business Proposal - [Company Name]',
    content: '<p>Dear [Name],</p><p>I hope this email finds you well. I am pleased to submit the attached business proposal for your consideration.</p><p>Our proposal outlines how [Your Company] can help [Their Company] achieve [specific goal or outcome].</p><p>I would welcome the opportunity to discuss this proposal in more detail. Please let me know when would be a convenient time for a call.</p><p>Thank you for your consideration.</p><p>Best regards,</p>',
    category: 'Business'
  },
  {
    id: '7',
    name: 'Invoice Reminder',
    subject: 'Reminder: Invoice #[Number] Due',
    content: '<p>Dear [Client Name],</p><p>I hope you are doing well. This is a friendly reminder that invoice #[Number] for $[Amount] was due on [Due Date].</p><p>If you have already made the payment, please disregard this reminder. If not, I would appreciate it if you could process the payment at your earliest convenience.</p><p>Please let me know if you have any questions or if there's anything I can help with.</p><p>Thank you for your business.</p><p>Best regards,</p>',
    category: 'Business'
  },
  
  // Personal Category
  {
    id: '8',
    name: 'Birthday Wishes',
    subject: 'Happy Birthday!',
    content: '<p>Dear [Name],</p><p>Happy Birthday! Wishing you a fantastic day filled with joy and celebration.</p><p>May the year ahead bring you success, happiness, and all that your heart desires.</p><p>Have a wonderful day!</p><p>Best wishes,</p>',
    category: 'Personal'
  },
  {
    id: '9',
    name: 'Congratulations',
    subject: 'Congratulations on [Achievement]!',
    content: '<p>Dear [Name],</p><p>Congratulations on [Achievement]! Your hard work and dedication have truly paid off.</p><p>I am so proud of what you have accomplished and excited to see what you'll achieve next.</p><p>Best wishes for continued success!</p><p>Warm regards,</p>',
    category: 'Personal'
  },
  {
    id: '10',
    name: 'Thank You (Personal)',
    subject: 'Thank You for [Occasion]',
    content: '<p>Dear [Name],</p><p>I wanted to take a moment to express my sincere gratitude for [what you are thankful for].</p><p>Your kindness and generosity mean the world to me, and I am truly fortunate to have you in my life.</p><p>Thank you again for everything.</p><p>With appreciation,</p>',
    category: 'Personal'
  },
  {
    id: '11',
    name: 'Invitation',
    subject: 'Invitation to [Event]',
    content: '<p>Dear [Name],</p><p>I hope this email finds you well. I am writing to invite you to [Event] on [Date] at [Time] at [Location].</p><p>[Additional details about the event]</p><p>Please let me know if you can attend by [RSVP Date].</p><p>Looking forward to seeing you!</p><p>Best regards,</p>',
    category: 'Personal'
  },
  
  // Academic Category
  {
    id: '12',
    name: 'Research Collaboration',
    subject: 'Potential Research Collaboration',
    content: '<p>Dear Professor [Name],</p><p>I hope this email finds you well. I am [Your Name], a [Your Position] at [Your Institution].</p><p>I have been following your research on [Research Topic] and am particularly interested in your work on [Specific Aspect].</p><p>I am currently working on [Your Research] and believe there may be potential for collaboration between our research interests.</p><p>Would you be open to discussing possible collaboration opportunities? I would be happy to share more details about my work.</p><p>Thank you for your consideration.</p><p>Best regards,</p>',
    category: 'Academic'
  },
  {
    id: '13',
    name: 'Assignment Submission',
    subject: 'Submission: [Assignment Name]',
    content: '<p>Dear Professor [Name],</p><p>I hope this email finds you well. I am writing to submit my assignment for [Course Name].</p><p>Please find attached my completed [Assignment Name]. I have addressed all the requirements as outlined in the assignment guidelines.</p><p>If you have any questions or need any clarification, please do not hesitate to contact me.</p><p>Thank you for your guidance throughout this course.</p><p>Best regards,</p>',
    category: 'Academic'
  },
  {
    id: '14',
    name: 'Request for Extension',
    subject: 'Request for Extension: [Assignment Name]',
    content: '<p>Dear Professor [Name],</p><p>I hope this email finds you well. I am writing to request an extension for the [Assignment Name] that is due on [Due Date].</p><p>Due to [reason for extension request], I am unable to complete the assignment by the original deadline. I would greatly appreciate if you could grant me an extension until [Requested Date].</p><p>I understand the importance of timely submissions and assure you that this is an exceptional circumstance. I will ensure that all future assignments are submitted on time.</p><p>Thank you for your consideration.</p><p>Sincerely,</p>',
    category: 'Academic'
  },
  
  // Customer Service Category
  {
    id: '15',
    name: 'Product Inquiry',
    subject: 'Inquiry about [Product Name]',
    content: '<p>Hello,</p><p>I am interested in purchasing [Product Name] and have a few questions before making a decision.</p><ol><li>[Question 1]</li><li>[Question 2]</li><li>[Question 3]</li></ol><p>Thank you for your assistance.</p><p>Best regards,</p>',
    category: 'Customer Service'
  },
  {
    id: '16',
    name: 'Order Status',
    subject: 'Status of Order #[Order Number]',
    content: '<p>Hello,</p><p>I placed an order (Order #[Order Number]) on [Order Date] and I would like to know its current status.</p><p>Could you please provide me with an update on when I can expect to receive my order?</p><p>Thank you for your assistance.</p><p>Best regards,</p>',
    category: 'Customer Service'
  },
  {
    id: '17',
    name: 'Customer Feedback',
    subject: 'Feedback on [Product/Service]',
    content: '<p>Hello,</p><p>I recently purchased/used [Product/Service] and wanted to share my feedback.</p><p>Things I liked:</p><ul><li>[Positive Point 1]</li><li>[Positive Point 2]</li></ul><p>Areas for improvement:</p><ul><li>[Improvement Point 1]</li><li>[Improvement Point 2]</li></ul><p>Overall, my experience was [overall impression].</p><p>Thank you for taking the time to consider my feedback.</p><p>Best regards,</p>',
    category: 'Customer Service'
  },
  {
    id: '18',
    name: 'Return Request',
    subject: 'Return Request for Order #[Order Number]',
    content: '<p>Hello,</p><p>I would like to request a return for [Product] from Order #[Order Number] placed on [Order Date].</p><p>Reason for return: [Return Reason]</p><p>Please let me know the return process and any return authorization number I may need.</p><p>Thank you for your assistance.</p><p>Best regards,</p>',
    category: 'Customer Service'
  },
  {
    id: '19',
    name: 'Complaint',
    subject: 'Complaint regarding [Issue]',
    content: '<p>Hello,</p><p>I am writing to express my dissatisfaction with [Product/Service/Issue].</p><p>On [Date], I experienced [describe the issue in detail].</p><p>This has resulted in [consequences of the issue].</p><p>To resolve this matter, I would appreciate if you could [requested resolution].</p><p>I look forward to your prompt response to this matter.</p><p>Thank you for your attention.</p><p>Best regards,</p>',
    category: 'Customer Service'
  },
  
  // Job Application Category
  {
    id: '20',
    name: 'Job Application',
    subject: 'Application for [Position]',
    content: '<p>Dear Hiring Manager,</p><p>I am writing to apply for the [Position] role advertised on [Where You Saw the Job].</p><p>With [Number] years of experience in [Relevant Field] and expertise in [Key Skills], I believe I am a strong candidate for this position.</p><p>In my current role as [Current Position] at [Current Company], I have [Key Achievement].</p><p>I am particularly drawn to [Company Name] because [Reason for Interest in Company].</p><p>Attached is my resume for your review. I would welcome the opportunity to discuss how my background and skills would be a good match for this position.</p><p>Thank you for your consideration. I look forward to hearing from you.</p><p>Best regards,</p>',
    category: 'Job Application'
  },
  {
    id: '21',
    name: 'Interview Follow-Up',
    subject: 'Thank You for the Interview - [Position]',
    content: '<p>Dear [Interviewer\'s Name],</p><p>Thank you for taking the time to interview me yesterday for the [Position] position. I enjoyed our conversation and learning more about the role and the company.</p><p>Our discussion about [Specific Topic from Interview] further strengthened my interest in joining your team. My experience in [Relevant Experience] would allow me to contribute effectively to your [Department/Team].</p><p>If you need any additional information, please don\'t hesitate to contact me.</p><p>I look forward to hearing from you about the next steps in the process.</p><p>Best regards,</p>',
    category: 'Job Application'
  },
  {
    id: '22',
    name: 'Resignation Letter',
    subject: 'Resignation - [Your Name]',
    content: '<p>Dear [Manager\'s Name],</p><p>I am writing to inform you of my decision to resign from my position as [Your Position] at [Company Name], effective [Last Working Day, typically two weeks from the date].</p><p>I have appreciated the opportunities for growth and development that you have provided during my time here. I am grateful for the support and guidance from you and the team.</p><p>I will do everything possible to ensure a smooth transition before my departure. This includes [Specific Actions You Will Take].</p><p>Thank you for your understanding. I wish you and the company continued success.</p><p>Sincerely,</p>',
    category: 'Job Application'
  },
  
  // Networking Category
  {
    id: '23',
    name: 'Introduction',
    subject: 'Introduction - [Your Name]',
    content: '<p>Dear [Name],</p><p>I hope this email finds you well. My name is [Your Name], and I [how you know about them or got their contact].</p><p>I am reaching out because [reason for contact].</p><p>I would appreciate the opportunity to [request - e.g., have a brief call, meet for coffee] to discuss [topic] further.</p><p>Thank you for your time, and I look forward to your response.</p><p>Best regards,</p>',
    category: 'Networking'
  },
  {
    id: '24',
    name: 'Reconnection',
    subject: 'Reconnecting - [Your Name]',
    content: '<p>Dear [Name],</p><p>I hope this email finds you well. It\'s been [time period] since we last [how you last connected], and I wanted to reach out to reconnect.</p><p>[Update on what you\'ve been doing]</p><p>I would love to hear what you\'ve been up to and perhaps catch up over [coffee/lunch/call] sometime.</p><p>Looking forward to hearing from you.</p><p>Best regards,</p>',
    category: 'Networking'
  },
  {
    id: '25',
    name: 'LinkedIn Connection',
    subject: 'Connecting on LinkedIn',
    content: '<p>Dear [Name],</p><p>I hope this email finds you well. I recently came across your profile on LinkedIn and was impressed by your background in [their field/expertise].</p><p>I [reason for wanting to connect - e.g., am also in the same industry, share similar interests].</p><p>I would appreciate the opportunity to connect on LinkedIn to learn from your experiences and potentially share insights in our field.</p><p>Thank you for considering my request.</p><p>Best regards,</p>',
    category: 'Networking'
  },
  
  // Event Planning Category
  {
    id: '26',
    name: 'Event Announcement',
    subject: '[Event Name] - [Date]',
    content: '<p>Dear [Name/All],</p><p>I am pleased to announce [Event Name] taking place on [Date] at [Time] at [Location].</p><p>Event Details:</p><ul><li>Description: [Brief description of the event]</li><li>Schedule: [Agenda/Timeline]</li><li>Cost: [Price, if applicable]</li></ul><p>To [RSVP/register], please [instructions].</p><p>We look forward to your participation!</p><p>Best regards,</p>',
    category: 'Event Planning'
  },
  {
    id: '27',
    name: 'RSVP Reminder',
    subject: 'RSVP Reminder: [Event Name] - [Date]',
    content: '<p>Dear [Name],</p><p>This is a friendly reminder that the RSVP deadline for [Event Name] is approaching on [RSVP Deadline].</p><p>The event will take place on [Event Date] at [Time] at [Location].</p><p>We would greatly appreciate your response by [RSVP Deadline] to help us with planning.</p><p>To RSVP, please [instructions].</p><p>We hope you can join us!</p><p>Best regards,</p>',
    category: 'Event Planning'
  },
  {
    id: '28',
    name: 'Post-Event Thank You',
    subject: 'Thank You for Attending [Event Name]',
    content: '<p>Dear [Name],</p><p>Thank you for attending [Event Name] on [Date]. Your presence helped make the event a success!</p><p>We hope you enjoyed the [specific aspects of the event].</p><p>[Any follow-up information, such as photos, survey, or future events]</p><p>We appreciate your support and look forward to seeing you at future events.</p><p>Best regards,</p>',
    category: 'Event Planning'
  },
  
  // Real Estate Category
  {
    id: '29',
    name: 'Property Inquiry',
    subject: 'Inquiry about [Property Address/Listing #]',
    content: '<p>Dear [Agent Name],</p><p>I am interested in the property listed at [Property Address] (Listing #[Listing Number]).</p><p>I would like to request more information about:</p><ul><li>[Question 1]</li><li>[Question 2]</li><li>[Question 3]</li></ul><p>Additionally, I would like to schedule a viewing on [Preferred Date and Time] if possible.</p><p>Thank you for your assistance.</p><p>Best regards,</p>',
    category: 'Real Estate'
  },
  {
    id: '30',
    name: 'Rental Application Follow-Up',
    subject: 'Follow-Up on Rental Application for [Property Address]',
    content: '<p>Dear [Landlord/Property Manager],</p><p>I hope this email finds you well. I am writing to follow up on my rental application for the property at [Property Address] submitted on [Application Date].</p><p>I am very interested in this property and would appreciate an update on the status of my application.</p><p>If you need any additional information from me, please let me know.</p><p>Thank you for your time and consideration.</p><p>Best regards,</p>',
    category: 'Real Estate'
  }
];

const CATEGORIES = [
  'All',
  'Business',
  'Personal',
  'Academic',
  'Customer Service',
  'Job Application',
  'Networking',
  'Event Planning',
  'Real Estate'
];

export function EmailTemplates({ onSelectTemplate, onSaveTemplate, currentSubject, currentContent }: EmailTemplatesProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES);
  const [templateName, setTemplateName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
      content: currentContent,
      category: 'Personal' // Default category for user-created templates
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    
    // Save to localStorage - only save user-created templates
    const existingTemplates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
    localStorage.setItem('emailTemplates', JSON.stringify([...existingTemplates, newTemplate]));
    
    onSaveTemplate(newTemplate);
    setTemplateName('');
  };

  const filteredTemplates = templates.filter(template => {
    // Filter by category
    if (selectedCategory !== 'All' && template.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      return (
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });

  const userTemplates = templates.filter(template => 
    !DEFAULT_TEMPLATES.some(defaultTemplate => defaultTemplate.id === template.id)
  );

  return (
    <div className="flex">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" type="button">
            <FileText className="mr-2 h-4 w-4" />
            Templates
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0">
          <div className="p-4 pb-0">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Choose Template</h4>
              
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All Templates</TabsTrigger>
              <TabsTrigger value="user" className="flex-1">My Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <ScrollArea className="h-72 px-4">
                <div className="space-y-1 py-2">
                  {filteredTemplates.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      No templates match your search
                    </p>
                  ) : (
                    filteredTemplates.map((template) => (
                      <DropdownMenu key={template.id}>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost"
                            className="w-full justify-between text-left text-sm group"
                          >
                            <span className="truncate">{template.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">{template.category}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                          <DropdownMenuLabel>
                            {template.name}
                          </DropdownMenuLabel>
                          <DropdownMenuItem className="text-xs text-muted-foreground">
                            {template.subject}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onSelectTemplate(template)}>
                            Use this template
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="user" className="mt-0">
              <ScrollArea className="h-72 px-4">
                <div className="space-y-1 py-2">
                  {userTemplates.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      You haven't saved any templates yet
                    </p>
                  ) : (
                    userTemplates.map((template) => (
                      <Button 
                        key={template.id}
                        variant="ghost"
                        className="w-full justify-start text-left text-sm"
                        onClick={() => onSelectTemplate(template)}
                      >
                        {template.name}
                      </Button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
          
          <div className="p-4 border-t">
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
        </PopoverContent>
      </Popover>
    </div>
  );
}
