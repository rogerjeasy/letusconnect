"use client";

import React, { useState } from "react";
import { Button, Divider, Modal } from "@nextui-org/react";
import { FaTasks, FaUserPlus, FaUsers, FaCommentDots, FaComments, FaUserFriends } from "react-icons/fa";
import { Project } from "@/store/project";
import InvitedUsersPopup from "./projectpopup/InvitedUsersPopup";
import { GroupChat, BaseMessage } from "@/store/groupChat";
import ModalGroupChat from "@/components/messages/ModalGroupChat";


interface ProjectHeaderDetailsProps {
  project: Project;
  isOwner: boolean;
  unreadMessages: number;
  setShowParticipants: (value: boolean) => void;
  setShowJoinRequests: (value: boolean) => void;
  setIsGroupChatModalOpen: (value: boolean) => void;
  onAddParticipant: (users: Array<{ emailOrUsername: string; role: string }>) => Promise<{ success: boolean; message: string }>;
}

const ProjectHeaderDetails: React.FC<ProjectHeaderDetailsProps> = ({
  project,
  isOwner,
  unreadMessages,
  setShowParticipants,
  setShowJoinRequests,
  setIsGroupChatModalOpen,
  onAddParticipant,
}) => {
  const [showInvitedUsers, setShowInvitedUsers] = useState(false);
  const [groupChat, setGroupChat] = useState<GroupChat | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const handleOpenGroupChat = () => {
    setIsChatModalOpen(true);
  };

  const handleCloseGroupChat = () => {
    setIsChatModalOpen(false);
  };
  

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <div className="relative">
            <Button
            color="primary"
            variant="ghost"
            startContent={<FaTasks />}
            onPress={handleOpenGroupChat}
            isDisabled={loadingChat}
            >
            {loadingChat ? "Loading..." : "Discussion"}
            </Button>
            {unreadMessages > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {unreadMessages}
            </div>
            )}
        </div>
        <Divider orientation="vertical" className="hidden md:block h-6" />
    </div>


      {isOwner && (
        <>
          <div className="flex items-center gap-2">
            <Button
              color={project.joinRequests.length > 0 ? "danger" : "primary"}
              variant="ghost"
              startContent={<FaUserPlus />}
              className={project.joinRequests.length > 0 ? "text-red-500 border-red-500" : ""}
              onPress={() => setShowJoinRequests(true)}
            >
              Join Requests: {project.joinRequests.length}
            </Button>
            <Divider orientation="vertical" className="hidden md:block h-6" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              color="primary"
              variant="ghost"
              startContent={<FaUserFriends />}
              onPress={() => setShowInvitedUsers(true)}
            >
              Invite New Participants: {project.invitedUsers?.length || 0}
            </Button>
            <Divider orientation="vertical" className="hidden md:block h-6" />
          </div>

          <InvitedUsersPopup
            isOpen={showInvitedUsers}
            onClose={() => setShowInvitedUsers(false)}
            project={project}
            onAddParticipant={onAddParticipant}
          />
        </>
      )}

      <div className="flex items-center gap-2">
        <div className="text-sm font-semibold">
          Status: <span className="text-blue-500">{project.status}</span>
        </div>
        <Divider orientation="vertical" className="hidden md:block h-6" />
      </div>

      <div className="flex items-center gap-2">
        <Button color="primary" variant="ghost" startContent={<FaUsers />} onPress={() => setShowParticipants(true)}>
          Participants: {Array.isArray(project.participants) ? project.participants.length : 0}
        </Button>
        <Divider orientation="vertical" className="hidden md:block h-6" />
      </div>

      <div className="flex items-center gap-2">
        <div className="text-sm font-semibold">
          Progress: <span className="text-blue-500">{project.progress}</span>
        </div>
        <Divider orientation="vertical" className="hidden md:block h-6" />
      </div>

      <div className="flex items-center gap-2">
        <div className="text-sm font-semibold">
          Num of Tasks: <span className="text-blue-500">{Array.isArray(project.tasks) ? project.tasks.length : 0}</span>
        </div>
        <Divider orientation="vertical" className="hidden md:block h-6" />
      </div>

      <div className="flex items-center gap-2">
        <Button color="primary" variant="ghost" startContent={<FaCommentDots />}>
          Feedback
        </Button>
        <Divider orientation="vertical" className="hidden md:block h-6" />
      </div>

      <div className="flex items-center gap-2">
        <Button color="primary" variant="ghost" startContent={<FaComments />}>
          Comments
        </Button>
      </div>
      <ModalGroupChat
        isOpen={isChatModalOpen}
        onClose={handleCloseGroupChat}
        groupId={project.id}
        token={localStorage.getItem("token") || ""}
        pinnedMessageIDs={groupChat?.pinnedMessages || []}
        updatePinnedMessages={(groupChatId, messageId, isUnpin) => {
          setGroupChat((prevGroupChat) => {
            if (!prevGroupChat) return null;
            const updatedPinnedMessages = isUnpin
              ? prevGroupChat.pinnedMessages.filter((id) => id !== messageId)
              : [...prevGroupChat.pinnedMessages, messageId];
            return { ...prevGroupChat, pinnedMessages: updatedPinnedMessages };
          });
        }}
      />


    </div>
  );
};

export default ProjectHeaderDetails;