"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/react";
import {
  FaPlusCircle,
  FaEnvelope,
  FaUserFriends,
  FaCog,
  FaArchive,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { SVGProps, useEffect, useState } from "react";
import { ModalToCreateGroup } from "./ChatManagementContentModals";
import UsersToChatWith from "./UsersToChatWith";
import { User } from "@/store/userStore";
import { ChatEntity } from "@/store/chatEntitiesStore";
import { useParticipantsStore } from "@/store/participantsStore";
import { Participants } from "@/store/project";
import { useChatEntitiesStore } from "@/store/chatEntitiesStore";
import { fetchUsersForGroup } from "@/components/messages/HandleParticipants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, UserPlus, Settings, Archive, MessageCircle } from 'lucide-react';

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
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const { addParticipant } = useParticipantsStore();
  const { addEntity } = useChatEntitiesStore();
  const [users, setUsers] = useState<User[]>([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      if (isUsersModalOpen) {
        setLoading(true);
        try {
          const { participants, users } = await fetchUsersForGroup(true);
          setUsers(users || []);
        } catch (error) {
          console.error('Error loading users:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUsers();
  }, [isUsersModalOpen]);

  const handleUserSelect = (user: User) => {
    const newParticipant: Participants = {
      userId: user.uid,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      role: "Member",
    };

    const newChatEntity: ChatEntity = {
      id: user.uid,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username,
      avatar: user.profilePicture,
      type: "user",
      directMessages: [],
      groupMessages: [],
      participants: [newParticipant],
    };

    addParticipant(user.uid, [newParticipant]);
    addEntity(newChatEntity);
    setIsUsersModalOpen(false);
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md hover:bg-gray-100 transition duration-200">
            <FaPlusCircle className="text-green-500 text-2xl" />
          </button>
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
              onClick={() => setIsUsersModalOpen(true)}
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

      {/* Modal to Browse Users */}
      {isUsersModalOpen && (
        <UsersToChatWith
          users={users}
          onSelectUser={handleUserSelect}
          onClose={() => setIsUsersModalOpen(false)}
        />
      )}
    </>
  );
}