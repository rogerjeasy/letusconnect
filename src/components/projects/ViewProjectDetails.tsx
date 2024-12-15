"use client";

import React, { useState } from "react";
import ProjectDetailsForm from "../../components/projects/ProjectDetailsForm";
import ProjectTaskFormDetails from "../../components/projects/ProjectTaskFormDetails";
import { Card, CardHeader, Divider, Button } from "@nextui-org/react";
import {
  FaTasks,
  FaEdit,
  FaUserPlus,
  FaChartLine,
  FaCommentDots,
  FaComments,
  FaBoxOpen,
} from "react-icons/fa";
import { Project } from "@/store/project";

interface ViewProjectDetailsProps {
  project: Project;
}

const ViewProjectDetails = ({ project }: ViewProjectDetailsProps) => {
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

  return (
    <div className="p-6 max-w-5xl mx-auto pt-28">
      <Card className="p-6 shadow-lg">
        <CardHeader className="text-2xl font-bold mb-4">Project Details</CardHeader>

        {/* Header Section with Dividers */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button color="primary" variant="ghost" startContent={<FaTasks />}>
              Discussion
            </Button>
            <Divider orientation="vertical" className="hidden md:block h-6" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              color={formData.joinRequests.length > 0 ? "danger" : "primary"}
              variant="ghost"
              startContent={<FaUserPlus />}
              className={formData.joinRequests.length > 0 ? "text-red-500 border-red-500" : ""}
            >
              Join Requests: {formData.joinRequests.length}
            </Button>
            <Divider orientation="vertical" className="hidden md:block h-6" />
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">
              Status: <span className="text-blue-500">{formData.status}</span>
            </div>
            <Divider orientation="vertical" className="hidden md:block h-6" />
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">
              Participants: <span className="text-blue-500">{formData.participants.length}</span>
            </div>
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
      </Card>
    </div>
  );
};

export default ViewProjectDetails;
