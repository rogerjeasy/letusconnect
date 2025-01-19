"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { ChatHeaderProps } from "../types/chat";
import { useUserStore } from "@/store/userStore";
import { ParticipantsModal } from "./ParticipantsModal";
import { Participants } from "@/store/project";

type ParticipantActionType = 'block' | 'remove' | 'change_role';

interface ExtendedChatHeaderProps extends ChatHeaderProps {
    participants?: Participants[];
    onParticipantAction?: (actionType: ParticipantActionType, participantId: string) => void;
    onLeaveGroup?: () => void;
  }
  
  export const ChatHeader = ({
    title,
    avatar,
    status,
    membersCount,
    type,
    onSettingsClick,
    participants = [],
    onParticipantAction,
    onLeaveGroup
  }: ExtendedChatHeaderProps) => {
    const currentUser = useUserStore(state => state.user);
    const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  
    const currentUserRole = participants.find(
      p => p.userId === currentUser?.uid
    )?.role.toLowerCase();
  
    const isOwnerOrModerator = currentUserRole === 'owner' || currentUserRole === 'moderator';
  
    const handleGroupAction = () => {
      if (type === 'group') {
        onLeaveGroup?.();
      } else {
        onParticipantAction?.('block', currentUser?.uid || '');
      }
    };
  
    return (
      <>
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Avatar
              className={`h-8 w-8 sm:h-10 sm:w-10 ${
                type === 'group' ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
              }`}
              onClick={() => type === 'group' && setIsParticipantsModalOpen(true)}
            >
              <AvatarImage src={avatar} alt={title} />
              <AvatarFallback>{title[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base truncate">{title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {type === 'group'
                  ? `${membersCount || 0} members`
                  : status || 'Offline'}
              </p>
            </div>
          </div>
         
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              {(type === 'direct' || isOwnerOrModerator) && (
                <DropdownMenuItem 
                  onClick={onSettingsClick}
                  className="text-sm sm:text-base py-2 cursor-pointer"
                >
                  Settings
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={handleGroupAction}
                className="text-sm sm:text-base py-2 text-destructive cursor-pointer"
              >
                {type === 'group' ? 'Leave Group' : 'Block User'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
  
        {type === 'group' && (
          <ParticipantsModal
            isOpen={isParticipantsModalOpen}
            onClose={() => setIsParticipantsModalOpen(false)}
            participants={participants}
            currentUserId={currentUser?.uid || ''}
            onParticipantAction={onParticipantAction}
          />
        )}
      </>
    );
  };