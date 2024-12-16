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

interface ViewProjectDetailsProps {
  project: Project;
}

const ViewProjectDetails = ({ project }: ViewProjectDetailsProps) => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

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
  });

  const [showParticipants, setShowParticipants] = useState(false);
  const [showJoinRequests, setShowJoinRequests] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinModalProps, setJoinModalProps] = useState({
    title: "",
    content: "",
    confirmLabel: "Close",
    confirmColor: "primary" as "primary" | "success" | "warning" | "danger",
  });

  // Check if the current user is an owner
  const isOwner = user && formData.participants.some((participant) => participant.userId === user.uid && participant.role === "owner");

  // Check if the user is a participant
  const isParticipant = user && formData.participants.some((participant) => participant.userId === user.uid);

  // Check if the user is in the join requests list
  const isInJoinRequests = user && formData.joinRequests.some((request) => request.userId === user.uid);

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
      await api.post(`/api/projects/${formData.id}/join`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Add the current user to the joinRequests state
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

  return (
    <div className="p-6 max-w-5xl mx-auto pt-28">
      <Card className="p-6 shadow-lg">
        <CardHeader className="text-2xl font-bold mb-4 flex justify-between items-center">
          <span>Project Details</span>
        </CardHeader>

        {/* Header Section with Dividers */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button color="primary" variant="ghost" startContent={<FaTasks />}>
              Discussion
            </Button>
            <Divider orientation="vertical" className="hidden md:block h-6" />
          </div>

          {isOwner && (
            <div className="flex items-center gap-2">
              <Button
                color={formData.joinRequests.length > 0 ? "danger" : "primary"}
                variant="ghost"
                startContent={<FaUserPlus />}
                className={formData.joinRequests.length > 0 ? "text-red-500 border-red-500" : ""}
                onClick={() => setShowJoinRequests(true)}
              >
                Join Requests: {formData.joinRequests.length}
              </Button>
              <Divider orientation="vertical" className="hidden md:block h-6" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">
              Status: <span className="text-blue-500">{formData.status}</span>
            </div>
            <Divider orientation="vertical" className="hidden md:block h-6" />
          </div>

          <div className="flex items-center gap-2">
            <Button color="primary" variant="ghost" startContent={<FaUsers />} onClick={() => setShowParticipants(true)}>
              Participants: {formData.participants.length}
            </Button>
            <Divider orientation="vertical" className="hidden md:block h-6" />
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">
              Progress: <span className="text-blue-500">{formData.progress}</span>
            </div>
            <Divider orientation="vertical" className="hidden md:block h-6" />
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">
              Num of Tasks: <span className="text-blue-500">{formData.tasks.length}</span>
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
        </div>

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
                onUpdate={() => setShowJoinRequests(false)}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Card>
    </div>
  );
};

export default ViewProjectDetails;
