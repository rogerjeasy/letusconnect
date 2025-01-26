"use client";

import React, { useEffect, useState } from 'react';
import { GroupForum } from '@/store/groupForum';
import { listOwnerAndMemberGroups } from '@/services/group.forum.service';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, BookOpen, Lock, Globe, ShieldAlert, Plus, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStore } from '@/store/userStore';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from '@/components/ui/badge';
import GroupDetails from "@/components/forums/group-forum-details";

const MyGroupForums = () => {
  const [groups, setGroups] = useState<GroupForum[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupForum | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<'all' | 'owner' | 'member'>('all');
  const currentUser = useUserStore(state => state.user);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await listOwnerAndMemberGroups();
        setGroups(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const filteredGroups = React.useMemo(() => {
    switch(activeFilter) {
      case 'owner':
        return groups.filter(g => g.admins?.some(admin => admin.uid === currentUser?.uid));
      case 'member':
        return groups.filter(g => g.members?.some(member => member.userId === currentUser?.uid));
      default:
        return groups;
    }
  }, [groups, activeFilter, currentUser]);

  const getPrivacyIcon = (privacy: string | undefined) => {
    switch (privacy) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
      case 'restricted': return <ShieldAlert className="h-4 w-4" />;
      default: return null;
    }
  };

  const renderGroupCard = (group: GroupForum) => {
    const handleViewGroup = () => {
      setSelectedGroup(group);
      router.push(`/groups/${group.id}`);
    };

    return (
      <Card key={group.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-medium">{group.name || 'Untitled Group'}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                {group.category?.name || 'Uncategorized'}
              </Badge>
            </div>
            {getPrivacyIcon(group.privacy)}
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm mb-4 line-clamp-2 text-muted-foreground">
            {group.description || 'No description available'}
          </p>
          
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2 bg-secondary/20 rounded-md p-2">
              <Users className="h-4 w-4" />
              <span>{(group.admins?.length || 0) + (group.members ? group.members.length : 0)} Members</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/20 rounded-md p-2">
              <Calendar className="h-4 w-4" />
              <span>{group.events?.length || 0} Events</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/20 rounded-md p-2">
              <BookOpen className="h-4 w-4" />
              <span>{group.resources?.length || 0} Resources</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4 flex gap-2">
          <Button
            className="flex-1"
            variant="default"
            onClick={handleViewGroup}
          >
            View Group
          </Button>
          {group.admins?.some(admin => admin.uid === currentUser?.uid) && (
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => router.push(`/groups/${group.id}/edit`)}
            >
              Edit Group
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  const SidebarContent = () => (
    <div className="h-screen p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>
      <Separator />
      <div className="space-y-2">
        <Button 
          variant={activeFilter === 'all' ? "default" : "ghost"}
          className="w-full justify-start" 
          onClick={() => setActiveFilter('all')}
        >
          <Users className="mr-2 h-4 w-4" />
          All Groups
        </Button>
        <Button 
          variant={activeFilter === 'owner' ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveFilter('owner')}
        >
          <ShieldAlert className="mr-2 h-4 w-4" />
          Groups I Own
        </Button>
        <Button 
          variant={activeFilter === 'member' ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveFilter('member')}
        >
          <Users className="mr-2 h-4 w-4" />
          Groups I&apos;m In
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl py-6 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl py-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (selectedGroup) {
    return (
      <div className="flex flex-col">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 w-fit mb-4"
          onClick={() => setSelectedGroup(null)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Groups
        </Button>
        <GroupDetails group={selectedGroup} />
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar for larger screens */}
      <aside className="hidden lg:block w-64 border-r min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden fixed bottom-4 right-4 z-50">
            <Users className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">My Groups</h1>
              <p className="text-muted-foreground mt-1">Manage and explore your group forums</p>
            </div>
            <Button onClick={() => router.push('/groups/create')} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Group
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            {filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredGroups.map(renderGroupCard)}
              </div>
            ) : (
              <Card className="text-center p-8">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">No Groups Found</h3>
                  <p className="text-muted-foreground">Create a new group or join existing ones to get started!</p>
                  <Button onClick={() => router.push('/groups/create')} className="mt-4">
                    Create Your First Group
                  </Button>
                </CardContent>
              </Card>
            )}
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};

export default MyGroupForums;