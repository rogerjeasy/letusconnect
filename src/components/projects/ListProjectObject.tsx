"use client";

import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import ModalPopup from "@/components/forms/ModalPopup";
import { Card, CardFooter, Pagination } from "@nextui-org/react";
import { Project } from "@/store/project";
import { FaFolderOpen } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { api, handleError } from "@/helpers/api";
import { useUserStore } from "@/store/userStore";

const ITEMS_PER_PAGE = 3;

interface ProjectListingsSectionProps {
  projects: Project[];
  title: string;
}

const ProjectListingObject = ({ projects, title }: ProjectListingsSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  // Calculate the current projects to display based on the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  // Handler for viewing project details
  const handleViewDetails = (project: Project) => {
    sessionStorage.setItem("selectedProject", JSON.stringify(project));
    router.push(`/projects/details?id=${project.id}`);
  };

  // Handler for updating a project
  const handleUpdateProject = (project: Project) => {
    sessionStorage.setItem("selectedProject", JSON.stringify(project));
    router.push(`/projects/update?id=${project.id}`);
  };

  // Handler for deleting a project
  const handleDeleteProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    try {
      await api.delete(`/api/projects/${selectedProjectId}`);
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
      setLoading(false);
      setIsJoinModalOpen(true);
    }
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 mb-6">
        {currentProjects.length > 0 ? (
          currentProjects.map((project) => (
            <div key={project.id} className="flex justify-center">
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

      {projects.length > ITEMS_PER_PAGE && (
        <Card className="p-4 shadow-lg max-w-md mx-auto">
          <CardFooter className="flex justify-center">
            <Pagination
              total={Math.ceil(projects.length / ITEMS_PER_PAGE)}
              initialPage={1}
              page={currentPage}
              onChange={(page) => setCurrentPage(page)}
              showControls
              color="primary"
            />
          </CardFooter>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
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

      {/* Join Request Result Modal */}
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
