"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/react";
import {
  FaCog,
  FaUserPlus,
  FaUserMinus,
  FaTrash,
  FaEdit,
  FaBan,
  FaVolumeMute,
  FaArchive,
  FaBell,
} from "react-icons/fa";
import { SVGProps } from "react";
import { Participants } from "@/store/project";

interface ChatSettingsProps {
  isGroup: boolean;
  participants?: Participants[];
  currentUserId: string;
  onAddUser?: () => void;
  onRemoveUser?: () => void;
  onEditGroup?: () => void;
  onDeleteGroup?: () => void;
  onLeaveGroup?: () => void;
  onBlockUser?: () => void;
  onMuteChat?: () => void;
  onArchiveChat?: () => void;
  onUnmuteChat?: () => void;
}

const AddUserIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaUserPlus className="text-green-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

const RemoveUserIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaUserMinus className="text-red-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

const DeleteGroupIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaTrash className="text-red-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

const EditGroupIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaEdit className="text-blue-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

const BlockUserIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaBan className="text-red-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

const MuteChatIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaVolumeMute className="text-yellow-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

const ArchiveChatIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaArchive className="text-gray-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

const UnmuteChatIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaBell className="text-green-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

export default function ChatSettings({
  isGroup,
  participants = [],
  currentUserId,
  onAddUser,
  onRemoveUser,
  onEditGroup,
  onDeleteGroup,
  onLeaveGroup,
  onBlockUser,
  onMuteChat,
  onArchiveChat,
  onUnmuteChat,
}: ChatSettingsProps) {
  const isAdmin = participants.some(
    (participant) =>
      participant.userId === currentUserId && participant.role === "owner"
  );

  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 shadow-md transition duration-200"
          aria-label="Settings"
        >
          <FaCog className="text-gray-700 text-lg" />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Chat Settings Options" variant="faded">
        {isGroup ? (
          <>
            {isAdmin && (
              <DropdownSection showDivider title="Admin Actions">
                <DropdownItem
                  key="addUser"
                  description="Add a new member to the group"
                  startContent={<AddUserIcon />}
                  onClick={onAddUser}
                >
                  Add Member
                </DropdownItem>
                <DropdownItem
                  key="removeUser"
                  description="Remove a member from the group"
                  startContent={<RemoveUserIcon />}
                  onClick={onRemoveUser}
                >
                  Remove Member
                </DropdownItem>
                <DropdownItem
                  key="editGroup"
                  description="Edit group details"
                  startContent={<EditGroupIcon />}
                  onClick={onEditGroup}
                >
                  Edit Group
                </DropdownItem>
                <DropdownItem
                  key="deleteGroup"
                  description="Delete this group"
                  startContent={<DeleteGroupIcon />}
                  onClick={onDeleteGroup}
                >
                  Delete Group
                </DropdownItem>
              </DropdownSection>
            )}
            {!isAdmin && (
              <DropdownSection showDivider title="User Actions">
                <DropdownItem
                  key="leaveGroup"
                  description="Leave this group"
                  startContent={<RemoveUserIcon />}
                  onClick={onLeaveGroup}
                >
                  Leave Group
                </DropdownItem>
                <DropdownItem
                  key="muteChat"
                  description="Mute notifications for this group"
                  startContent={<MuteChatIcon />}
                  onClick={onMuteChat}
                >
                  Mute Group
                </DropdownItem>
                <DropdownItem
                  key="archiveChat"
                  description="Archive this group"
                  startContent={<ArchiveChatIcon />}
                  onClick={onArchiveChat}
                >
                  Archive Group
                </DropdownItem>
              </DropdownSection>
            )}
          </>
        ) : (
          <DropdownSection showDivider title="Direct Message Actions">
            <DropdownItem
              key="blockUser"
              description="Block this user"
              startContent={<BlockUserIcon />}
              onClick={onBlockUser}
            >
              Block User
            </DropdownItem>
            <DropdownItem
              key="muteChat"
              description="Mute notifications for this chat"
              startContent={<MuteChatIcon />}
              onClick={onMuteChat}
            >
              Mute Chat
            </DropdownItem>
            <DropdownItem
              key="unmuteChat"
              description="Unmute this chat"
              startContent={<UnmuteChatIcon />}
              onClick={onUnmuteChat}
            >
              Unmute Chat
            </DropdownItem>
            <DropdownItem
              key="archiveChat"
              description="Archive this chat"
              startContent={<ArchiveChatIcon />}
              onClick={onArchiveChat}
            >
              Archive Chat
            </DropdownItem>
            <DropdownItem
              key="deleteChat"
              description="Delete this chat"
              startContent={<DeleteGroupIcon />}
              onClick={onDeleteGroup}
            >
              Delete Chat
            </DropdownItem>
          </DropdownSection>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}