"use client";

import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import ModalPopup from "@/components/forms/ModalPopup";
import { Button } from "@nextui-org/react";
import { Project } from "@/store/project";
import { useRouter } from "next/navigation";
import { api, handleError } from "@/helpers/api";
import { useUserStore } from "@/store/userStore";
import { FaFolderOpen } from "react-icons/fa";

const INITIAL_DISPLAY_COUNT = 4;
const ITEMS_PER_LOAD = 4;

interface ProjectListingsSectionProps {
  projects: Project[];
  title: string;
}

const ProjectListingObject = ({ projects, title }: ProjectListingsSectionProps) => {
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatedProjects, setUpdatedProjects] = useState(projects);
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinModalProps, setJoinModalProps] = useState({
    title: "",
    content: "",
    confirmLabel: "Close",
    confirmColor: "primary" as "primary" | "success" | "warning" | "danger",
  });

  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [loginPromptProps, setLoginPromptProps] = useState({
    title: "Login Required",
    content: "You need to log in to join this exciting project.",
    confirmLabel: "Continue to Login",
    cancelLabel: "Cancel",
  });

  const handleViewDetails = (project: Project) => {
    sessionStorage.setItem("selectedProject", JSON.stringify(project));
    router.push(`/projects/details?id=${project.id}`);
  };

  const handleUpdateProject = (project: Project) => {
    sessionStorage.setItem("selectedProject", JSON.stringify(project));
    router.push(`/projects/update?id=${project.id}`);
  };

  const handleDeleteProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    try {
      await api.delete(`/api/projects/${selectedProjectId}`);
      setUpdatedProjects((prevProjects) => prevProjects.filter((p) => p.id !== selectedProjectId));
      setIsDeleteModalOpen(false);
      setSelectedProjectId(null);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProject = async (projectId: string) => {
    if (!user) {
      setIsLoginPromptOpen(true);
      return;
    }

    setLoading(true);
    try {
      await api.post(`/api/projects/${projectId}/join`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUpdatedProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                joinRequests: [
                  ...project.joinRequests,
                  {
                    userId: user.uid,
                    username: user.username || "Unknown User",
                    message: "Request to join the project",
                    profilePicture: user.profilePicture || "",
                    email: user.email || "",
                    status: "pending",
                  },
                ],
              }
            : project
        )
      ); 

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
        content: errorMessage,
        confirmLabel: "Close",
        confirmColor: "danger",
      });
    } finally {
      setLoading(false);
      setIsJoinModalOpen(true);
    }
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
        {updatedProjects.length > 0 ? (
          updatedProjects.slice(0, displayCount).map((project) => (
            <div key={project.id} className="flex justify-center transition-transform transform hover:scale-105 hover:shadow-2xl">
              <ProjectCard
                project={project}
                onViewDetails={handleViewDetails}
                onUpdateProject={handleUpdateProject}
                onDeleteProject={handleDeleteProject}
                onJoinProject={handleJoinProject}
              />
            </div>
          ))
        ) : (
          <div className="text-center col-span-full text-gray-500 flex flex-col items-center gap-2">
            <FaFolderOpen size={50} />
            <p>No projects available.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        {displayCount < updatedProjects.length && (
          <Button
            color="primary"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105"
            onClick={() => setDisplayCount((prev) => prev + ITEMS_PER_LOAD)}
          >
            See More
          </Button>
        )}
        {displayCount > INITIAL_DISPLAY_COUNT && (
          <Button
            color="danger"
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105"
            onClick={() => setDisplayCount(INITIAL_DISPLAY_COUNT)}
          >
            See Less
          </Button>
        )}
      </div>

      <ModalPopup
        isOpen={isDeleteModalOpen}
        title="Confirm Delete"
        content="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmColor="danger"
        cancelColor="default"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        showCancelButton={true}
      />

      <ModalPopup
        isOpen={isJoinModalOpen}
        title={joinModalProps.title}
        content={joinModalProps.content}
        confirmLabel={joinModalProps.confirmLabel}
        confirmColor={joinModalProps.confirmColor}
        onConfirm={() => setIsJoinModalOpen(false)}
      />

      <ModalPopup
        isOpen={isLoginPromptOpen}
        title={loginPromptProps.title}
        content={loginPromptProps.content}
        confirmLabel={loginPromptProps.confirmLabel}
        cancelLabel={loginPromptProps.cancelLabel}
        confirmColor="primary"
        cancelColor="danger"
        onConfirm={() => {
          setIsLoginPromptOpen(false);
          router.push("/login");
        }}
        onCancel={() => setIsLoginPromptOpen(false)}
        showCancelButton={true}
      />
    </section>
  );
};

export default ProjectListingObject;
