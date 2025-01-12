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
import { API_CONFIG } from "@/config/api.config";
import { Rocket, Sparkles, Users } from "lucide-react";

const INITIAL_DISPLAY_COUNT = 4;
const ITEMS_PER_LOAD = 4;

interface ProjectListingsSectionProps {
  projects: Project[];
  title: string;
}

const ProjectListingObject = ({ projects=[], title }: ProjectListingsSectionProps) => {
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isJoiningProject, setIsJoiningProject] = useState<string | null>(null);
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
      await api.delete(API_CONFIG.ENDPOINTS.PROJECTS.DELETE(selectedProjectId));
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
    setIsJoiningProject(projectId);
    try {
      const message = "Request to join the project";
      await api.post(API_CONFIG.ENDPOINTS.PROJECTS.JOIN(projectId), {
        message : message,
        title : projects.find((p) => p.id === projectId)?.title,
      });

      setUpdatedProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                joinRequests: [
                  ...(project.joinRequests || []),
                  {
                    userId: user.uid,
                    username: user.username || "Unknown User",
                    message: message,
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
      setIsJoiningProject(null);
      setIsJoinModalOpen(true);
    }
  };

  return (
    <section className="p-6">
      {/* Enhanced Title Section */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="text-center space-y-4">
          {/* Icon Group */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-200 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full">
                <Rocket className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-purple-200 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="space-y-2">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 inline-block">
              {title}
            </h2>
          </div>

          {/* Decorative Line */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
        {updatedProjects && updatedProjects.length > 0 ? (
          updatedProjects.slice(0, displayCount).map((project) => (
            <div key={project.id} className="flex justify-center transition-transform transform hover:scale-105 hover:shadow-2xl">
              <ProjectCard
                project={project}
                onViewDetails={handleViewDetails}
                onUpdateProject={handleUpdateProject}
                onDeleteProject={handleDeleteProject}
                onJoinProject={handleJoinProject}
                isLoading={isJoiningProject === project.id}
              />
            </div>
          ))
        ) : (
          <div className="text-center col-span-full flex flex-col items-center gap-6 py-8 px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-100 rounded-full blur-lg opacity-50"></div>
              <FaFolderOpen className="text-gray-400 relative z-10" size={100} />
            </div>
            
            <div className="space-y-3 max-w-md">
              <h3 className="text-xl font-semibold text-gray-700">No Projects Available Yet</h3>
            </div>

            <div className="mt-4">
              <Button
                color="primary"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                text-white font-semibold px-8 py-4 rounded-xl shadow-lg transform transition-all 
                hover:scale-105 hover:shadow-xl flex items-center gap-3"
                onClick={() => router.push("/projects/create")}
              >
                <div className="relative bg-blue-400/20 p-2 rounded-lg">
                  <Rocket className="w-5 h-5" />
                </div>
                <span>Start Your Project Journey</span>
              </Button>
              <p className="text-sm text-gray-400 mt-4">
                Create a project and start building something amazing together
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        {updatedProjects && displayCount < updatedProjects.length &&  (
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
        cancelColor="secondary"
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
        onCancel={() => setIsJoinModalOpen(false)}
        showCancelButton={false}
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
