
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Link,
  ListOrdered,
  List
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";

export const Toolbar = () => {
  return (
    <div className="flex items-center gap-0.5 border rounded-md p-1">
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Underline className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
};
