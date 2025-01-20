"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChatListItemProps {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  unreadCount?: number;
  isActive?: boolean;
  type: 'direct' | 'group';
  onClick: () => void;
}

export const ChatListItem = ({
  name,
  avatar,
  lastMessage,
  unreadCount = 0,
  isActive = false,
  onClick
}: ChatListItemProps) => {
  const getAvatarFallback = (displayName: string): string => {
    if (!displayName || typeof displayName !== 'string') return '?';
    const trimmedName = displayName.trim();
    if (!trimmedName) return '?';
   
    // Handle names with spaces (e.g., get initials)
    if (trimmedName.includes(' ')) {
      const initials = trimmedName
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
      return initials || '?';
    }
   
    return trimmedName.charAt(0).toUpperCase();
  };

  const displayName = name || 'Unknown User';
  const displayMessage = !lastMessage || lastMessage.trim().length === 0
    ? 'Start a conversation'
    : lastMessage;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors",
        isActive && "bg-accent"
      )}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={avatar} alt={displayName} />
          <AvatarFallback>{getAvatarFallback(displayName)}</AvatarFallback>
        </Avatar>
        {unreadCount > 0 && (
          <Badge
            variant="default"
            className="absolute -top-2 -left-2 h-5 min-w-[20px] text-xs bg-emerald-500 hover:bg-emerald-500 text-white border-2 border-white rounded-full p-0 flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </div>
     
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between">
          <p className="font-medium truncate">{displayName}</p>
        </div>
       
        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
          {displayMessage}
        </p>
      </div>
    </button>
  );
};