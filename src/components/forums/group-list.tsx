"use client";

import React, { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { listGroups } from '@/services/group.forum.service';
import { GroupForum, GroupCategory } from "@/store/groupForum";
import { SearchBar } from './group-search-bar';
import { FilterBar } from './filter-bar';
import { ActiveFilters } from './active-filters';
import { EmptyState } from './empty-state';
import GroupCard from './group-card';

export const GroupList: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            
            <FilterBar
              categories={categories}
              selectedCategory={selectedCategory}
              selectedPrivacy={selectedPrivacy}
              onCategoryChange={setSelectedCategory}
              onPrivacyChange={setSelectedPrivacy}
              onSortChange={setSortBy}
            />
          </div>

          <ActiveFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onClearSearch={() => setSearchTerm('')}
            onClearCategory={() => setSelectedCategory('all')}
            totalResults={filteredGroups.length}
          />
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <ScrollArea className="h-[calc(100vh-320px)]">
            {filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    currentUser={currentUser}
                    onView={() => router.push(`/groups/${group.id}`)}
                    onEdit={() => router.push(`/groups/${group.id}/edit`)}
                    onDelete={async (id) => console.log('Delete group:', id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default GroupList;