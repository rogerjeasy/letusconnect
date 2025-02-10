"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, BookOpen, Globe, Lock, ShieldAlert, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GroupForum } from '@/store/groupForum';
import { User } from '@/store/userStore';
import DeleteGroupButton from './delete-group-button-dialog';

interface GroupCardProps {
  group: GroupForum;
  currentUser: User | null;
  onView: (group: GroupForum) => void;
  onEdit: (groupId: string) => void;
  onDelete: (groupId: string) => Promise<void>;
}

const getPrivacyIcon = (privacy: string | undefined) => {
  switch (privacy) {
    case 'public':
      return (
        <div className="flex items-center gap-1 text-green-600">
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">Public</span>
        </div>
      );
    case 'private':
      return (
        <div className="flex items-center gap-1 text-amber-600">
          <Lock className="h-4 w-4" />
          <span className="text-xs font-medium">Private</span>
        </div>
      );
    case 'restricted':
      return (
        <div className="flex items-center gap-1 text-red-600">
          <ShieldAlert className="h-4 w-4" />
          <span className="text-xs font-medium">Restricted</span>
        </div>
      );
    default:
      return null;
  }
};

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  currentUser,
  onView,
  onEdit,
  onDelete,
}) => {
  const isAdmin = group.admins?.some(admin => admin.uid === currentUser?.uid);
  const totalMembers = (group.admins?.length || 0) + (group.members?.length || 0);

  return (
    <Card className="group relative h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-card">
      {/* Accent Border */}
      <div className="absolute inset-y-0 left-0 w-1 bg-primary/80 rounded-l" />
      
      <CardHeader className="pb-3 space-y-3">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg font-semibold truncate mb-2">
              {group.name || 'Untitled Group'}
            </CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge 
                variant="outline" 
                className="bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                {group.category?.name || 'Uncategorized'}
              </Badge>
              <span className="inline-flex">{getPrivacyIcon(group.privacy)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {group.description || 'No description available'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 bg-secondary/10 hover:bg-secondary/20 transition-colors rounded-lg p-2.5">
            <Users className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-medium truncate">
              {totalMembers} Members
            </span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/10 hover:bg-secondary/20 transition-colors rounded-lg p-2.5">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-medium truncate">
              {group.events?.length || 0} Events
            </span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/10 hover:bg-secondary/20 transition-colors rounded-lg p-2.5">
            <BookOpen className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-medium truncate">
              {group.resources?.length || 0} Resources
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 flex flex-wrap gap-2">
        <Button
          className="flex-1 min-w-[120px] font-medium"
          variant="default"
          onClick={() => onView(group)}
        >
          View Group
        </Button>
        {isAdmin && (
          <>
            <Button
              className="flex-1 min-w-[120px] font-medium"
              variant="outline"
              onClick={() => onEdit(group.id)}
            >
              Edit Group
            </Button>
            <DeleteGroupButton 
              onDelete={() => onDelete(group.id)} 
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default GroupCard;