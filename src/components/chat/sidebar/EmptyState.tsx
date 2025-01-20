import { MessageSquare, Users, LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserToChatWith } from "./UserToChatWith";
import { User } from '@/store/userStore';
import { Message } from '@/store/message';

interface EmptyStateProps {
  type?: 'direct' | 'groups';
  icon?: LucideIcon;
  title?: string;
  description?: string;
  className?: string;
  onUserSelect?: (user: any) => void;
  currentUserId?: string;
  currentUser?: User;
}

const defaultStates = {
  direct: {
    icon: MessageSquare,
    title: 'No direct messages yet',
    description: 'Start a conversation with someone'
  },
  groups: {
    icon: Users,
    title: 'No group chats yet',
    description: 'Create or join a group to get started'
  }
} as const;

export const EmptyState = ({
  type,
  icon: CustomIcon,
  title,
  description,
  className,
  onUserSelect,
  currentUserId,
  currentUser
}: EmptyStateProps) => {
  const Icon = type ? defaultStates[type].icon : CustomIcon;
  const displayTitle = type ? defaultStates[type].title : title;
  const displayDescription = type ? defaultStates[type].description : description;

  if (!Icon || !displayTitle || !displayDescription) {
    return null;
  }

  const handleUserSelect = (user: User) => {
    if (onUserSelect) {
      const newDirectMessage: Message = {
        id: `${currentUser?.uid}-${user.uid}`,
        senderId: currentUser?.uid || '',
        senderName: currentUser?.username || '',
        receiverId: user.uid,
        content: '', 
        messageType: 'text',
        attachments: [],
        createdAt: new Date().toISOString(),
        readStatus: false,
      };
      onUserSelect(newDirectMessage);
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center h-64 text-gray-500",
      className
    )}>
      <Icon className="h-12 w-12 mb-4 opacity-50" />
      <p className="text-sm font-medium mb-1">{displayTitle}</p>
      <p className="text-xs text-gray-400 mb-4">{displayDescription}</p>
      
      {type === 'direct' && (
        <UserToChatWith
          trigger={
            <Button variant="secondary" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Start Conversation
            </Button>
          }
          onUserSelect={handleUserSelect}
          currentUserId={currentUser?.uid}
        />
      )}
    </div>
  );
};