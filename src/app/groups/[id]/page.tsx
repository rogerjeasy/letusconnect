"use client";

import { useEffect, useState } from 'react';
import { GroupForum } from '@/store/groupForum';
import GroupDetails from '@/components/forums/group-forum-details';
import { getGroupById } from '@/services/group.forum.service';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function GroupPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const [group, setGroup] = useState<GroupForum | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await getGroupById(id);
        setGroup(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch group');
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-48 md:h-64 w-full rounded-lg" />
        <div className="flex justify-between">
          <Skeleton className="h-20 w-64" />
          <Skeleton className="h-20 w-64" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertDescription>Group not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Button 
        variant="ghost" 
        className="flex items-center gap-2 w-fit mb-4 ml-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <GroupDetails group={group} />
    </div>
  );
}