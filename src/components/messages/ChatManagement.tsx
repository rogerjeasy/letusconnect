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
  const [isUserConnectionsModalOpen, setIsUserConnectionsModalOpen] = useState(false);
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
      profilePicture: user.profilePicture || user.username.charAt(0).toUpperCase(),
      role: "Member",
    };

    const newChatEntity: ChatEntity = {
      id: user.uid,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username,
      avatar: user.profilePicture || user.username.charAt(0).toUpperCase(),
      type: "user",
      directMessages: [],
      groupMessages: [],
      participants: [newParticipant],
    };

    addParticipant(user.uid, [newParticipant]);
    addEntity(newChatEntity);
    setIsUsersModalOpen(false);
  };

  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Properly typed modal close handlers
  const handleCreateGroupModalClose = () => {
    setIsCreateGroupModalOpen(false);
  };

  const handleUsersModalClose = () => {
    setIsUsersModalOpen(false);
  };

  return (
    <div 
      className="relative z-[9999]"
    >
      <Dropdown 
        classNames={{
          base: "z-[9999]",
          content: "z-[9999]",
          trigger: "z-[9999]"
        }}
      >
        <DropdownTrigger>
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md hover:bg-gray-100 transition duration-200"
            onClick={handleTriggerClick}
          >
            <FaPlusCircle className="text-green-500 text-2xl" />
          </button>
        </DropdownTrigger>
        <DropdownMenu 
          aria-label="Chat Management Options" 
          variant="faded"
          onAction={(key) => {
            switch(key) {
              case "createGroupChat":
                setIsCreateGroupModalOpen(true);
                break;
              case "messageConnection":
                setIsUserConnectionsModalOpen(true);
                break;
              case "browseUsers":
                setIsUsersModalOpen(true);
                break;
            }
          }}
          className="z-[9999]"
        >
          <DropdownSection showDivider title="Quick Actions">
            <DropdownItem
              key="createGroupChat"
              description="Start a new group conversation"
              shortcut="⌘G"
              startContent={<CreateGroupChatIcon />}
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

      {/* Modal container with highest z-index */}
      <div className="z-[9999] relative">
        {isCreateGroupModalOpen && (
          <ModalToCreateGroup
            isOpen={isCreateGroupModalOpen}
            onClose={handleCreateGroupModalClose}
          />
        )}

        {isUsersModalOpen && (
          <UsersToChatWith
            users={users}
            onSelectUser={handleUserSelect}
            onClose={handleUsersModalClose}
          />
        )}
      </div>
    </div>
  );
}