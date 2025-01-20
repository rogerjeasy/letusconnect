import React from 'react';
import { DirectMessage } from '@/store/message';
import { BaseMessage } from '@/store/groupChat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { MessageBubbleOptions } from './MessageBubbleOptions';
import { 
  Clock, 
  Check, 
  CheckCheck, 
  Paperclip,
  Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User } from '@/store/userStore';

interface MessageBubbleProps {
  message: BaseMessage | DirectMessage;
  isOwn: boolean;
  isAdmin?: boolean;
  currentUser?: User;
  partnerUsers: Record<string, User>;
}

type MessageReadStatus = {
  [userId: string]: boolean;
};

const hasReadStatus = (message: BaseMessage | DirectMessage): message is BaseMessage & { readStatus: MessageReadStatus } => {
  return 'readStatus' in message && message.readStatus !== undefined;
};

const hasAttachments = (message: BaseMessage | DirectMessage): message is BaseMessage & { attachments: string[] } => {
  return 'attachments' in message && Array.isArray(message.attachments);
};

export const MessageBubble = ({ message, isOwn, isAdmin, currentUser, partnerUsers }: MessageBubbleProps) => {
  const formatMessageTime = (timestamp: string) => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23',
      }).format(new Date(timestamp));
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  const isMessageRead = () => {
    if (hasReadStatus(message)) {
      return Object.values(message.readStatus).some(status => status);
    }
    return false;
  };

  const getProfilePicture = () => {
    if (isOwn && currentUser?.profilePicture) {
      return currentUser.profilePicture;
    }
    if (!isOwn && partnerUsers[message.senderId]?.profilePicture) {
      return partnerUsers[message.senderId].profilePicture;
    }
    return `/api/placeholder/32/32`;
  };

  return (
    <div className={cn(
      "flex items-start gap-3 p-2 hover:bg-gray-50 transition-colors duration-200",
      isOwn ? "flex-row-reverse" : "flex-row"
    )}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
              <AvatarImage src={getProfilePicture()} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium">
                {message.senderName?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{message.senderName}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className={cn(
        "flex flex-col max-w-[70%] space-y-1",
        isOwn ? "items-end" : "items-start"
      )}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {message.senderName}
          </span>
          {isAdmin && (
            <Badge variant="secondary" className="text-xs">Admin</Badge>
          )}
        </div>

        <Card className={cn(
          "shadow-sm",
          isOwn ? "bg-blue-50 border-blue-100" : "bg-white"
        )}>
          <CardHeader className="p-3 pb-0">
            <MessageBubbleOptions
              isAdmin={isAdmin}
              onPin={() => console.log('Pin message')}
              onUnpin={() => console.log('Unpin message')}
              onReply={() => console.log('Reply to message')}
              onForward={() => console.log('Forward message')}
              onCopy={() => console.log('Copy message')}
              onStar={() => console.log('Star message')}
              onDelete={() => console.log('Delete message')}
            />
          </CardHeader>

          <CardContent className="p-3 pt-1">
            <p className="text-sm text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>

            {hasAttachments(message) && message.attachments?.length > 0 && (
              <div className="mt-3 space-y-2 border-t pt-2">
                {message.attachments.map((attachment, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-gray-600 hover:text-blue-600"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="text-xs truncate">{attachment}</span>
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="p-3 pt-0">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{formatMessageTime(message.createdAt)}</span>
              {isOwn && (
                <>
                  {isMessageRead() ? (
                    <CheckCheck className="h-3 w-3 text-blue-500" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};