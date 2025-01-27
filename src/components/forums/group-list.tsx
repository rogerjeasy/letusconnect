"use client";

import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Search, 
  SlidersHorizontal, 
  Plus,
  ArrowUpDown,
  Calendar,
  BookOpen,
  Filter,
  Lock,
  Globe,
  ShieldAlert,
  Badge,
  X,
} from 'lucide-react';
import { GroupForum, GroupCategory } from '@/store/groupForum';
import { listGroups } from '@/services/group.forum.service';
import GroupCard from './group-card';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

const GroupList = () => {
  const [groups, setGroups] = useState<GroupForum[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<GroupForum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPrivacy, setSelectedPrivacy] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'members' | 'newest'>('newest');
  const [categories, setCategories] = useState<GroupCategory[]>([]);
  const currentUser = useUserStore(state => state.user);
  const router = useRouter();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const data = await listGroups();
      setGroups(data);
      const uniqueCategories = Array.from(
        new Set(data.map(group => group.category?.name))
      ).filter(Boolean);
      setCategories(
        uniqueCategories.map(name => ({
          name: name as string,
          icon: '',
          description: '',
          count: data.filter(g => g.category?.name === name).length
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...groups];

    if (searchTerm) {
      result = result.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(group => group.category?.name === selectedCategory);
    }

    if (selectedPrivacy !== 'all') {
      result = result.filter(group => group.privacy === selectedPrivacy);
    }

    result = result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'members':
          return (b.members?.length || 0) - (a.members?.length || 0);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredGroups(result);
  }, [groups, searchTerm, selectedCategory, selectedPrivacy, sortBy]);

  const handleViewGroup = (group: GroupForum) => {
    router.push(`/groups/${group.id}`);
  };

  const handleEditGroup = (groupId: string) => {
    router.push(`/groups/${groupId}/edit`);
  };

  const handleDeleteGroup = async (groupId: string) => {
    // Implement delete functionality
    console.log('Delete group:', groupId);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton key={n} className="h-[340px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top bar with search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPrivacy} onValueChange={setSelectedPrivacy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Privacy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="restricted">Restricted</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('members')}>
                Most Members
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('newest')}>
                Newest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results count and active filters */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{filteredGroups.length} groups found</span>
        <div className="flex gap-2">
          {searchTerm && (
            <Badge color="secondary" className="gap-1">
              Search: {searchTerm}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm('')} />
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge color="secondary" className="gap-1">
              Category: {selectedCategory}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
            </Badge>
          )}
        </div>
      </div>

      {/* Groups grid */}
      <ScrollArea className="h-[calc(100vh-220px)]">
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                currentUser={currentUser}
                onView={handleViewGroup}
                onEdit={handleEditGroup}
                onDelete={handleDeleteGroup}
              />
            ))}
          </div>
        ) : (
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
        )}
      </ScrollArea>
    </div>
  );
};

export default GroupList;