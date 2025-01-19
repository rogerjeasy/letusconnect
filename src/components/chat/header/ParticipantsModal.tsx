"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { Participants, projectRoles } from '@/store/project';
import { ChatHeaderProps } from "../types/chat";
import { useUserStore } from "@/store/userStore";

// ParticipantsModal Component
type ParticipantActionType = 'block' | 'remove' | 'change_role';

interface ParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participants[];
  currentUserId: string;
  onParticipantAction?: (actionType: ParticipantActionType, participantId: string) => void;
}

const ROLE_ORDER: Record<string, number> = projectRoles.reduce((acc, role, index) => ({
  ...acc,
  [role.toLowerCase()]: projectRoles.length - 1 - index
}), {});

export const ParticipantsModal = ({
  isOpen,
  onClose,
  participants,
  currentUserId,
  onParticipantAction
}: ParticipantsModalProps) => {
  const currentUserIsOwner = participants.find(
    p => p.userId === currentUserId
  )?.role.toLowerCase() === 'owner';

  const currentUserIsModerator = participants.find(
    p => p.userId === currentUserId
  )?.role.toLowerCase() === 'moderator';
  
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.userId === currentUserId) return -1;
    if (b.userId === currentUserId) return 1;
    
    const getRoleOrder = (role: string): number => {
      const lowerRole = role.toLowerCase();
      return ROLE_ORDER[lowerRole] ?? 999;
    };
    
    return getRoleOrder(b.role) - getRoleOrder(a.role);
  });

  const canManageParticipant = (participantRole: string) => {
    const lowerParticipantRole = participantRole.toLowerCase();
    return currentUserIsOwner ? 
      lowerParticipantRole !== 'owner' : 
      currentUserIsModerator && ['member', 'contributor'].includes(lowerParticipantRole);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg mx-auto sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
            Group Participants
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh] pr-4">
          <div className="space-y-3">
            {sortedParticipants.map((participant) => (
              <div
                key={participant.userId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto mb-2 sm:mb-0">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage 
                      src={participant.profilePicture} 
                      alt={participant.username}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-sm sm:text-base">
                      {participant.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base truncate">
                      {participant.username}
                      {participant.userId === currentUserId && " (You)"}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {participant.role}
                    </p>
                  </div>
                </div>

                {participant.userId !== currentUserId && (
                  <div className="self-end sm:self-center ml-auto sm:ml-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <MoreHorizontal className="h-5 w-5 text-green-600 hover:text-green-700 font-bold" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="w-48 sm:w-56"
                      >
                        <DropdownMenuItem
                          onClick={() => window.location.href = `/profile/${participant.userId}`}
                          className="text-sm sm:text-base py-2 cursor-pointer"
                        >
                          View Profile
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => alert('Send private message currently not available from here')}
                          className="text-sm sm:text-base py-2 cursor-pointer"
                        >
                          Send Private Message
                        </DropdownMenuItem>
                        
                        {(currentUserIsOwner || currentUserIsModerator) && 
                         canManageParticipant(participant.role) && (
                          <>
                            {currentUserIsOwner && (
                              <DropdownMenuItem
                                onClick={() => onParticipantAction?.('change_role', participant.userId)}
                                className="text-sm sm:text-base py-2 cursor-pointer"
                              >
                                Change Role
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => onParticipantAction?.('block', participant.userId)}
                              className="text-sm sm:text-base py-2 text-orange-600 cursor-pointer"
                            >
                              Block User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onParticipantAction?.('remove', participant.userId)}
                              className="text-sm sm:text-base py-2 text-red-600 cursor-pointer"
                            >
                              Remove from Group
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};