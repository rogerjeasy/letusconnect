"use client";

import React, { useState } from "react";
import { Button, Divider, Modal } from "@nextui-org/react";
import { FaTasks, FaUserPlus, FaUsers, FaCommentDots, FaComments, FaUserFriends } from "react-icons/fa";
import { Project } from "@/store/project";
import InvitedUsersPopup from "./projectpopup/InvitedUsersPopup";
import { api, handleError } from "@/helpers/api";
import { GroupChat, BaseMessage } from "@/store/groupChat";
import ModalGroupChat from "@/components/messages/ModalGroupChat";


interface ProjectHeaderDetailsProps {
  project: Project;
  isOwner: boolean;
  setShowParticipants: (value: boolean) => void;
  setShowJoinRequests: (value: boolean) => void;
  setIsGroupChatModalOpen: (value: boolean) => void;
  onAddParticipant: (emailOrUsername: string, role: string) => Promise<{ success: boolean; message: string }>;
}

const ProjectHeaderDetails: React.FC<ProjectHeaderDetailsProps> = ({
  project,
  isOwner,
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
      <Button
        color="primary"
        variant="ghost"
        startContent={<FaTasks />}
        onClick={handleOpenGroupChat}
        isDisabled={loadingChat} 
        >
        {loadingChat ? "Loading..." : "Discussion"}
        </Button>

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
              onClick={() => setShowJoinRequests(true)}
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
              onClick={() => setShowInvitedUsers(true)}
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
        <Button color="primary" variant="ghost" startContent={<FaUsers />} onClick={() => setShowParticipants(true)}>
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
      />

    </div>
  );
};

export default ProjectHeaderDetails;