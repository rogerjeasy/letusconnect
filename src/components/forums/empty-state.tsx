import React from 'react';
import { Button } from "@/components/ui/button";
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const EmptyState: React.FC = () => {
  const router = useRouter();
  
  return (
    <div className="text-center py-12">
      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Groups Found</h3>
      <p className="text-muted-foreground mb-4">
        Try adjusting your filters or search terms
      </p>
      <Button onClick={() => router.push('/groups/create')}>
        Create a New Group
      </Button>
    </div>
  );
};