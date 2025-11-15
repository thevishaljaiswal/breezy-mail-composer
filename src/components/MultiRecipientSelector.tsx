import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from 'lucide-react';

export interface Customer {
  id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  project?: string;
  unitNumber?: string;
  customerID?: string;
}

// Sample customer list - in a real app, this would come from a database
const SAMPLE_CUSTOMERS: Customer[] = [
  { 
    id: '1', 
    name: 'Rajesh Kumar', 
    email: 'rajesh.kumar@example.com',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    company: 'Tech Solutions Pvt Ltd',
    phone: '+91 98765 43210',
    project: 'Gera Park View',
    unitNumber: 'A-1201',
    customerID: 'GER001'
  },
  { 
    id: '2', 
    name: 'Priya Sharma', 
    email: 'priya.sharma@example.com',
    firstName: 'Priya',
    lastName: 'Sharma',
    company: 'Sharma Enterprises',
    phone: '+91 98765 43211',
    project: 'Gera World of Joy',
    unitNumber: 'B-502',
    customerID: 'GER002'
  },
  { 
    id: '3', 
    name: 'Amit Patel', 
    email: 'amit.patel@example.com',
    firstName: 'Amit',
    lastName: 'Patel',
    company: 'Patel Industries',
    phone: '+91 98765 43212',
    project: 'Gera Emerald City',
    unitNumber: 'C-703',
    customerID: 'GER003'
  },
  { 
    id: '4', 
    name: 'Sneha Reddy', 
    email: 'sneha.reddy@example.com',
    firstName: 'Sneha',
    lastName: 'Reddy',
    company: 'Reddy Constructions',
    phone: '+91 98765 43213',
    project: 'Gera Song of Joy',
    unitNumber: 'D-304',
    customerID: 'GER004'
  },
  { 
    id: '5', 
    name: 'Vikram Singh', 
    email: 'vikram.singh@example.com',
    firstName: 'Vikram',
    lastName: 'Singh',
    company: 'Singh & Associates',
    phone: '+91 98765 43214',
    project: 'Gera Isle Royale',
    unitNumber: 'E-1505',
    customerID: 'GER005'
  },
  { 
    id: '6', 
    name: 'Anita Desai', 
    email: 'anita.desai@example.com',
    firstName: 'Anita',
    lastName: 'Desai',
    company: 'Desai Exports',
    phone: '+91 98765 43215',
    project: 'Gera Aster Villas',
    unitNumber: 'F-201',
    customerID: 'GER006'
  },
  { 
    id: '7', 
    name: 'Karan Malhotra', 
    email: 'karan.malhotra@example.com',
    firstName: 'Karan',
    lastName: 'Malhotra',
    company: 'Malhotra Group',
    phone: '+91 98765 43216',
    project: 'Gera Trinity Towers',
    unitNumber: 'G-902',
    customerID: 'GER007'
  },
  { 
    id: '8', 
    name: 'Deepika Iyer', 
    email: 'deepika.iyer@example.com',
    firstName: 'Deepika',
    lastName: 'Iyer',
    company: 'Iyer Consulting',
    phone: '+91 98765 43217',
    project: 'Gera Park View',
    unitNumber: 'H-1104',
    customerID: 'GER008'
  },
];

interface MultiRecipientSelectorProps {
  onAddRecipients: (customers: Customer[]) => void;
  recipientType: 'to' | 'cc' | 'bcc';
}

export const MultiRecipientSelector = ({ onAddRecipients, recipientType }: MultiRecipientSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = SAMPLE_CUSTOMERS.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleCustomer = (id: string) => {
    setSelectedCustomers(prev =>
      prev.includes(id)
        ? prev.filter(cid => cid !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  const handleAddSelected = () => {
    if (selectedCustomers.length > 0) {
      const selectedCustomersData = SAMPLE_CUSTOMERS
        .filter(customer => selectedCustomers.includes(customer.id));
      onAddRecipients(selectedCustomersData);
      setSelectedCustomers([]);
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
              {selectedCustomers.length} selected
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedCustomers.length === filteredCustomers.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <ScrollArea className="h-[300px] border rounded-md p-4">
            <div className="space-y-3">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={customer.id}
                    checked={selectedCustomers.includes(customer.id)}
                    onCheckedChange={() => handleToggleCustomer(customer.id)}
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
            disabled={selectedCustomers.length === 0}
          >
            Add {selectedCustomers.length} Recipient{selectedCustomers.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};