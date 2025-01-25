import React, { useEffect, useState } from 'react';
import { GroupForum } from '@/store/groupForum';
import { listOwnerAndMemberGroups } from '@/services/group.forum.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, BookOpen, Lock, Globe, ShieldAlert, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStore } from '@/store/userStore';

const MyGroupForums = () => {
  const [groups, setGroups] = useState<GroupForum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
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

  const getPrivacyIcon = (privacy: string | undefined) => {
    switch (privacy) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
      case 'restricted': return <ShieldAlert className="h-4 w-4" />;
      default: return null;
    }
  };

  const getSafeCategoryName = (category: GroupForum['category']) => {
    return category?.name ? category.name.charAt(0).toUpperCase() + category.name.slice(1) : 'Uncategorized';
  };

  const getArrayLength = (arr: any[] | null | undefined) => {
    return arr?.length || 0;
  };

  const getCategoryColor = (category: string | undefined) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'research': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-yellow-100 text-yellow-800';
      case 'projects': return 'bg-pink-100 text-pink-800';
      case 'mentorship': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderGroupCard = (group: GroupForum) => (
    <Card key={group.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{group.name || 'Untitled Group'}</CardTitle>
            <Badge variant="secondary" className={`mt-1 ${getCategoryColor(group.category?.name)}`}>
              {getSafeCategoryName(group.category)}
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
            <span>{getArrayLength(group.members)} Members</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/20 rounded-md p-2">
            <Calendar className="h-4 w-4" />
            <span>{getArrayLength(group.events)} Events</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/20 rounded-md p-2">
            <BookOpen className="h-4 w-4" />
            <span>{getArrayLength(group.resources)} Resources</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button
          className="w-full"
          variant="default"
          onClick={() => router.push(`/groups/${group.id}`)}
        >
          View Group
        </Button>
      </CardFooter>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-4">
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
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
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

      {groups.length > 0 ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Groups</TabsTrigger>
            <TabsTrigger value="owner">Groups I Own</TabsTrigger>
            <TabsTrigger value="member">Groups I'm In</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-250px)]">
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map(renderGroupCard)}
              </div>
            </TabsContent>

            <TabsContent value="owner">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.filter(g => g.admins?.some(admin => admin.uid === 'currentUserId')).map(renderGroupCard)}
              </div>
            </TabsContent>

            <TabsContent value="member">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.filter(g => g.members?.some(member => member.userId === 'currentUserId')).map(renderGroupCard)}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
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
    </div>
  );
};

export default MyGroupForums;