"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Textarea,
  Button,
  Select,
  SelectItem,
  Divider,
  Spinner,
} from "@nextui-org/react";
import { FaPlus, FaUndo, FaProjectDiagram, FaUsers, FaPaperclip, FaTasks } from "react-icons/fa";
import { z } from "zod";
import { projectSchema } from "../../../schemas/projectSchema";
import { useUserStore } from "@/store/userStore";
import { api, handleError } from "../../../helpers/api";
import { Task, Participants } from "@/store/project";
import TaskCard from "./TaskCard";
import ModalPopup from "../../forms/ModalPopup";
import { collaborationTypes, industries, skills, statuses } from "../../../store/project";
import AccessDenied from "@/components/accessdenied/AccessDenied";
import { API_CONFIG } from "@/config/api.config";

const ProjectCreationForm = () => {
  const { user, isAuthenticated } = useUserStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    collaborationType: "",
    industry: "",
    skillsNeeded: [] as string[],
    status: "",
    invitedUsers: [],
    attachments: [],
    tasks: [] as Task[],
  });

  const [modalProps, setModalProps] = useState({
    isOpen: false,
    title: "",
    content: "",
    onConfirm: () => {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTaskCard, setShowTaskCard] = useState(false);
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setParticipants([
        {
          userId: user.uid,
          username: user.username,
          role: "owner",
          email: user.email,
          profilePicture: user.profilePicture || "https://i.pravatar.cc/150",
        },
      ]);
    }
  }, [user]);

  // Reset Form
  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      collaborationType: "",
      industry: "",
      skillsNeeded: [],
      status: "",
      invitedUsers: [],
      attachments: [],
      tasks: [],
    });
    setErrors({});
    setShowTaskCard(false);
    setCurrentTask(null);
  };

  // Submit Form
  const handleSubmit = async () => {
    setLoading(true);
    try {
      projectSchema.parse(formData);
      const response = await api.post(API_CONFIG.ENDPOINTS.PROJECTS.BASE,
        { ...formData }
      );
      setModalProps({
        isOpen: true,
        title: "Success",
        content: `${response.data.message}`,
        onConfirm: () => setModalProps({ ...modalProps, isOpen: false }),
      });
      handleReset();
    } catch (err) {
        if (err instanceof z.ZodError) {
          const fieldErrors: Record<string, string> = {};
          err.errors.forEach((error) => {
            if (error.path) {
              fieldErrors[error.path[0]] = error.message;
            }
          });
          setErrors(fieldErrors);
        } else {
          const errorMessage = handleError(err);
          setModalProps({
            isOpen: true,
            title: "Oops!",
            content: `Failed to save project. Please try again. ${errorMessage}`,
            onConfirm: () => setModalProps({ ...modalProps, isOpen: false }),
          });
        }
      } finally {
        setLoading(false);
      }
    };

  // Add Task
  const handleAddTask = (newTask: Task) => {
    setFormData((prev) => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    setShowTaskCard(false);
    setCurrentTask(null);
  };

  // Cancel Task
  const handleCancelTask = () => {
    setShowTaskCard(false);
    setCurrentTask(null);
  };

  // Check if the last task in formData.tasks is valid
  const isLastTaskValid = () => {
    if (formData.tasks.length === 0) return true;
    const lastTask = formData.tasks[formData.tasks.length - 1];
    return lastTask.title.trim() !== "" && lastTask.description.trim() !== "";
  };

  if (!isAuthenticated || !user) {
    return <AccessDenied condition={true} message="Access Denied: You need to Login to your account or create one." />;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto pt-28">
        <Card className="p-6 shadow-lg max-w-5xl mx-auto">
        <ModalPopup
            title={modalProps.title}
            content={modalProps.content}
            confirmLabel="Close"
            onConfirm={modalProps.onConfirm}
            isOpen={modalProps.isOpen}
        />
        <CardHeader className="text-2xl font-bold flex items-center gap-2 mb-4">
            <FaProjectDiagram /> Create a New Project
        </CardHeader>
        <CardBody className="space-y-6">
            {/* Project Details */}
            <Card className="p-4 shadow-md">
            <CardHeader className="text-lg font-semibold flex items-center gap-2">
                Project Required Details
            </CardHeader>
            <CardBody className="space-y-4">
                <Input
                label="Title"
                placeholder="Enter project title"
                value={formData.title}
                className="font-bold"
                isRequired
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                isInvalid={!!errors.title}
                errorMessage={errors.title}
                />
                <Textarea
                label="Description"
                placeholder="Enter project description"
                isRequired
                value={formData.description}
                className="font-bold"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                isInvalid={!!errors.description}
                errorMessage={errors.description}
                />

                {/* Collaboration Type, Industry, and Project Status on the same line */}
                <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                  <Select
                    label="Visibility"
                    placeholder="Select visibility type"
                    className="font-bold"
                    isRequired
                    selectedKeys={formData.collaborationType ? new Set([formData.collaborationType]) : new Set()}
                    onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        setFormData({ ...formData, collaborationType: selectedKey });
                    }}
                    isInvalid={!!errors.collaborationType}
                    errorMessage={errors.collaborationType}
                  >
                  {collaborationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                        {type}
                        </SelectItem>
                  ))}
                  </Select>

                </div>

                <div className="w-full md:w-1/3">
                    <Select
                    label="Industry"
                    placeholder="Select industry"
                    className="font-bold"
                    selectedKeys={formData.industry ? [formData.industry] : []}
                    showScrollIndicators
                    onSelectionChange={(keys) =>
                        setFormData({ ...formData, industry: Array.from(keys)[0] as string })
                    }
                    isInvalid={!!errors.industry}
                    errorMessage={errors.industry}
                    >
                    {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                        {industry}
                        </SelectItem>
                    ))}
                    </Select>
                </div>

                <div className="w-full md:w-1/3">
                    <Select
                    label="Project Status"
                    placeholder="Select project status"
                    className="font-bold"
                    selectedKeys={formData.status ? [formData.status] : []}
                    onSelectionChange={(keys) =>
                        setFormData({ ...formData, status: Array.from(keys)[0] as string })
                    }
                    isInvalid={!!errors.status}
                    errorMessage={errors.status}
                    >
                    {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                        {status}
                        </SelectItem>
                    ))}
                    </Select>
                </div>
                </div>

                <Select
                label="Skills Needed"
                placeholder="Select required skills"
                selectionMode="multiple"
                className="font-bold"
                showScrollIndicators
                selectedKeys={formData.skillsNeeded}
                onSelectionChange={(keys) =>
                    setFormData({ ...formData, skillsNeeded: Array.from(keys) as string[] })
                }
                isInvalid={!!errors.skillsNeeded}
                errorMessage={errors.skillsNeeded}
                >
                {skills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                    {skill}
                    </SelectItem>
                ))}
                </Select>
            </CardBody>
            </Card>


            <Divider />

            {/* Invited Users */}
            <Card className="p-4 shadow-md">
            <CardHeader className="text-lg font-semibold flex items-center gap-2">
                <FaUsers /> Invited Users
            </CardHeader>
            <CardBody>
                <Button color="primary" size="sm">
                <FaPlus className="mr-2" /> Add Users
                </Button>
            </CardBody>
            </Card>

            {/* Attachments */}
            <Card className="p-4 shadow-md">
            <CardHeader className="text-lg font-semibold flex items-center gap-2">
                <FaPaperclip /> Attachments
            </CardHeader>
            <CardBody>
                <Button color="primary" size="sm">
                <FaPlus className="mr-2" /> Add Attachments
                </Button>
            </CardBody>
            </Card>

            {/* Tasks Section */}
            <Card className="p-4 shadow-md">
            <CardHeader className="text-lg font-semibold flex items-center gap-2">
                <FaTasks /> Tasks
            </CardHeader>
            <CardBody>
                {formData.tasks.map((task, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm">
                        <p className="font-semibold">Title: {task.title}</p>
                        <p>Description: {task.description}</p>
                    </div>
                ))}

                {showTaskCard && (
                <TaskCard
                    task={currentTask || {
                    id: "",
                    title: "",
                    description: "",
                    status: "todo",
                    priority: "low",
                    dueDate: new Date(),
                    assignedTo: [],
                    }}
                    users={participants}
                    manageTask={true}
                    creatingProject={true}
                    onSave={handleAddTask}
                    onCancel={handleCancelTask}
                />
                )}

                {!showTaskCard && (
                <Button
                    color="primary"
                    size="sm"
                    className="w-36 bg-blue-500 hover:bg-blue-600"
                    onClick={() => {
                    setCurrentTask({
                        id: "",
                        title: "",
                        description: "",
                        status: "todo",
                        priority: "low",
                        dueDate: new Date(),
                        assignedTo: [],
                    });
                    setShowTaskCard(true);
                    }}
                    disabled={!isLastTaskValid()}
                >
                    <FaPlus className="mr-2 text-green-400" /> Add Task
                </Button>
                )}
            </CardBody>
            </Card>
        </CardBody>

        {/* Buttons Section */}
        <CardFooter className="flex justify-center gap-8 mt-4">
          <Button color="success" onClick={handleSubmit} className="w-32" disabled={loading}>
            {loading ? <Spinner size="sm" color="white" /> : <><FaPlus className="mr-2" /> Create</>}
          </Button>
          <Button color="danger" variant="bordered" onClick={handleReset} className="w-32" disabled={loading}>
            <FaUndo className="mr-2" /> Reset
          </Button>
        </CardFooter>
        </Card>
    </div>
  );
};

export default ProjectCreationForm;