"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FaEllipsisH,
  FaThumbtack,
  FaReply,
  FaShare,
  FaCopy,
  FaStar,
  FaTrash,
} from "react-icons/fa";

interface MessageOptionsProps {
  isAdmin?: boolean;
  isPinned?: boolean;
  onPin?: () => void;
  onUnpin?: () => void;
  onReply?: () => void;
  onForward?: () => void;
  onCopy?: () => void;
  onStar?: () => void;
  onDelete?: () => void;
}

export const MessageOptions: React.FC<MessageOptionsProps> = ({
  isAdmin = false,
  isPinned = false,
  onPin,
  onUnpin,
  onReply,
  onForward,
  onCopy,
  onStar,
  onDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Message Options"
        >
          <FaEllipsisH className="text-red-500 text-sm" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Message Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Admin-Specific Options */}
        {isAdmin &&
          (isPinned ? (
            <DropdownMenuItem onClick={onUnpin}>
              <FaThumbtack className="text-gray-500 mr-2" />
              Unpin Message
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={onPin}>
              <FaThumbtack className="text-gray-500 mr-2" />
              Pin Message
            </DropdownMenuItem>
          ))}
        {/* General Options */}
        <DropdownMenuItem onClick={onReply}>
          <FaReply className="text-gray-500 mr-2" />
          Reply
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onForward}>
          <FaShare className="text-blue-500 mr-2" />
          Forward Message
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCopy}>
          <FaCopy className="text-green-500 mr-2" />
          Copy Message
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onStar}>
          <FaStar className="text-yellow-500 mr-2" />
          Star Message
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <FaTrash className="text-red-500 mr-2" />
          Delete Message
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
