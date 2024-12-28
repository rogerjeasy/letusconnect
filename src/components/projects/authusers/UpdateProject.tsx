"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, 
    // CardFooter, Button, Spinner 
} from "@nextui-org/react";
// import { FaSave, FaUndo } from "react-icons/fa";
import { Project } from "@/store/project";
import { api, handleError } from "@/helpers/api";
import ProjectDetailsForm from "../../projects/ProjectDetailsForm";
import ModalPopup from "../../forms/ModalPopup";
import ProjectTaskFormDetails from "../ProjectTaskFormDetails";
import AccessDenied from "@/components/accessdenied/AccessDenied";
import { useUserStore } from "@/store/userStore";

interface UpdateProjectProps {
  project: Project;
}

const UpdateProject = ({ project }: UpdateProjectProps) => {
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
  });

  const user = useUserStore((state) => state.user);
  const { isAuthenticated } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [modalProps, setModalProps] = useState({
    isOpen: false,
    title: "",
    content: "",
    onConfirm: () => {},
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/api/projects/${project.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalProps({
        isOpen: true,
        title: "Success",
        content: `${response.data.message}. Project updated successfully.`,
        onConfirm: () => setModalProps({ ...modalProps, isOpen: false }),
      });
    } catch (err) {
      const errorMessage = handleError(err);
      setModalProps({
        isOpen: true,
        title: "Error",
        content: `Failed to update project. ${errorMessage}`,
        onConfirm: () => setModalProps({ ...modalProps, isOpen: false }),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      id: project.id,
      title: project.title,
      description: project.description,
      collaborationType: project.collaborationType,
      industry: project.industry,
      skillsNeeded: project.skillsNeeded,
      status: project.status,
      tasks: project.tasks,
      participants: project.participants || [],
    });
  };

  if (!isAuthenticated || !user) {
    return <AccessDenied condition={true} message="Access Denied: You need to Login to your account or create one." />;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto pt-28">
      <Card className="p-6 shadow-lg">
        <ModalPopup {...modalProps} />
        <CardHeader className="text-2xl font-bold mb-4">Update Project</CardHeader>

        <ProjectDetailsForm 
          formData={formData} 
          setFormData={setFormData} 
          isEditable={true} 
        />

        <div className="my-8" /> {/* Added padding between the forms */}

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
      </Card>
    </div>
  );
};

export default UpdateProject;