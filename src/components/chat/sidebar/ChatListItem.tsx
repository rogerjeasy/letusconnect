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
  const getAvatarFallback = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors",
        isActive && "bg-accent"
      )}
    >
      <Avatar>
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between">
          <p className="font-medium">{name}</p>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </div>
        
        {lastMessage && lastMessage.length > 0 && (
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
            {lastMessage}
          </p>
        )}
      </div>
    </button>
  );
};