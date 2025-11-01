import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from 'lucide-react';

// Sample customer list - in a real app, this would come from a database
const SAMPLE_CUSTOMERS = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: '3', name: 'Robert Johnson', email: 'robert.j@example.com' },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com' },
  { id: '5', name: 'Michael Brown', email: 'michael.b@example.com' },
  { id: '6', name: 'Sarah Wilson', email: 'sarah.wilson@example.com' },
  { id: '7', name: 'David Martinez', email: 'david.m@example.com' },
  { id: '8', name: 'Lisa Anderson', email: 'lisa.anderson@example.com' },
  { id: '9', name: 'James Taylor', email: 'james.taylor@example.com' },
  { id: '10', name: 'Jennifer White', email: 'jennifer.w@example.com' },
];

interface MultiRecipientSelectorProps {
  onAddRecipients: (emails: string[]) => void;
  recipientType: 'to' | 'cc' | 'bcc';
}

export const MultiRecipientSelector = ({ onAddRecipients, recipientType }: MultiRecipientSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = SAMPLE_CUSTOMERS.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleEmail = (email: string) => {
    setSelectedEmails(prev =>
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === filteredCustomers.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(filteredCustomers.map(c => c.email));
    }
  };

  const handleAddSelected = () => {
    if (selectedEmails.length > 0) {
      onAddRecipients(selectedEmails);
      setSelectedEmails([]);
      setSearchQuery('');
      setOpen(false);
    }
  };

  const getButtonLabel = () => {
    switch (recipientType) {
      case 'to': return 'Add Multiple To';
      case 'cc': return 'Add Multiple Cc';
      case 'bcc': return 'Add Multiple Bcc';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2">
          <Users className="h-4 w-4" />
          {getButtonLabel()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle>Select Multiple Recipients</DialogTitle>
          <DialogDescription>
            Choose customers to add to the {recipientType.toUpperCase()} field
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedEmails.length} selected
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedEmails.length === filteredCustomers.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <ScrollArea className="h-[300px] border rounded-md p-4">
            <div className="space-y-3">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={customer.id}
                    checked={selectedEmails.includes(customer.email)}
                    onCheckedChange={() => handleToggleEmail(customer.email)}
                  />
                  <label
                    htmlFor={customer.id}
                    className="flex-1 cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-muted-foreground">{customer.email}</div>
                  </label>
                </div>
              ))}
              
              {filteredCustomers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No customers found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddSelected}
            disabled={selectedEmails.length === 0}
          >
            Add {selectedEmails.length} Recipient{selectedEmails.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};