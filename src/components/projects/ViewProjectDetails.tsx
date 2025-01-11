"use client";

import React, { useState, useEffect } from "react";
import ProjectDetailsForm from "../../components/projects/ProjectDetailsForm";
import ProjectTaskFormDetails from "../../components/projects/ProjectTaskFormDetails";
import AssignedToComponent from "../../components/projects/authusers/AssignedToComponent";
import { Card, CardHeader, Divider, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { FaTasks, FaUserPlus, FaChartLine, FaCommentDots, FaComments, FaUsers, FaArrowLeft, FaClock } from "react-icons/fa";
import { Project } from "@/store/project";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { api, handleError } from "@/helpers/api";
import ModalPopup from "../forms/ModalPopup";
import JoinedRequestManagement from "./authusers/JoinedRequestManagement";
import GroupChatModal from "@/components/messages/GroupChatModal";
import ProjectHeaderDetails from "./ProjectHeaderDetails";
import { API_CONFIG } from "@/config/api.config";
import { InvitedUser, InviteResponse } from "@/store/project";


interface ViewProjectDetailsProps {
  project: Project;
}

const ViewProjectDetails = ({ project }: ViewProjectDetailsProps) => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [unreadMessages, setUnreadMessages] = useState(0);


  const [formData, setFormData] = useState({
    id: project.id,
    title: project.title,
    description: project.description,
    collaborationType: project.collaborationType,
    industry: project.industry,
    skillsNeeded: project.skillsNeeded,
    status: project.status,
    tasks: project.tasks,
    participants: project.participants || [],
    comments: project.comments || [],
    joinRequests: project.joinRequests || [],
    progress: project.progress || "0%",
    ownerId: project.ownerId || "",
    ownerUsername: project.ownerUsername || "",
    academicFields: project.academicFields || [],
    invitedUsers: project.invitedUsers || [],
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: project.updatedAt || new Date().toISOString(),
  });

  const [showParticipants, setShowParticipants] = useState(false);
  const [showJoinRequests, setShowJoinRequests] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false);
  const [joinModalProps, setJoinModalProps] = useState({
    title: "",
    content: "",
    confirmLabel: "Close",
    confirmColor: "primary" as "primary" | "success" | "warning" | "danger",
  });

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (formData.id) {
        console.log(`Fetching unread messages for project ID: ${formData.id}`);
        const unreadMessagesCount = await countUnreadMessages(formData.id);
        setUnreadMessages(unreadMessagesCount);
        console.log(`Unread messages: ${unreadMessagesCount}`);
      }
    };
  
    fetchUnreadMessages();
  }, [formData.id]);
  

  // Check if the current user is an owner
  const isOwner = Boolean(
    user && Array.isArray(formData.participants) && formData.participants.some(
      (participant) => participant.userId === user.uid && participant.role === "owner"
    )
  );  

    // Check if the user is a participant
    const isParticipant =
    user && Array.isArray(formData.participants) && formData.participants.some(
    (participant) => participant.userId === user.uid
    );

    // Check if the user is in the join requests list
    const isInJoinRequests =
    user && Array.isArray(formData.joinRequests) && formData.joinRequests.some(
    (request) => request.userId === user.uid
    );

  // Handle joining a project
  const handleJoinProject = async () => {
    if (!user) {
      setJoinModalProps({
        title: "Login Required",
        content: "You need to log in to join this project.",
        confirmLabel: "Go to Login",
        confirmColor: "primary",
      });
      setIsJoinModalOpen(true);
      return;
    }

    try {
      await api.post(API_CONFIG.ENDPOINTS.PROJECTS.JOIN(formData.id), null);

      setFormData((prev) => ({
        ...prev,
        joinRequests: [
          ...prev.joinRequests,
          {
            userId: user.uid,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture || "",
            message: "Request to join the project",
            status: "pending",                    
          },
        ],
      }));

      setJoinModalProps({
        title: "Success",
        content: "Join request sent successfully!",
        confirmLabel: "Close",
        confirmColor: "success",
      });
    } catch (err) {
      const errorMessage = handleError(err);
      setJoinModalProps({
        title: "Error",
        content: `Failed to send join request. ${errorMessage}`,
        confirmLabel: "Close",
        confirmColor: "danger",
      });
    } finally {
      setIsJoinModalOpen(true);
    }
  };

  // Function to refresh project data
    const refreshProjectData = async () => {
        try {
        const response = await api.get(API_CONFIG.ENDPOINTS.PROJECTS.BY_ID(formData.id));
        setFormData(response.data);
        } catch (err) {
        handleError(err);
        }
    };

    const handleAddParticipant = async (users: Array<{ emailOrUsername: string; role: string }>): Promise<{ success: boolean; message: string }> => {
      try {
        const response = await api.post<InviteResponse>(
          API_CONFIG.ENDPOINTS.PROJECTS.INVITE(formData.id),
          { users }
        );
  
        const responseData = response.data;
  
        if (responseData.successfulInvites?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            invitedUsers: [
              ...prev.invitedUsers,
              ...responseData.successfulInvites.map((invite) => ({
                userId: invite.userId,
                username: invite.username,
                email: invite.email,
                profilePicture: invite.profilePicture,
                role: invite.role,
              })),
            ],
          }));
        }
    
        const message = responseData.errors && responseData.errors.length > 0
        ? `Success with some warnings: ${responseData.errors.join(", ")}`
        : responseData.message;

      return { 
        success: true, 
        message: message 
      };
      } catch (error) {
        const errorMessage = handleError(error);
        // console.error("Error inviting participant:", errorMessage);

        return { success: false, message: errorMessage };
      }
    }; 

  const countUnreadMessages = async (projectId: string): Promise<number> => {
    if (!projectId) {
      console.error("Group Chat ID is required");
      return 0;
    }
    
    try {
      // const response = await api.get(`/api/group-chats/unread-messages/count?projectId=${projectId}`, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // });
    
      // Extract the unreadCount from the response
      // const unreadCount = response.data.unreadCount;
      const unreadCount = 0;
      return unreadCount;
    } catch (err) {
      console.error("Failed to fetch unread messages count", err);
      return 0;
    }
  };
             
    
  
  return (
    <div className="p-6 max-w-5xl mx-auto mt-16">
      <Card className="p-6 shadow-lg">
        <CardHeader className="text-2xl font-bold mb-4 flex justify-between items-center">
          <span>Project Details</span>
        </CardHeader>

        {/* Header Section with Dividers */}
        <ProjectHeaderDetails
          project={formData as Project}
          isOwner={isOwner}
          unreadMessages={unreadMessages}
          setShowParticipants={setShowParticipants}
          setShowJoinRequests={setShowJoinRequests}
          setIsGroupChatModalOpen={setIsGroupChatModalOpen}
          onAddParticipant={handleAddParticipant}
        />

        <Divider className="my-4" />

        {/* Project Details Form in Read-Only Mode */}
        <ProjectDetailsForm formData={formData} setFormData={setFormData} isEditable={false} />

        <Divider className="my-6" />

        {/* Task Management Section */}
        <ProjectTaskFormDetails
          tasks={formData.tasks}
          setTasks={(update) =>
            setFormData((prev) => ({
              ...prev,
              tasks: typeof update === "function" ? update(prev.tasks) : update,
            }))
          }
          participants={formData.participants}
          isEditable={false}
        />

        {/* Buttons Section */}
        <div className="flex justify-center gap-4 mt-6">
          <Button color="primary" startContent={<FaArrowLeft />} onClick={() => router.back()}>
            Go Back
          </Button>
          {!isOwner && !isParticipant && (
            isInJoinRequests ? (
              <Button color="warning" startContent={<FaClock />} disabled>
                Waiting Approval
              </Button>
            ) : (
              <Button color="secondary" onClick={handleJoinProject}>
                Join Now
              </Button>
            )
          )}
        </div>
        {/* Modal for Viewing Participants */}
        <Modal isOpen={showParticipants} onClose={() => setShowParticipants(false)} size="md">
          <ModalContent>
            <ModalHeader>Participants</ModalHeader>
            <ModalBody>
              <AssignedToComponent users={formData.participants} onlyView={true} />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => setShowParticipants(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Join Request Result Modal */}
        <ModalPopup
            isOpen={isJoinModalOpen}
            title={joinModalProps.title}
            content={joinModalProps.content}
            confirmLabel={joinModalProps.confirmLabel}
            confirmColor={joinModalProps.confirmColor}
            onConfirm={() => {
                setIsJoinModalOpen(false);
                if (joinModalProps.confirmLabel === "Go to Login") {
                router.push("/login");
                }
            }}
            showCancelButton={true}
            cancelColor="danger"
            onCancel={() => setIsJoinModalOpen(false)}
        />


        {/* Modal for Join Requests */}
        <Modal isOpen={showJoinRequests} onClose={() => setShowJoinRequests(false)} size="lg">
          <ModalContent>
            <ModalHeader>Join Requests</ModalHeader>
            <ModalBody>
            <JoinedRequestManagement
                joinRequests={formData.joinRequests}
                projectId={formData.id}
                onUpdate={refreshProjectData}
                onClose={() => {
                    setShowJoinRequests(false);
                    refreshProjectData(); // Refresh project details after handling join requests
                }}
            />
            </ModalBody>
          </ModalContent>
        </Modal>

      </Card>
      {/* Group Chat Modal */}

        {isGroupChatModalOpen && (
        <GroupChatModal
            projectTitle={formData.title}
            participants={formData.participants}
            onClose={() => setIsGroupChatModalOpen(false)}
            currentUserId={user?.uid || ""}
            projectId={formData.id}
        />
        )}

    </div>
  );
};

export default ViewProjectDetails;
