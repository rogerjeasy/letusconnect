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
      return <Globe className="h-4 w-4" />;
    case 'private':
      return <Lock className="h-4 w-4" />;
    case 'restricted':
      return <ShieldAlert className="h-4 w-4" />;
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
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base sm:text-lg font-medium truncate">
              {group.name || 'Untitled Group'}
            </CardTitle>
            <Badge variant="secondary" className="mt-1 max-w-full truncate">
              {group.category?.name || 'Uncategorized'}
            </Badge>
          </div>
          <div className="flex-shrink-0">
            {getPrivacyIcon(group.privacy)}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-xs sm:text-sm mb-4 line-clamp-2 text-muted-foreground">
          {group.description || 'No description available'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 bg-secondary/20 rounded-md p-2">
            <Users className="h-4 w-4 shrink-0" />
            <span className="truncate">{totalMembers} Members</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/20 rounded-md p-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="truncate">{group.events?.length || 0} Events</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/20 rounded-md p-2">
            <BookOpen className="h-4 w-4 shrink-0" />
            <span className="truncate">{group.resources?.length || 0} Resources</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 flex flex-wrap gap-2 mt-auto">
        <Button
          className="flex-1 min-w-[100px]"
          variant="default"
          onClick={() => onView(group)}
        >
          View Group
        </Button>
        {isAdmin && (
          <>
            <Button
              className="flex-1 min-w-[100px]"
              variant="outline"
              onClick={() => onEdit(group.id)}
            >
              Edit Group
            </Button>
            <DeleteGroupButton onDelete={() => onDelete(group.id)} />
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default GroupCard;