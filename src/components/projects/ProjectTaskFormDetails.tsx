"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import { FaTasks, FaEdit, FaSave, FaTimes, FaPlus, FaBoxOpen } from "react-icons/fa";
import TaskCard from "../../components/projects/authusers/TaskCard";
import { Task, Participants } from "@/store/project";
import { useUserStore } from "@/store/userStore";

interface ProjectTaskFormDetailsProps {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  participants: Participants[];
  isEditable?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

const ProjectTaskFormDetails = ({
  tasks,
  setTasks,
  participants,
  isEditable = false,
  onSave,
  onCancel,
}: ProjectTaskFormDetailsProps) => {
  const [isEditing, setIsEditing] = useState(isEditable);
  const [showTaskCard, setShowTaskCard] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [initialTasks, setInitialTasks] = useState<Task[]>([...tasks]);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    setInitialTasks([...tasks]);
  }, [tasks]);

  // Check if the current user is an owner
  const isOwner = user && participants.some((participant) => participant.userId === user.uid && participant.role === "owner");

  useEffect(() => {
    if (isOwner && tasks.length === 0) {
      setIsEditing(true);
    }
  }, [isOwner, tasks]);

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
    setShowTaskCard(false);
    setCurrentTask(null);
  };

  const handleCancelTask = () => {
    setShowTaskCard(false);
    setCurrentTask(null);
  };

  const handleCancel = () => {
    setTasks([...initialTasks]);
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) onSave();
  };

  const isLastTaskValid = () => {
    if (tasks.length === 0) return true;
    const lastTask = tasks[tasks.length - 1];
    return lastTask.title.trim() !== "" && lastTask.description.trim() !== "";
  };

  return (
    <Card className="p-4 shadow-md">
      <CardHeader className="text-lg font-semibold flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <FaTasks /> Tasks
        </div>
        {tasks.length > 0 && isOwner && !isEditing && (
          <Button color="primary" size="sm" onClick={() => setIsEditing(true)}>
            <FaEdit className="mr-2" /> Edit
          </Button>
        )}
      </CardHeader>

      <CardBody>
        {tasks.length === 0 ? (
          isOwner ? (
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
            >
              <FaPlus className="mr-2 text-green-400" /> Add New Task
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <FaBoxOpen size={50} />
              <p>No tasks available.</p>
            </div>
          )
        ) : (
          tasks.map((task, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm">
              <p className="font-semibold">Title: {task.title}</p>
              <p>Description: {task.description}</p>
              <p>Status: {task.status}</p>
              <p>Priority: {task.priority}</p>
              <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          ))
        )}

        {isEditing && showTaskCard && (
          <TaskCard
            task={
              currentTask || {
                id: "",
                title: "",
                description: "",
                status: "todo",
                priority: "low",
                dueDate: new Date(),
                assignedTo: [],
              }
            }
            users={participants}
            manageTask={true}
            creatingProject={true}
            onSave={handleAddTask}
            onCancel={handleCancelTask}
          />
        )}

        {isEditing && !showTaskCard && (
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

      {isEditing && (
        <CardFooter className="flex justify-end gap-4">
          <Button color="success" onClick={handleSave} className="w-24">
            <FaSave className="mr-2" /> Save
          </Button>
          <Button color="danger" variant="bordered" onClick={handleCancel} className="w-24">
            <FaTimes className="mr-2" /> Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProjectTaskFormDetails;