"use client";

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "@nextui-org/react";
import { FaEllipsisV, FaThumbtack, FaReply, FaTrash, FaEdit } from "react-icons/fa";

interface MessageManagementProps {
  onPinMessage?: () => void;
  onReply?: () => void;
  onEditMessage?: () => void;
  onDeleteMessage?: () => void;
}

const PinIcon = () => <FaThumbtack className="text-blue-500 text-xl pointer-events-none" />;
const ReplyIcon = () => <FaReply className="text-green-500 text-xl pointer-events-none" />;
const EditIcon = () => <FaEdit className="text-yellow-500 text-xl pointer-events-none" />;
const DeleteIcon = () => <FaTrash className="text-red-500 text-xl pointer-events-none" />;

const MessageManagement: React.FC<MessageManagementProps> = ({
  onPinMessage,
  onReply,
  onEditMessage,
  onDeleteMessage,
}) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Tooltip content="More options">
          <span>
            <button
              className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 shadow-md transition duration-200"
              aria-label="Message options"
            >
              <FaEllipsisV className="text-gray-700 text-lg" />
            </button>
          </span>
        </Tooltip>
      </DropdownTrigger>
      <DropdownMenu aria-label="Message Management Options" variant="faded">
        <DropdownItem
          key="pinMessage"
          description="Pin this message"
          startContent={<PinIcon />}
          onClick={onPinMessage}
        >
          Pin Message
        </DropdownItem>
        <DropdownItem
          key="reply"
          description="Reply to this message"
          startContent={<ReplyIcon />}
          onClick={onReply}
        >
          Reply
        </DropdownItem>
        <DropdownItem
          key="editMessage"
          description="Edit this message"
          startContent={<EditIcon />}
          onClick={onEditMessage}
        >
          Edit Message
        </DropdownItem>
        <DropdownItem
          key="deleteMessage"
          description="Delete this message"
          startContent={<DeleteIcon />}
          onClick={onDeleteMessage}
        >
          Delete Message
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default MessageManagement;