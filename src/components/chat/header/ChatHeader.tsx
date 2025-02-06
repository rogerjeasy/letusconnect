"use client";

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { ChatHeaderProps } from "../types/chat";
import { User, useUserStore } from "@/store/userStore";
import { ParticipantsModal } from "./ParticipantsModal";
import { Participants } from "@/store/project";
import { getUserByUid } from '@/services/users.services';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type ParticipantActionType = 'block' | 'remove' | 'change_role';

interface ExtendedChatHeaderProps extends ChatHeaderProps {
    participants?: Participants[];
    onParticipantAction?: (actionType: ParticipantActionType, participantId: string) => void;
    onLeaveGroup?: () => void;
    onDeleteGroup?: (groupId: string) => Promise<void>;
    partnerId?: string;
    groupId?: string;
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
    onLeaveGroup,
    onDeleteGroup,
    partnerId,
    groupId
}: ExtendedChatHeaderProps) => {
    const currentUser = useUserStore(state => state.user);
    const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
    const [partnerUser, setPartnerUser] = useState<User | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const currentUserRole = participants.find(
        p => p.userId === currentUser?.uid
    )?.role.toLowerCase();

    const isOwnerOrModerator = currentUserRole === 'owner' || currentUserRole === 'moderator';

    const getAvatarFallback = (displayName: string): string => {
        if (!displayName || typeof displayName !== 'string') return '?';
        const trimmedName = displayName.trim();
        return trimmedName.charAt(0)?.toUpperCase() || '?';
    };

    const handleGroupAction = () => {
        if (type === 'group') {
            onLeaveGroup?.();
        } else {
            onParticipantAction?.('block', currentUser?.uid || '');
        }
    };

    const handleDeleteGroup = async () => {
        if (!groupId || !onDeleteGroup) return;
        
        try {
            setIsDeleting(true);
            await onDeleteGroup(groupId);
        } catch (error) {
            console.error('Error deleting group:', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    useEffect(() => {
        const fetchPartnerUser = async () => {
            if (type === 'direct' && partnerId) {
                try {
                    const user = await getUserByUid(partnerId);
                    setPartnerUser(user);
                } catch (error) {
                    console.error(`Error fetching user ${partnerId}:`, error);
                }
            }
        };

        fetchPartnerUser();
    }, [type, partnerId]);

    const displayTitle = title || partnerUser?.username || 'Chat';
    const avatarFallback = getAvatarFallback(displayTitle);

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
                        <AvatarImage 
                            src={type === 'direct' ? partnerUser?.profilePicture : avatar} 
                            alt={displayTitle} 
                        />
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base truncate">{displayTitle}</h3>
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
                        {type === 'group' && isOwnerOrModerator && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="text-sm sm:text-base py-2 text-destructive cursor-pointer"
                                >
                                    Delete Group
                                </DropdownMenuItem>
                            </>
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Group Chat</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {title} group chat? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteGroup}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

function useNewWebSocket(arg0: string): { connectionStatus: any; } {
    throw new Error('Function not implemented.');
}
