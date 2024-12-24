"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import {
  FaPlusCircle,
  FaEnvelope,
  FaUserFriends,
  FaCog,
  FaArchive,
} from "react-icons/fa";
import { SVGProps, useState } from "react";
import { FaMessage } from "react-icons/fa6";
import { ModalToCreateGroup } from "./ChatManagementContentModals";

const CreateGroupChatIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaPlusCircle className="text-green-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

const MessageConnectionIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaMessage className="text-blue-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

const BrowseUsersIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaUserFriends className="text-purple-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

const ChatSettingsIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaCog className="text-gray-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

const ArchivedChatsIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaArchive className="text-yellow-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

export default function ChatManagement() {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  
  return (
    <>
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">Chat Management</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Chat Management Options" variant="faded">
        <DropdownSection showDivider title="Quick Actions">
          <DropdownItem
            key="createGroupChat"
            description="Start a new group conversation"
            shortcut="⌘G"
            startContent={<CreateGroupChatIcon />}
            onClick={() => setIsCreateGroupModalOpen(true)}
          >
            Create a Group Chat
          </DropdownItem>
          <DropdownItem
            key="messageConnection"
            description="Message someone in your connections"
            shortcut="⌘M"
            startContent={<MessageConnectionIcon />}
          >
            Message Your Connection
          </DropdownItem>
          <DropdownItem
            key="browseUsers"
            description="Find and connect with other users"
            shortcut="⌘B"
            startContent={<BrowseUsersIcon />}
          >
            Browse All Users
          </DropdownItem>
        </DropdownSection>
        <DropdownSection title="Additional Options">
          <DropdownItem
            key="chatSettings"
            description="Manage your chat settings"
            shortcut="⌘S"
            startContent={<ChatSettingsIcon />}
          >
            Chat Settings
          </DropdownItem>
          <DropdownItem
            key="archivedChats"
            description="View your archived chats"
            shortcut="⌘A"
            startContent={<ArchivedChatsIcon />}
          >
            Archived Chats
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
    {/* Modal to Create Group */}
    <ModalToCreateGroup
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
      />
    </>
  );
}